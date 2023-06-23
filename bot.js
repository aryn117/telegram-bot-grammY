const { Bot, Keyboard, webhookCallback } = require("grammy");
const express = require("express");
const data = require("./data.js");
const axios = require("axios");
require("dotenv").config();

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

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

bot.command("start", (ctx) => {
  ctx.reply(
    "Hello Pathuman, \nI am a bot to give you company when bigPathu🍆🍆 is Busy \n I can sing you a song, \n tell you a joke🤣🤣,\n send you something cute🥺😳 and \n even romance you 😍😘",
    {
      reply_markup: keyboard,
    }
  );
});

bot.on("message", async (ctx) => {
  const msg = ctx.message.text.toLowerCase();
  console.log("triggered");

  if (msg == "/start" || msg === undefined || msg === null || msg === "") {
    console.log("🛑🛑msg value is invalid, please check what went wrong");
    return;
  }

  //* send texts ///////////////////////////////////////////////////////////
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

  //* send gifs ///////////////////////////////////////////////////////////
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
  //* sending joke ////////////////////////////////////////////////////
  else if (msg === "tell me a joke" || msg.indexOf("joke") !== -1) {
    try {
      const joke = await getJokeFromAPI();
      console.log("🚀 ~ file: index.js:71 ~ bot.on ~ joke:", joke);
      ctx.reply(joke);
    } catch (error) {
      console.error(error);
    }
  }

  //* send star_plus gifs ////////////////////////////////////////////////////
  else if (msg === "romance me beech" || msg.indexOf("romance") !== -1) {
    const selectedGIF = randomNumberGenerator(0, data.romanceGIFs.length - 1);
    console.log(selectedGIF);

    ctx.replyWithAnimation(data.romanceGIFs[selectedGIF]);
  }

  //* exception catch ////////////////////////////////////////////////////
  else {
    ctx.reply("Hehehe🥰🥰🥰🥰🥰");
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

// rng
function randomNumberGenerator(min = 0, max = 999) {
  return Math.floor(Math.random() * (max - min) + min);
}

// get joke from icanhazdadjoke api and return it in string format

async function getJokeFromAPI() {
  const url = "https://icanhazdadjoke.com/slack";

  const res = await axios(url);

  const { attachments } = res.data;
  return attachments[0].text;
}

//? --------------------------------------------------------------------- //

//Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    console.log(`Bot listening on port ${PORT}`);
    await bot.api.setWebhook("https://gorgeous-teddy-mite.cyclic.app");
  });
} else {
  // Use Long Polling for development
  bot.start();
  bot.catch((err) => console.log("🚀 ~ file: index.js:185 ~ err", err));
}
