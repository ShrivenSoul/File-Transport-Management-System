# File Transport Management System

A web-based file transport management application built with **React.js** and **Node.js**.

---

## Requirements

Before running the project, make sure you have the following installed:

- **React.js**
- **Node.js**
- **ClamAV**

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
To be added
