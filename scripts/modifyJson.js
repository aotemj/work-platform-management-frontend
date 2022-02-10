const fs = require("fs");

fs.readFile("./dist/assets/static/stats-manifest.json", function(err, data) {
    if (err) {
        return console.error('\x1B[31m',"❌❌❌❌❌❌❌❌   stats-manifest.json文件读取异常");
    }
    const person = JSON.parse(data.toString());
    let assetsData = [];
    person.entrypoints.main.assets.forEach((v, index) => {
        if (v.name) {
            assetsData.push(v.name);
        } else {
            console.warn('\x1B[33m',`❌❌❌❌❌❌❌❌   stats-manifest.json文件中第${index+1}条数据异常`);
            return
        }
    });
    person.entrypoints.main.assets = assetsData;
    fs.writeFile("./dist/assets/static/stats-manifest.json", JSON.stringify(person), function(err) {
        if (err) {
            console.error('\x1B[31m', "❌❌❌❌❌❌❌❌  stats-manifest.json文件修改成功");
            return
        }
        console.warn('\x1B[32m', "😀😀😀😀😀😀  stats-manifest.json文件修改成功");
    });
});
