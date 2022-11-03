const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');
const { stdout } = process;

let filesPromise = fsPromise.readdir(folderPath, {withFileTypes: true});

filesPromise.then((file) => {
  file.forEach(item => {
    if (item.isFile()) showInfo(item);
  })
}).catch((err) => {if (err) throw err})

function showInfo(item) {
  let filePath = path.join(folderPath, item.name);
  let fileData = path.parse(filePath);
  let size;
  let name = fileData.name;
  let ext = fileData.ext.slice(1);
  fs.stat(filePath, function(err, stats) {
    size = stats.size/1000;
    stdout.write(`${name} - ${ext} - ${size}kb\n`);
  });
}