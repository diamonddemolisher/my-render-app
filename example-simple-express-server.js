import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("static"));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
    });
app.get("/", (req, res) => {
res.type("text/html").send("<html><body>Hello!</body></html>");
});
app.get("/hello", (req, res) => {
    res.type("text/plain").send("Hello!");
});
app.get("/goodbye", (req, res) => {
    res.type("text/plain").send("Goodbye!");
});
app.get("/hello/:name", (req, res) => {
    const name = req.params.name;
    res.type("text/plain").send(`Hello, ${name}!`);
});
app.get("/birthday", (req, res) => {
    res.type("text/plain").send("Happy Birthday!");
});
app.get("/birthday/:name", (req, res) => {
    const name = req.params.name;
    res.type("text/plain").send(`Happy Birthday, ${name}!`);
});
app.listen(PORT, () => {
console.log(`Simple Express server listening on
http://localhost:${PORT}`);
});