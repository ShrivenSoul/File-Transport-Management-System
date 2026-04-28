import express from "express";
import multer from "multer";
import fs from "fs";

import { writeAuditLog, getAuditLogs } from "./services/audit.js";
import { uploadToS3, getDownloadUrl  } from "./services/s3.js";
import { scanFile } from "./scanner/scan.js";

const app = express();
const FILE_MAX = 5 * 1024 * 1024 * 1024; 

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: FILE_MAX,
  },
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  //Test User
  const currentUser = {
    userId: "123",
    username: "bob",
    userGroups: ["Level1"],
  };


  try {
    const scanResult = await scanFile(filePath);

    if (scanResult.status !== "clean") {
      await writeAuditLog({
        userId: currentUser.userId,
        username: currentUser.username,
        userGroups: currentUser.userGroups,
        action: "UPLOAD_FILE",
        target: fileName,
        result: "failed",
        details: "Malware detected during scan",
        ipAddress: req.ip,
      });
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "File rejected: Malware detected!" });
    }

    const url = await uploadToS3(filePath, fileName);
    await writeAuditLog({
      userId: currentUser.userId,
      username: currentUser.username,
      userGroups: currentUser.userGroups,
      action: "UPLOAD_FILE",
      target: fileName,
      result: "success",
      details: "Uploaded to S3 successfully",
      ipAddress: req.ip,
    });
   

    fs.unlinkSync(filePath);

    return res.json({
      message: "Upload successful",
      fileUrl: url,
    });

     

  } catch (err) {
    console.error(err);

    await writeAuditLog({
      userId: currentUser.userId,
      username: currentUser.username,
      userGroups: currentUser.userGroups,
      action: "UPLOAD_FILE",
      target: fileName || "",
      result: "error",
      details: error.message,
      ipAddress: req.ip,
    });
    
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/admin/audit-logs", async (req, res) => {
  try {
    const logs = await getAuditLogs(100);
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

app.get("/download/:filename", async (req, res) => {
  const fileName = req.params.filename;

  const currentUser = {
    userId: "123",
    username: "bob",
    userGroups: ["Level1"],
  };

  try {
    const url = await getDownloadUrl(fileName);

    res.json({
      downloadUrl: url
    });
    await writeAuditLog({
      userId: currentUser.userId,
      username: currentUser.username,
      userGroups: currentUser.userGroups,
      action: "DOWNLOAD_FILE",
      target: fileName,
      result: "success",
      details: "Downloaded from S3 Bucket!",
      ipAddress: req.ip,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate download link" });
    await writeAuditLog({
      userId: currentUser.userId,
      username: currentUser.username,
      userGroups: currentUser.userGroups,
      action: "DOWNLOAD_FILE",
      target: fileName,
      result: "failure",
      details: "Failed download from S3 Bucket!",
      ipAddress: req.ip,
    });
  }
});

app.use(async (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {

     const currentUser = {
    userId: "123",
    username: "bob",
    userGroups: ["Level1"],
    };

    try {
      await writeAuditLog({
        userId: currentUser.userId,
        username: currentUser.username,
        userGroups: currentUser.userGroups,
        action: "UPLOAD_FILE",
        target: "unknown", //File may not exist at this level since upload would be blocked
        result: "failed",
        details: "File exceeded maximum upload size of 5GB",
        ipAddress: req.ip,
      });
    } catch (logError) {
      console.error("Audit log failed:", logError);
    }

    return res.status(413).json({
      error: "File too large",
      message: "Maximum upload size is 5GB.",
    });
  }

  next(err);
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});