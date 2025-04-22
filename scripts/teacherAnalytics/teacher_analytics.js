const fs = require("fs");
const path = require("path");
const os = require("os");
const mm = require("music-metadata");

const baseDir = path.join(os.homedir(), "tabsera/backend/photos");
const pathsFile = path.join(__dirname, "paths.txt");

async function getTotalDurationFromFile(filePath) {
  let totalSeconds = 0;
  let fileCount = 0;

  const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);

  for (const originalPath of lines) {
    const relativePath = originalPath.trim().replace(/^\/etc\/tabsera\//, "");

    const fullPath = path.join(baseDir, relativePath);

    try {
      const metadata = await mm.parseFile(fullPath);
      const duration = metadata.format.duration;
      if (duration) {
        totalSeconds += duration;
        fileCount++;
      }
    } catch (err) {
      console.error(`Error reading ${relativePath}:`, err.message);
    }
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  console.log("Teacher: Ahmed Abdulkarim Almasry");
  console.log("Filter Date: 1/4/2025 - 22/4/2025");
  console.log(`Total Student Recordings: ${fileCount}`);
  console.log(
    `Total duration of the ${fileCount} recordings: ${hours}h ${minutes}m ${seconds}s`
  );
}

getTotalDurationFromFile(pathsFile);
