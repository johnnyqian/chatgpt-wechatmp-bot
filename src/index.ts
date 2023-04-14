import "dotenv/config";
import { log, Message, WechatyBuilder } from "wechaty";
import { PuppetOA } from "wechaty-puppet-official-account";
import { processMessage } from "./chatgpt-bridge.js";

async function onMessage(msg: Message) {
  log.info("Bot", msg.toString());

  if (msg.self()) {
    return;
  }

  // only process message with Text type
  if (msg.type() === bot.Message.Type.Text) {
    await processMessage(msg);
  }
}

function onError(error: Error) {
  console.error("Bot error:", error);
}

const puppet = new PuppetOA({
  appId: process.env.OA_APP_ID,
  appSecret: process.env.OA_APP_SECRET,
  token: process.env.OA_TOKEN,
  port: parseInt(process.env.PORT ?? "8000"),
});

const bot = WechatyBuilder.build({
  name: "chatgpt-wechatmp-bot",
  puppet: puppet,
});

bot
  .on("message", onMessage)
  .on("error", onError)
  .start()
  .then(() => log.info("Bot", "Bot Started."))
  .catch((e) => log.error("Bot", e));
