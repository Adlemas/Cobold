'use strict'

const fs = require('fs')
const xlsx = require('node-xlsx').default
const path = require('path')

/**
 * Function to parse xlsx file into json file.
 * @param {string} fileToConvert File absolute path to convert
 * @param {string} destFile Destination absolute file path
 * @param {object} options Options for converting. For example: force.
 */
function convert(fileToConvert = "", destFile = "", options = { force: false }) {
    const fileBuffer = fs.readFileSync(fileToConvert)

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
                data.push({
                    "date": row[0].getTime(),
                    "person": row[1],
                    "expense": row[2],
                    "split_between": row[3].split(','),
                })
            }
        });
    });

    if(!fs.existsSync(destFile) || options.force === true) {
        fs.writeFileSync(destFile, JSON.stringify(data, null, 4))
    } else {
        throw new Error(`Failed to convert ${path.basename(fileToConvert)} file into ${path.basename(destFile)}! File ${path.basename(destFile)} already exists!`)
    }
}

if (typeof require !== 'undefined' && require.main === module) {
    convert(path.resolve("../xlsx-files/assessment1.xlsx"), path.resolve("../json-files/assessment1.json"), {
        force: true
    })
}

module.exports = { convert }