import { Tail } from "tail";

const filePath = new URL("log.txt", import.meta.url).pathname; // Replace with the actual file path

const tail = new Tail(filePath);

const LOG_REGEX =
  /\w+ \[default\] (?<accessType>\w+) (?<filePath>\/[^\s]+) \{[A-Z]+\} \[ pid = (?<pid>\d+)/;

tail.on("line", (data) => {
  const match = data.match(LOG_REGEX);
  if (match) {
    const { accessType, filePath, pid } = match.groups;

    console.log(`${pid} [${accessType}]: ${filePath}}`);
  }
});
