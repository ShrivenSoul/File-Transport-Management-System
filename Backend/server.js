import express from "express";
import multer from "multer";
import fs from "fs";

import { uploadToS3, getDownloadUrl, getFileList } from "./services/s3.js";
import { scanFile } from "./scanner/scan.js";

const app = express();
const upload = multer({ dest: "uploads/" });


app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    const scanResult = await scanFile(filePath);

    if (scanResult.status !== "clean") {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Malware detected" });
    }

    const url = await uploadToS3(filePath, fileName);

    fs.unlinkSync(filePath);

    res.json({
      message: "Upload successful",
      fileUrl: url,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/download/:filename", async (req, res) => {
  const fileName = req.params.filename;

  try {
    const url = await getDownloadUrl(fileName);

    res.json({
      downloadUrl: url
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate download link" });
  }
});
app.get("/fileList", async (req, res) => {

  try {
    const resp = await getFileList();

    res.json({
      fileList: resp
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate list of files" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});