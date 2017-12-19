const WebCryptoLocal = require("./");

function PrintUsedModules() {
    let res = [];
    GetModules(module, res);
    let prevItem = null;
    res = res
        .sort()
        .filter((item) => {
            const re = /node_modules[\\\/]([\w\d\-\.\@]+)/;
            const name = re.exec(item);
            if (!name) {
                prevItem = null;
                return true;
            }
            if (name[1] === prevItem) {
                return false;
            } else {
                prevItem = name[1];
                return true;
            }
            
        })
        .map((item) => {
            return item.replace(/(.+node_modules[\\\/][\w\d\-\.\@]+)(.+)/, "$1");
        })
    const json = JSON.stringify(res, null, 4);
    console.log(json);
}

function GetModules(item, res) {
    res.push(item.filename);
    item.children.forEach((child) => {
        GetModules(child, res);
    });
}

PrintUsedModules();