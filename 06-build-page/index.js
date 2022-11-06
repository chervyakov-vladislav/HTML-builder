const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');
const DIST = path.join(__dirname, 'project-dist');
const SRC = __dirname;
const { stdout } = process;

build(DIST);

async function build(distPath) {
  try {
    await createDistFolder(distPath);
    let components = await pickComponents();
    for (key in components) { components[key] = await components[key]; }
    createHtml(components);
    createStyles();
    copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'))
  } catch (e) { stdout.write(e) }
}

async function createDistFolder(path) {
  await fsPromise.rm(path, {force: true, recursive: true})
  await fsPromise.mkdir(path, {recursive: true})
}

async function pickComponents() {
  let components = await fsPromise.readdir(path.join(SRC, 'components'), {withFileTypes: true});
  let result = components.reduce( (value, item) => {
    if (item.isFile() && path.extname(path.join(SRC, 'components', item.name)) == '.html') {
      let key = path.parse(path.join(SRC, 'components', item.name)).name;
      value[key] = pickLayout(item.name);
      return value;
    }
  }, {})
  return result;
}

async function pickLayout(item) {
  return await fsPromise.readFile(path.join(SRC, 'components', item), {encoding: 'utf-8'})
}


async function createHtml(components) {
  let data;
  let stream = fs.createReadStream(path.join(__dirname, 'template.html'), {encoding: 'utf-8'});

  stream.on('data', chunk => {
    data += chunk;
    let names = Object.keys(components);
    names.forEach( name => {
      data = data.replace(`{{${name}}}`, components[`${name}`])
    })
    let index = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'))
    index.write(data);
  })
}

async function createStyles() {
  try {
    let srcStyle = path.join(__dirname, 'styles');
    let distStyle = path.join(__dirname, 'project-dist');
    let files = await fsPromise.readdir(srcStyle, {withFileTypes: true});
    let writeStream = fs.createWriteStream(path.join(distStyle, 'style.css'))
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

async function copyDir(pathFrom, resultPath)  {
  try {
    await fsPromise.rm(resultPath, {force: true, recursive: true})
    let newDir = await fsPromise.mkdir(resultPath, {recursive: true})
    let files = await fsPromise.readdir(pathFrom, {withFileTypes: true});
    files.forEach(file => {
      if (file.isFile()) {
        fsPromise.copyFile(path.join(pathFrom, file.name), path.join(resultPath, file.name))
      } else {
        let newSrcPath = path.join(pathFrom, file.name);
        let newDistPath = path.join(newDir, file.name);
        copyDir(newSrcPath, newDistPath);
      }
    } )
  } catch (e) { stdout.write(e) }
}