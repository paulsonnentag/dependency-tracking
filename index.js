#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

// Replace 'your-binary' with the actual binary you want to run

const command = path.join(__dirname, "/bin/loggedfs");

const args = ["-f", "-p", "/Users/paul/mount/project5"];

const child = spawn(command, args);

const activeScriptsByPid = {};

const LOG_REGEX =
  /\w+ \[default\] (?<accessType>\w+) (?<filePath>\/[^\s]+) \{[A-Z]+\} \[ pid = (?<pid>\d+)/;

console.log("watching scripts");

child.stdout.on("data", (data) => {
  const match = data.toString().match(LOG_REGEX);

  if (match) {
    const { pid, accessType, filePath } = match.groups;

    const fileName = filePath.split("/").slice(-1)[0];

    if (fileName.startsWith(".")) {
      return;
    }

    if (accessType === "getattr" || filePath.includes(".git")) {
      return;
    }

    if (!activeScriptsByPid[pid] && filePath.endsWith(".py")) {
      activeScriptsByPid[pid] = filePath;
    }

    if (
      activeScriptsByPid[pid] &&
      (accessType === "open" || accessType === "release") &&
      activeScriptsByPid[pid] !== filePath
    ) {
      console.log(activeScriptsByPid[pid], accessType, filePath);
    }
  }
});

child.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

child.on("close", () => {
  process.exit();
});
