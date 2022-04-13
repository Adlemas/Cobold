const fs = require("fs")
const path = require("path")

const convert = require("./src/converter").convert

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    if(array.length <= 0)
        return str

    var header_line = ''
    Object.keys(array[0]).forEach(header => {
        if (header_line != '') header_line += ','

        header_line += header;
    })
    str += header_line + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function parseData(input, options = {
    swapNegative: false,
    output: null
}) {
    const output = options.output

    const friends = {}

    const jsonParsed = typeof input === 'object' && !Buffer.isBuffer(input) ? input : Buffer.isBuffer(input) ? JSON.parse(input.toString("utf-8")) : null
    
    if(jsonParsed === null) {
        throw new Error(`Unexpected format of input:\n`, input)
    }

    jsonParsed.forEach(json => {
        const person = json.person
        const expense = json.expense
        const split_between = json.split_between

        const expenseToOneFriend = Math.ceil(expense / split_between.length)

        if(!friends[person])
            friends[person] = {}

        split_between.forEach(sbp => {
            if(sbp != person) {
                if(!friends[person][sbp])
                    friends[person][sbp] = 0
                friends[person][sbp] += expenseToOneFriend
            }
        })
    })

    const PEOPLE = Object.keys(friends).sort()

    const outputData = {}

    PEOPLE.forEach(person => {
        outputData[person] = {}
        PEOPLE.forEach(owesPerson => {
            if(Object.keys(friends[person]).includes(owesPerson)) {
                outputData[person][owesPerson] = friends[person][owesPerson]
            } else {
                if(Object.keys(friends[owesPerson]).includes(person)) {
                    outputData[person][owesPerson] = -friends[owesPerson][person]
                }
            }
        })
    })

    const dataForCsv = []

    Object.keys(outputData).forEach(friend => {
        Object.keys(outputData[friend]).forEach(owesFriend => {
            const person = friend, amount = outputData[friend][owesFriend], creditor = owesFriend;
            if(amount >= 0 || !options.swapNegative)
                dataForCsv.push({
                    person: person,
                    amount: amount,
                    creditor: creditor
                })
            else if(options.swapNegative === true) 
                dataForCsv.push({
                    person: creditor,
                    amount: Math.abs(amount),
                    creditor: person
                })
        })

    })

    if(output) {
        fs.writeFileSync(output, ConvertToCSV(dataForCsv), {
            encoding: 'utf-8',
        })
    } else
        return dataForCsv
}

function calculate() {
    const filesToParse = fs.readdirSync(path.resolve('./json-files/'))

    filesToParse.forEach(fileToParse => {
        const data = parseData(fs.readFileSync(path.join(path.resolve('./json-files/'), fileToParse)))
        const PEOPLE = Object.keys(data).sort()

        const output = {}

        PEOPLE.forEach(person => {
            output[person] = {}
            PEOPLE.forEach(owesPerson => {
                if(Object.keys(data[person]).includes(owesPerson)) {
                    output[person][owesPerson] = data[person][owesPerson]
                    console.log(`${person} owes to ${owesPerson} ${data[person][owesPerson]}`)
                } else {
                    if(Object.keys(data[owesPerson]).includes(person)) {
                        output[person][owesPerson] = -data[owesPerson][person]
                        console.log(`${person} will receive from ${owesPerson} ${data[owesPerson][person]}`)
                    }
                }
            })
        })

        console.log(output)
    })
}

if (typeof require !== 'undefined' && require.main === module) {
    calculate()
}

module.exports = {
    parse: parseData,
    convert: convert
}