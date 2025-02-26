import express from "express";

const app = express();
app.use(express.static("sandbox/web"));

const SERVER_DELAY = 1500;

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

app.get("/check-email", async (req, res) => {
  await sleep(SERVER_DELAY);
  const regexp = /@example.com$/u;
  const isValid = regexp.test(req.query.email);
  res.json({ isValid });
});

app.get("/check-domain", async (req, res) => {
  await sleep(SERVER_DELAY);
  res.json({ isValid: req.query.domain.endsWith(".com") });
});

app.post("/positive-response", async (req, res) => {
  await sleep(SERVER_DELAY);
  res.json({ isSuccess: true });
});

app.post("/invalid-response", async (req, res) => {
  await sleep(SERVER_DELAY);
  res.json({ isSuccess: false, invalid: { email: "Email is already in use" } });
});

app.post("/negative-response", async (req, res) => {
  await sleep(SERVER_DELAY);
  res.json({ isSuccess: false });
});

app.post("/response-with-http-error", async (req, res) => {
  await sleep(SERVER_DELAY);
  res.status(400).end();
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log("Sandbox listening on port 3000");
});
