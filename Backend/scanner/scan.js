import { exec } from "child_process";
/**
 * 
 * @param {*} filePath 
 * @returns promise of executing the scanner for files
 * 
 * This uses the execution of the FileScanner as a child process to function with the rest of the code
 */
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