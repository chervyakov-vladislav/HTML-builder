const fs = require('fs');
const path = require('path');
const { stdout } = process;

let fileName = 'text.txt';
read(fileName);

function read(file) {
  if (!file) return
  let filePath = path.join(__dirname, `${file}`);
  let stream = fs.createReadStream(filePath, 'utf-8');
  stream.on('data', (chunk) => stdout.write(chunk));
}