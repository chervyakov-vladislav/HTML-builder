const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');
const { stdout } = process;
let srcStyle = path.join(__dirname, 'styles');
let distStyle = path.join(__dirname, 'project-dist');

createBundle();

async function createBundle() {
  try {
    let files = await fsPromise.readdir(srcStyle, {withFileTypes: true});
    let writeStream = fs.createWriteStream(path.join(distStyle, 'bundle.css'))
    files.forEach(file => {
      let fileData = path.parse(path.join(srcStyle, file.name));
      if (fileData.ext == '.css') {
        fs.readFile(path.join(srcStyle , file.name), {encoding: 'utf-8'}, (err, data) => {
          writeStream.write(data);
        }) 
      }
    })
  } catch (e) {stdout.write(e)}
}

