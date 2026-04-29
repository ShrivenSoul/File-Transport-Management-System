import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import crypto from "crypto";
import "dotenv/config";

const dynamo = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const TABLE_NAME = process.env.AUDIT_TABLE || "AuditLogs";
/**
 * 
 * @param {*} param0 
 * This gives the program permissions to write audit logs and how the audit log is formatted
 */
export async function writeAuditLog({
  userId = "unknown",
  username = "unknown",
  userGroups = [],
  action,
  target = "",
  result,
  details = "",
  ipAddress = "",
}) {
  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      logId: { S: crypto.randomUUID() },
      timestamp: { S: new Date().toISOString() },
      userId: { S: userId },
      username: { S: username },
      userGroups: { S: JSON.stringify(userGroups) },
      action: { S: action },
      target: { S: target },
      result: { S: result },
      details: { S: details },
      ipAddress: { S: ipAddress },
    },
  });

  await dynamo.send(command);
}
/**
 * 
 * @param {*} limit of how many logs are shown
 * @returns all logs from up to 50 of the recent logs
 */
export async function getAuditLogs(limit = 50) {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    Limit: limit,
  });

  const response = await dynamo.send(command);

  const logs = (response.Items || []).map((item) => ({
    logId: item.logId?.S || "",
    timestamp: item.timestamp?.S || "",
    userId: item.userId?.S || "",
    username: item.username?.S || "",
    userGroups: item.userGroups?.S ? JSON.parse(item.userGroups.S) : [],
    action: item.action?.S || "",
    target: item.target?.S || "",
    result: item.result?.S || "",
    details: item.details?.S || "",
    ipAddress: item.ipAddress?.S || "",
  }));

  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return logs;
}