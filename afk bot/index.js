const express = require("express");
const mineflayer = require("mineflayer");
const bodyParser = require("body-parser");

const app = express();
const bots = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.send(`
    <html>
    <head><title>AFK Bot Launcher</title></head>
    <body style="font-family:sans-serif;text-align:center;margin-top:50px;">
      <h1>🟢 Minecraft AFK Bot Panel</h1>
      <form method="POST" action="/start-bot">
        <input name="ip" placeholder="Aternos IP (e.g., abc.aternos.me)" required/><br><br>
        <input name="port" placeholder="Port (e.g., 12345)" required/><br><br>
        <input name="username" placeholder="Bot Username" required/><br><br>
        <button type="submit">Launch Bot</button>
      </form>
    </body>
    </html>
  `);
});

app.post("/start-bot", (req, res) => {
  const { ip, port, username } = req.body;

  const bot = mineflayer.createBot({
    host: ip,
    port: parseInt(port),
    username: username
  });

  bot.once("spawn", () => {
    console.log(`✅ Bot ${username} joined ${ip}:${port}`);
    setInterval(() => {
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 300);
    }, 30000);
  });

  bot.on("end", () => console.log(`❌ Bot ${username} disconnected`));
  bot.on("error", err => console.log(`⚠️ Error: ${err}`));

  bots.push(bot);
  res.send(`<h3>✅ Bot ${username} launched and AFKing!</h3><a href="/">Back</a>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌍 Website live on port ${PORT}`));
