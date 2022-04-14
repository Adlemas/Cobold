# Cobold Assessment

This is solution for assessment from Cobold about five friends and splitting money between them.

| Date     | Person | Expense | Split between |
|----------|--------|---------|---------------|
| 01/01/21 | A      | 304     | A,B,C         |
| 01/01/21 | B      | 200     | B,C           |
| 02/01/21 | A      | 540     | A,D,C,E       |
| 02/01/21 | C      | 2400    | D,C,E         |
| 02/01/21 | D      | 342     | D,C,A,B       |
| 03/01/21 | E      | 1210    | E,A,B,D       |
| 04/01/21 | D      | 214     | E,A           |
| 04/01/21 | A      | 300     | A,B,C         |
| 05/01/21 | B      | 1200    | E,D,B         |
| 05/01/21 | C      | 400     | A,C           |
| 05/01/21 | D      | 354     | A,B,D         |
| 06/01/20 | E      | 1000    | A,E           |
| 06/01/21 | D      | 400     | D,A           |
| 06/01/21 | C      | 1034    | A,B,D,C       |
| 07/01/21 | A      | 500     | A,E           |
| 07/01/21 | E      | 600     | C,D,E         |


## Preparing

&emsp;Assessment says that input file will be json, but I created converter that can convert all xlsx files in "xlsx-files" folder into json files which will be moved into "json-files" folder.

&emsp;Any Excel file in "xlsx-files" directory must be in same format as files in this folder.

***

### Converter usage:

```console
$ npm run convert
```

&emsp;If the destination file already exists, the terminal will warn you that the destination file already exists. To start the converter with the ability to overwrite files, specify the "force" argument in the terminal command.

Force argument example:

```console
$ npm run convert force
```

## Usage

### As module or library:

```javascript
const owesAnalyzer = require("money-splitter")

// Converter example.
owesAnalyzer.convert("./to-convert.xlsx", "./converted.json", {
    force: true
});

const jsonBuff = fs.readFileSync("./test.json")

/**
 *  First way to save output into a csv file.
 * There you need to pass buffer of json file with data
 * and destination path for output csv file.
 */
owesAnalyzer.parse(jsonBuff, {
    output: "./output.csv"
})

const dataJson = [
    {
        "date": 1609448344000,
        "person": "A",
        "expense": 304,
        "split_between": [
            "A",
            "B",
            "C"
        ]
    },
    {
        "date": 1609448344000,
        "person": "B",
        "expense": 200,
        "split_between": [
            "B",
            "C"
        ]
    },
    ...
];

/**
 * Second way to store output in variable.
 * Also you can pass data as javascript object.
 */
const data = owesAnalyzer.parse(dataJson, {
    swapNegative: false
})

console.log(data)

// Output:
// {
//   A: { B: 202, C: 337, D: 135, E: 135 },
//   B: { A: -202, C: 100, D: 400, E: 400 },
//   C: { A: 259, B: 259, D: 1059, E: 800 },
//   D: { A: 425, B: 118, C: -1059, E: 107 },
//   E: { A: 803, B: 303, C: 200, D: 503 }
// }

```

### Parsing a large amount of data (many files).

&emsp;To parse a large amount of data, especially a large number of json files, you can put all the files in the "json-files" folder and run the program with default settings. The program will sequentially parse the data in each file of the "json-files" folder and merge them, and then give you a result in terminal and create output csv file in "output" folder.

```console
$ npm start
A owes to B 202
A owes to C 337
A owes to D 135
A owes to E 135
B will receive from A 202
B owes to C 100
B owes to D 400
B owes to E 400
C owes to A 259
C owes to B 259
C owes to D 1059
C owes to E 800
D owes to A 425
D owes to B 118
D will receive from C 1059
D owes to E 107
E owes to A 803
E owes to B 303
E owes to C 200
E owes to D 503
```
