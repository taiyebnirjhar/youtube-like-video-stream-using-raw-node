const http = require("http");
const fs = require("fs");
const assets = require("./lib/assets");
const url = require("url");
const path = require("path");

const port = 3000;

const handleHttpRequest = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/") {
    const filePath = path.join(__dirname, "./views/index.html");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Internal Server Error");
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (parsedUrl.pathname === "/video") {
    const filePath = path.join(__dirname, "./views/video.html");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error loading video page");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(data);
    });
  } else if (parsedUrl.pathname === "/video/stream") {
    const range = req.headers.range;

    const video = await assets.getUserUploadedVideo();

    // console.log(video);

    if (!range) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("Range header required");
    }
    try {
      const video = await assets.getUserUploadedVideo();

      // console.log(video);
      const { path, size } = video;

      const CHUNK_SIZE = 1 * 1e6; // 1MB

      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, size - 1);

      const stream = fs.createReadStream(path, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": "video/mp4",
      });

      stream.pipe(res);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end("Server error: " + error.message);
    }
  }
};

const server = http.createServer(handleHttpRequest);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
