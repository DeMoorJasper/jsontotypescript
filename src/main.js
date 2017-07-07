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
    name = clearDecorators(name);
    return `\t${name}: ${dataType};\n`;
}

let clearDecorators = (input) => {
    return input.replace(/[^a-zA-Z ]/g, "");
}

let transpileJson = (input, name) => {
    name = capitalize(name);
    let res = [`export class ${name} {\n`];

    let constructor = `\tconstructor(${name}Json:any) {\n`;

    for (var property in input) {
        constructor += "\t\t";
        if (typeof input[property] == "object" && Object.prototype.toString.call(input[property]) !== '[object Array]') {
            let dataType = clearDecorators(capitalize(property));
            res = Array.prototype.concat(res, transpileJson(input[property], dataType));
            let filteredProperty = clearDecorators(property);
            constructor += `this.${filteredProperty} = new ${dataType}(${name}Json["${property}"]);`;
            res[0] += addItem(filteredProperty, dataType);
        } else if (Object.prototype.toString.call(input[property]) === '[object Array]') {
            let dataType;
            let filteredProperty = clearDecorators(property);
            if (typeof input[property][0] == "object") {
                dataType = clearDecorators(capitalize(`${property}Item`));
                res = Array.prototype.concat(res, transpileJson(input[property][0], dataType));
                constructor += `let ${filteredProperty}res = []\n`;
                constructor += `\t\tfor (let i=0; i < ${name}Json["${property}"].length; i++) {\n`;
                constructor += `\t\t\t${filteredProperty}res.push(new ${dataType}(${name}Json["${property}"][i]));\n`;
                constructor += `\t\t}\n`;
                constructor += `\t\tthis.${filteredProperty} = ${filteredProperty}res;`;
            } else {
                dataType = typeof input[property][0];
                constructor += `this.${filteredProperty} = ${name}Json["${property}"];`;
            }
            res[0] += addItem(filteredProperty, `Array<${dataType}>`);
        } else {
            let dataType = typeof input[property];
            constructor += `this.${clearDecorators(property)} = ${name}Json["${property}"];`;
            res[0] += addItem(property, dataType);
        }
        constructor += "\n";
    }
    constructor += "\t}\n"

    res[0] += `\n${constructor}}`;

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