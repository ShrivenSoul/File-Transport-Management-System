import { exec } from "child_process";

export function scanFile(filePath) {
  return new Promise((resolve, reject) => {
    exec(`python ./scanner/FileScanner.py "${filePath}"`, (err, stdout) => {
      if (err) return reject(err);

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch {
        reject("Invalid scanner response");
      }
    });
  });
}