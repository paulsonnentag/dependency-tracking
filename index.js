#!/usr/bin/env node
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

// Replace 'your-binary' with the actual binary you want to run

const command = path.join(__dirname, "/bin/loggedfs");

const args = ["-f", "-p", "/Users/paul/mount/project6"];

const child = spawn(command, args);

const activeScriptsByPid = {};

const logFilePath = path.join(__dirname, "log.txt");

if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "", { flag: "wx" });
}

child.stdout.on("data", (data) => {
  try {
    fs.appendFileSync(logFilePath, data);
  } catch (err) {
    console.error(`Error appending to file: ${err.message}`);
  }
});

child.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

child.on("close", () => {
  process.exit();
});
