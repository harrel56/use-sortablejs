import * as fs from 'fs'

fs.copyFileSync("../README.md", "./build/README.md");
fs.copyFileSync("../LICENSE", "./build/LICENSE");

const packageJson = JSON.parse(fs.readFileSync('./package.json', {encoding: 'utf8'}))
packageJson.main = 'index.js'
packageJson.types = 'index.d.ts'
delete packageJson.source

fs.writeFileSync('./build/package.json', JSON.stringify(packageJson, null, 2))

