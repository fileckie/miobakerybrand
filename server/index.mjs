import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { handleApi } from "./api-handler.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = join(__dirname, "..", "dist");

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    if (req.url?.startsWith("/api/")) {
      return await handleApi(req, res);
    }

    let filePath = join(distDir, req.url === "/" ? "index.html" : req.url);
    if (!existsSync(filePath) || !readFileSync(filePath)) {
      filePath = join(distDir, "index.html");
    }

    const ext = extname(filePath);
    const content = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(content);
  } catch (e) {
    res.writeHead(500);
    res.end("Server error");
  }
});

const PORT = process.env.PORT || 8787;
server.listen(PORT, () => console.log(`🍞 Mio Brand running on port ${PORT}`));
