/* Functions */
let writeData = (data) => {
    let fs = require('fs');
    let path = require('path');
    let filePath = "./data/result.ts";

    /* Check if exists */
    fs.stat(filePath, function(err, stat) {
        if(err == null) {
            /* Remove if exists */
            fs.unlinkSync(filePath);
        } else if (err.code != 'ENOENT') {
            return console.log(err);
        }

        fs.writeFile(filePath, data.join("\n\n"), { flag: 'wx' }, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log('Saved exported data succesfully.');
        });
    });
}

/* Class names should be capitalised by convention */
let capitalize = (text) => {
    if (typeof text != "string") {
        return;
    }
    return text.length > 0 ? text[0].toUpperCase() + text.substring(1) : "";
}

let addItem = (name, dataType) => {
    return `    ${name}: ${dataType};\n`;
}

let transpileJson = (input, name) => {
    name = capitalize(name);
    let res = [`export class ${name} {\n`];

    let constructor = `     constructor(${name}Json:any) {`;

    for (var property in input) {
        if (typeof input[property] == "object" && Object.prototype.toString.call(input[property]) !== '[object Array]') {
            res = Array.prototype.concat(res, transpileJson(input[property], property));
            res[0] += addItem(property, capitalize(property));
        } else if (Object.prototype.toString.call(input[property]) === '[object Array]') {
            let dataType = capitalize(`${property}Item`);
            res = Array.prototype.concat(res, transpileJson(input[property][0], dataType));
            res[0] += addItem(property, `Array<${dataType}>`);
        } else {
            res[0] += addItem(property, typeof input[property]);
        }
    }

    res[0] += "}";

    return res;
}

/* main run script */
(() => {
    try {
        let input = require("../data/input.json");

        writeData(transpileJson(input, "input"));
    } catch(e) {
        console.log(e);
    }
})()