const fsPromise = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const resultPath = path.join(__dirname, 'files-copy');
const { stdout } = process;

copyDir(folderPath, resultPath);

async function copyDir(pathFrom, resultPath)  {
  try {
    await fsPromise.rm(resultPath, {force: true, recursive: true})
    await fsPromise.mkdir(resultPath, {recursive: true})
    let files = await fsPromise.readdir(pathFrom);
    files.forEach(fileName => fsPromise.copyFile(path.join(pathFrom, fileName), path.join(resultPath, fileName)))
  } catch (e) { stdout.write(e) }
}