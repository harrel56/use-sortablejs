import * as fs from 'fs'
import {copyFolderSync} from "./copyFolder.mjs";

const packageJson = JSON.parse(fs.readFileSync('./package.json', {encoding: 'utf8'}))
delete packageJson.dependencies['use-sortablejs']
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))

const tsConfigJson = JSON.parse(fs.readFileSync('./tsconfig.json', {encoding: 'utf8'}))
tsConfigJson.compilerOptions.paths['use-sortablejs'] = ['lib/index.ts']
fs.writeFileSync('./tsconfig.json', JSON.stringify(tsConfigJson, null, 2))

copyFolderSync('../main/src', './lib')
