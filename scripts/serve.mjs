import { spawnSync } from "node:child_process";
import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist");
if (!existsSync(path.join(outputRoot, "index.html"))) {
  const build = spawnSync(process.execPath, [path.join(projectRoot, "scripts", "build.mjs")], { stdio: "inherit" });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon"
};

createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  const requestedPath = path.resolve(outputRoot, `.${pathname}`);
  if (requestedPath !== outputRoot && !requestedPath.startsWith(`${outputRoot}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  let filePath = requestedPath;
  if (pathname.endsWith("/")) filePath = path.join(requestedPath, "index.html");
  if (!path.extname(filePath)) filePath = path.join(filePath, "index.html");
  if (!existsSync(filePath)) filePath = path.join(outputRoot, "404.html");

  response.writeHead(filePath.endsWith("404.html") ? 404 : 200, {
    "Content-Type": mimeTypes[path.extname(filePath)] ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY"
  });
  createReadStream(filePath).pipe(response);
}).listen(4173, "127.0.0.1", () => {
  console.log("Raqmio is available at http://localhost:4173/");
});
