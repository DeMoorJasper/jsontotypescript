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
            console.log(err);
        });
    });
}

let transpileJson = (input, name) => {
    let res = [`export class ${name} {\n`];

    for (var property in input) {
        res[0] += `    ${property}: ${typeof input[property]};\n`;

        if (typeof input[property] == "object") {
            res = Array.prototype.concat(res, transpileJson(input[property], property));
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