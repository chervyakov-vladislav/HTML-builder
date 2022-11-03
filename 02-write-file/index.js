const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = process;
const readline = require('readline');

const rl = readline.createInterface({ input, output });

console.log('Вывод в консоль приветственного сообщения');
rl.on('line', (answer) => {
  if (answer == '.exit' || answer == 'exit') {
    console.log('Реализация прощального сообщения при остановке процесса');
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), `${answer}\n`, (err) => {
      if (err) throw err;
    })
  }
});

rl.on('SIGINT', () => {
  console.log('Реализация прощального сообщения при остановке процесса');
  rl.close()
});
