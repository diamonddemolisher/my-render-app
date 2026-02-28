import http from "http";
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  if (req.url === "/time") {
    const now = new Date().toString();
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<html><body>Current time: ${now}</body></html>`);
  }
  // If user goes to http://localhost:3000/
  else {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<html><body>Hello!</body></html>");
  }
});
server.listen(PORT, () => {
console.log(`Simple server listening on http://localhost:${PORT}`);
});