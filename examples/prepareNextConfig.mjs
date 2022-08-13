import * as fs from 'fs'
import * as path from 'path'

const packageJson = JSON.parse(fs.readFileSync('./package.json', {encoding: 'utf8'}))
delete packageJson.dependencies['use-sortablejs']
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

const tsConfigJson = JSON.parse(fs.readFileSync('./tsconfig.json', {encoding: 'utf8'}))
tsConfigJson.compilerOptions.paths['use-sortablejs'] = ['lib/index.ts']
fs.writeFileSync('./tsconfig.json', JSON.stringify(tsConfigJson, null, 2))

copyFolderSync('../main/src', './lib')

function copyFolderSync(from, to) {
  fs.mkdirSync(to);
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}
