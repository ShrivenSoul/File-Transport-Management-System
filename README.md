# File Transport Management System

A web-based file transport management application built with **React.js** and **Node.js**.

---

## Requirements

Before running the project, make sure you have the following installed:

- **React.js**
- **Node.js**
- **ClamAV**
- **pyclamd**

You can verify installation by running:

```bash
node -v
npm -v
```

---

## Installation & Setup

ClamAV installation/setup:

1. To download ClamAV you ened to go to their website and select what OS your PC has and grab the zip folder
2. Extract the folder anywhere and open it
3. In the folder will be another folder named conf_examples
4. There should be 2 files that have the .example tags open both in an editor
5. Scroll down until you see the word "EXAMPLE" with no "#" before it
6. Add the "#" before it on both files
7. Save and close the editor and rename those files without the .example after .conf
8. Drag those files to the main folder and they will sort
9. Next run freshclam this will make the malware database
10. After that is done you can run clamd to start the antivirus for the scanner

Pyclamd installation:

Use pip install in commandline

pip install pyClamd


The reason .env isn't included into the setup is .env's cannot be public 
as they contain access keys to users which would compromise your account.

Setting up .env and AWS:

Creating IAM user:

1. Create an acocunt for AWS
2. Log in
3. Go to IAM user in the search bar
4. Create a user
5. Give user a name and click next
6. Click attatch policies directly
7. Give user AmazonDynamoDBFullAccess and AmazonS3FullAccess
8. Review and create the user
9. Go to the user and in the summary click create access key
10. Click next and then select Application running outside AWS
11. Set the description of the key and make it memorable
12. Take note of both access key and secret access key as they are both needed

Creating S3:

1. Go to S3 form the search bar
2. Click on general purpose buckets on the left-hand side
3. Click create bucket
4. Name the bucket
5. Leave everything default and click create bucket

Creating DynamoDB:

1. Search DynamoDB in the search bar
2. Click Tables on the left-hand side
3. Click create table on the top-right
4. Name the table
5. Make the partition key name "logId" without quotations
6. leave everything default
7. create table

In the backend create a file named .env. 

copy and paste this in the .env:

# AWS Credentials (IAM user)
AWS_REGION=(Your region can be found in the top right)
AWS_ACCESS_KEY=(The access key line you saved earlier)
AWS_SECRET_KEY=(The secret key line you saved earlier)

# S3 Bucket
S3_BUCKET=(Name of your bucket)

# DynamoDB (audit logs)
AUDIT_TABLE=(Name of your DynamoDB table)

.env is finished and AWS is setup for app after these steps.


After downloading/cloning the project files:

0. Open clamd to run ClamAV
1. Open **Command Prompt / Terminal**
2. Navigate to the Backend folder (you should see the `service` folder)

```bash
cd your-project-folder/Backend
```

3. Install dependencies:

```bash
npm install
```

4. Start the application:

```bash
npm start
```
5. Do the same with the frontend (Navigate to the main folder)

   
```bash
cd your-project-folder
```

6. Install dependencies:

```bash
npm install
```

7. Start the application:

```bash
npm start
```

## Running the Application

After starting the project:

- Your browser should automatically open
- The application will run on:

```bash
http://localhost:3000
```

---

## Current Release Notes
Admin account information:
- email - unknownmage97@gmail.com
- password - CD$Capstone1
