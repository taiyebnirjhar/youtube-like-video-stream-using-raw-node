# YouTube-like Video Streaming App using Raw Node.js

**(Node.js Fundamental: পর্ব ৪.১)**

This project demonstrates how to build a **smooth, efficient, chunked video streaming server** with Raw Node.js — just like YouTube, Netflix, or Vimeo do.

---

## • Goal

Deliver a **Large video ** in chunks so users can **scrub and play instantly** without waiting for the full file to preload.

---

## • Why chunked streaming?

- Loading the entire video upfront causes lag and delay.
- Users want to jump to any part of the video seamlessly.
- To enable **lag-free scrubbing**, the server must send **partial content on demand**.

---

## • How it works (Simplified flow)

1. User’s browser plays `<video>` and requests `/video/stream`.
2. Browser sends an HTTP **Range header**: "Give me bytes X to Y."
3. Server calculates required chunk range.
4. Reads chunk with `fs.createReadStream()` from the video file.
5. Streams chunk with HTTP **206 Partial Content** response.
6. Browser plays received chunk, enabling smooth seeking.

---

## • Project Structure

- **`assets.js`**: Handles user-uploaded video path and file size.
- **`index.js`**:

  - `/` — Home route.
  - `/video` — Video player page.
  - `/video/stream` — Chunked video streaming endpoint.

- **`video.html`**: Simple HTML with `<video>` tag playing from `/video/stream`.

---

## • Core Code Snippet

```js
const range = req.headers.range;
const video = await assets.getUserUploadedVideo();
const CHUNK_SIZE = 1 * 1e6; // 1MB chunk size

const start = Number(range.replace(/\D/g, ""));
const end = Math.min(start + CHUNK_SIZE, video.size - 1);

const stream = fs.createReadStream(video.path, { start, end });

res.writeHead(206, {
  "Content-Range": `bytes ${start}-${end}/${video.size}`,
  "Accept-Ranges": "bytes",
  "Content-Length": end - start + 1,
  "Content-Type": "video/mp4",
});

stream.pipe(res);
```

---

## • Key Concepts

- **Range Request**: Browser requests specific byte ranges.
- **Chunked Streaming**: Video served piece by piece.
- **Performance**: Low RAM usage, low latency, smooth UX.
- **HTTP 206 Partial Content**: Signals partial response enabling seamless seeking.

---

## • Summary

- Big platforms like Netflix, YouTube, and Vimeo rely on chunked streaming.
- Raw Node.js is powerful enough to replicate this exact behavior.
- Understanding and implementing chunked streaming is essential for scalable, modern backend video services.

---

## • Related Posts

Check the detailed post discussion here:
[**YouTube-like Video Streaming App using Raw Node.js**](https://www.linkedin.com/posts/taiyeb-nirjhor_nodejs-fundamental-%E0%A6%AA%E0%A6%B0%E0%A6%AC-%E0%A7%AA-%E0%A6%AA%E0%A6%B0%E0%A6%97%E0%A6%B0%E0%A6%AE-activity-7339347399171022850-FGIg?utm_source=share&utm_medium=member_desktop&rcm=ACoAADNzOjcBH-33z9W1nJBM4h5GWT5TltygxkM)

### More from the Node.js Fundamental Series:

1.  [**Node.js এর উপর আন্ডারস্ট্যান্ডিং**](https://www.linkedin.com/posts/taiyeb-nirjhor_nodejs-fundamental-%E0%A6%AA%E0%A6%B0%E0%A6%AC-%E0%A7%A7-%E0%A6%B6%E0%A6%B0-%E0%A6%95%E0%A6%B0%E0%A6%9B-activity-7338539659855089665-h2Zl/?utm_source=share&utm_medium=member_desktop&rcm=ACoAADNzOjcBH-33z9W1nJBM4h5GWT5TltygxkM)

2.  [**Global Object আর Module System**](https://www.linkedin.com/posts/taiyeb-nirjhor_nodejs-fundamental-%E0%A6%AA%E0%A6%B0%E0%A6%AC-%E0%A7%A8-%E0%A6%86%E0%A6%9C%E0%A6%95-%E0%A6%A8%E0%A6%A1%E0%A6%9C%E0%A6%8F%E0%A6%B8-%E0%A6%8F%E0%A6%B0-activity-7338867411263070210-in2t?utm_source=share&utm_medium=member_desktop&rcm=ACoAADNzOjcBH-33z9W1nJBM4h5GWT5TltygxkM)

3.  [**Core Module এবং ভিতরের Core জিনিস — Event Loop**](https://www.linkedin.com/posts/taiyeb-nirjhor_nodejs-fundamental-%E0%A6%AA%E0%A6%B0%E0%A6%AC-%E0%A7%A9-%E0%A6%AA%E0%A6%B0%E0%A6%A4%E0%A6%AF%E0%A6%95%E0%A6%9F-activity-7339211724358565888-d7G3?utm_source=share&utm_medium=member_desktop&rcm=ACoAADNzOjcBH-33z9W1nJBM4h5GWT5TltygxkM)

4.  [**“stream” আর “buffer” এর ব্যাখ্যা**](https://www.linkedin.com/posts/taiyeb-nirjhor_nodejs-fundamental-%E0%A6%AA%E0%A6%B0%E0%A6%AC-%E0%A7%AA-%E0%A6%AA%E0%A6%B0%E0%A6%97%E0%A6%B0%E0%A6%AE-activity-7339347399171022850-FGIg?utm_source=share&utm_medium=member_desktop&rcm=ACoAADNzOjcBH-33z9W1nJBM4h5GWT5TltygxkM)
