import fs from "fs";
import path from "path";

export function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to);
  }
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}
