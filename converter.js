'use strict'

const fs = require('fs')
const xlsx = require('node-xlsx').default
const path = require('path')

function convert() {
    const filesToConvert = fs.readdirSync(path.join(__dirname, "/xlsx-files"))

    filesToConvert.filter(file => !file.startsWith(".")).forEach(file => {
        const fileBuffer = fs.readFileSync(path.join(__dirname, "/xlsx-files", file))

        const sheets = xlsx.parse(fileBuffer, {
            cellDates: true,
            cellNF: false,
            cellText: false,
        })

        const data = []
        sheets.forEach(sheet => {
            const rows = sheet.data.slice(1) // We don't need first row with column's titles
            
            rows.forEach((row, i) => {
                row = row.filter(n => n)
                if(row.length >= 7) {
                    console.log(row)
                    console.log(row[0])
                    data.push({
                        "date": row[0].getTime(),
                        "person": row[1],
                        "expense": row[2],
                        "split_between": row[3].split(','),
                        "owes": row[4],
                        "from": row[6]
                    })
                }
            });
        });

        const destFile = path.join(__dirname, "/json-files/", file.replace(/\..*$/i, '.json'))
        
        if(!fs.existsSync(destFile) || (process.argv.slice(2).length && process.argv.slice(2)[0] == "force")) {
            fs.writeFileSync(destFile, JSON.stringify(data, null, 4))
        } else {
            console.log(process.argv)
            console.log(`Failed to convert ${file} file into ${path.basename(destFile)}! File ${path.join(destFile)} already exists!`)
        }
    });
}

if (typeof require !== 'undefined' && require.main === module) {
    convert()
}

module.exports = convert