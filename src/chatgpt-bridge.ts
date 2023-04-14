import { log, Message } from "wechaty";
import { ChatGPTAPI } from "chatgpt";

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY!,
  maxModelTokens: 4000,
  maxResponseTokens: 1000,
});

let parentMessageId: string = "";

export async function processMessage(msg: Message) {
  let text = msg.text();
  if (text.length > 200) {
    return;
  }

  const reply = await chatGPTReply(text);
  await msg.say(reply);
}

async function chatGPTReply(prompt: string) {
  try {
    log.info("prompt: ", prompt);
    // If you want your response to have historical context, you must provide a valid `parentMessageId`.
    const response = await api.sendMessage(prompt, {
      parentMessageId,
    });

    const reply = response.text;
    parentMessageId = response.id;
    log.info("reply: ", reply);
    return reply;
  } catch (error: any) {
    log.error(error.toString());
    return "发生了一些错误，请稍后再试。";
  }
}
