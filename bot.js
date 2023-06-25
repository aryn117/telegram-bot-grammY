require("dotenv").config();

const { Bot, Keyboard, webhookCallback } = require("grammy");
const express = require("express");
const data = require("./data.js");
const axios = require("axios");

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

//* Keyboard Layout --------------------------------------- //
const keyboard = new Keyboard()
  .text("do you nob me?❤️🥰")
  .row()
  .text("joke😂🤣")
  .row()
  .text("romance be beeech🥰💝💖")
  .row()
  .text("send something cute💖")
  .row()
  .persistent();

//* Initial Message --------------------------------------- //
bot.command("start", (ctx) => {
  ctx.reply(
    "Hello Pathuman, \nI am a bot to give you company when bigPathu🍆🍆 is Busy \n I can sing you a song, \n tell you a joke🤣🤣,\n send you something cute🥺😳 and \n even romance you 😍😘",
    {
      reply_markup: keyboard,
    }
  );
});

//* Chat Logic -------------------------------------------- //
bot.on("message", async (ctx) => {
  let msg = ctx.message;

  //* EXCEPTION: if the message is a sticker ------------------------------- //
  if (msg.sticker !== undefined) {
    msg = "Hello";
  } else {

    msg = msg.text.toLowerCase();

  }
  
  console.log("🚀 ~ file: bot.js:42 ~ bot.on ~ msg:", msg)
 
  if (msg == "/start" || msg === undefined || msg === null || msg === "") {
    console.log("🛑🛑msg value is invalid, please check what went wrong");
    return;
  }

  //* send a quote ----------------------------------------- //
  else if (
    msg === "do u nob me?" ||
    msg === "do you nob me?" ||
    msg.indexOf("nob") !== -1
  ) {
    ctx.reply(
      data.quotesReplyList[
        randomNumberGenerator(0, data.quotesReplyList.length - 1)
      ].toString()
    );
  }

  //* replying to love u ----------------------------------------- //
  else if (
    msg === "i love u" ||
    msg === "i luv u" ||
    msg === "i luv you" ||
    msg === "i love you" ||
    msg.indexOf("love") !== -1 ||
    msg.indexOf("luv") !== -1
  ) {
    ctx.reply("I love u too beeeech💖💖💖💖💖💖💖");
  }

  /*
  //* send a song ///////////////////////////////////////////////////////////
  else if (msg === "sing me a song" || msg.indexOf("sing") !== -1) {
    try {
      bot.sendMessage(chatId, "😳😳 Okay, i'll try");
      const stream = fs.createReadStream(
        `./assets/track_${randomNumberGenerator(1, TRACKS_UPPER_LIMIT)}.mp3`
      );

      ctx.replyWithAudio(stream);
    } catch (error) {
      console.error(error);
    }
  }

  */

  //* send cute gifs ----------------------------------------------------- //
  else if (msg === "send me something cute" || msg.indexOf("cute") !== -1) {
    try {
      const selectedGIF =
        data.GIFLinksList[
          randomNumberGenerator(0, data.GIFLinksList.length - 1)
        ];
      ctx.replyWithAnimation(`${selectedGIF}.gif`);
    } catch (error) {
      console.error(error);
    }
  }

  //* send joke --------------------------------------------------------- //
  else if (msg === "tell me a joke" || msg.indexOf("joke") !== -1) {
    try {
      const joke = await getJokeFromAPI();
      console.log("🚀 ~ file: index.js:71 ~ bot.on ~ joke:", joke);
      ctx.reply(joke);
    } catch (error) {
      console.error(error);
    }
  }

  //* send star_plus romantic gif ------------------------------------------ //
  else if (msg === "romance me beech" || msg.indexOf("romance") !== -1) {
    const selectedGIF = randomNumberGenerator(0, data.romanceGIFs.length - 1);
    console.log(selectedGIF);

    ctx.replyWithAnimation(data.romanceGIFs[selectedGIF]);
  }

  //* exception catch ------------------------------------------------------ //
  else {
    ctx.reply("Hehehe🥰🥰🥰🥰🥰 lob u");
  }
});

// bot.api.setMyCommands([
//   { command: "do you nob me?❤️🥰", description: "Be greeted by the bot" },
//   {
//     command: "song 🎤🎶",
//     description: "I sing you a song",
//   },
//   {
//     command: "joke😂🤣",
//     description: "I tell you a joke",
//   },
//   {
//     command: "romance be beeech🥰💝💖",
//     description: "surprise",
//   },
//   {
//     command: "send something cute💖",
//     description: "I send you something cute",
//   },
// ]);

//* -------------------------------------------------------------------- //
//* Helper Functions --------------------------------------------------- //

//* rng
function randomNumberGenerator(min = 0, max = 999) {
  return Math.floor(Math.random() * (max - min) + min);
}

//* get joke from icanhazdadjoke api and return it in string format

async function getJokeFromAPI() {
  const url = "https://icanhazdadjoke.com/slack";

  const res = await axios(url);

  const { attachments } = res.data;
  return attachments[0].text;
}

//* Start the server ------------------------------------------------------ //
if (process.env.NODE_ENV === "production") {
  //? Use Webhooks for the production server (only runs on trigger) -------------------------------- //
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    console.log(`Bot listening on port ${PORT}`);
    await bot.api.setWebhook("https://gorgeous-teddy-mite.cyclic.app");
  });
} else {
  //? Use Long Polling for Development Environment (Continuously Running) ----------------------------- //
  bot.start();
  bot.catch((err) => console.log("🚀 ~ file: index.js:185 ~ err", err));
}

//* -------------------------------------------------------------------- //
