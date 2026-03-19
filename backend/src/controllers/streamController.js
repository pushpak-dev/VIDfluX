import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ytDlpPath = path.join(__dirname, "../../yt-dlp");

export async function streamController(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      message: "Invalid URL",
    });
  }

  res.header("Content-Type", "video/mp4");

  const process = spawn(ytDlpPath, [
    "-f", "best",
    "-o", "-",
    url,
  ]);

  process.stdout.pipe(res);

  process.stderr.on("data", (data) => {
    console.log("yt-dlp error:", data.toString());
  });

  process.on("close", (code) => {
    console.log("Process exited with code", code);
  });
}

export async function infoController(req, res) {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      message: "Invalid URL",
    });
  }

  const process = spawn(ytDlpPath, ["--dump-json", url]);

  let data = "";

  process.stdout.on("data", (chunk) => {
    data += chunk.toString();
  });

  process.on("close", () => {
    try {
      const json = JSON.parse(data);

      res.status(200).json({
        title: json.title,
        thumbnail: json.thumbnail,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to parse data",
        error: error.message,
      });
    }
  });
}