require("dotenv").config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "menu",
    description: "Получить меню",
  },
  //   {
  //     command: "share",
  //     description: "Поделиться данными",
  //   },
  //   {
  //     command: "inline_keyboard",
  //     description: "Инлайн клавиатура",
  //   },
]);

bot.command("start", async (ctx) => {
  await ctx.react("🤡");
  await ctx.reply("Привет, ты лох!", //{
    // reply_parameters: { message_id: ctx.msg.message_id },
  //}
  );
});

const menuKeyboard = new InlineKeyboard()
  .text("Узнать статутс заказа", "order-status")
  .text("Обратиться в поддержку", "support");
const backKeyboard = new InlineKeyboard().text("< Назад в меню", "back");

bot.command("menu", async (ctx) => {
  await ctx.reply("Выберите пункт меню", {
    reply_markup: menuKeyboard,
  });
});

bot.callbackQuery("order-status", async (ctx) => {
  await ctx.callbackQuery.message.editText("Статус заказа: в пути", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("support", async (ctx) => {
  await ctx.callbackQuery.message.editText("Напишите Ваш запрос", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("back", async (ctx) => {
    await ctx.callbackQuery.message.editText("Выберите пункт меню", {
      reply_markup: menuKeyboard,
    });
    await ctx.answerCallbackQuery();
  });

// bot.command("mood", async (ctx) => {
//   // const moodKeyboard = new Keyboard().text('Хорошо').row().text('Под пивко потянет').row().text('Отстой').resized().oneTime()

//   const moodLabels = ["Хорошо", "Нормально", "Плохо"];
//   const rows = moodLabels.map((label) => {
//     return [Keyboard.text(label)];
//   });
//   const moodKeyboard2 = Keyboard.from(rows).resized().oneTime();

//   await ctx.reply("Как настроение?", {
//     reply_markup: moodKeyboard2,
//   });
// });

// bot.command("share", async (ctx) => {
//   const shareKeyboard = new Keyboard()
//     .requestLocation("Геолокация")
//     .requestContact("Контакт")
//     .requestPoll("Опрос")
//     .placeholder("Укажи данные...")
//     .resized();

//   await ctx.reply("Чем хочешь поделиться ?", {
//     reply_markup: shareKeyboard,
//   });
// });

// bot.command("inline_keyboard", async (ctx) => {
//   const inlineKeyboard = new InlineKeyboard()
//     .text("1", "button-1")
//     .text("2", "button-2")
//     .text("3", "button-3");

//   await ctx.reply("Выберете цифру", {
//     reply_markup: inlineKeyboard,
//   });
// });

// bot.callbackQuery([
//   "button-1",
//   "button-2",
//   "button-3"],
//   async (ctx) => {
//     await ctx.answerCallbackQuery("Вы выбрали цифру")
//     await ctx.reply("Вы выбрали цифру");
//   },
// );

// bot.on("callback_query:data", async (ctx) => {
//   await ctx.answerCallbackQuery();
//   await ctx.reply(`Вы нажали: ${ctx.callbackQuery.data}`);
// });

// bot.on(":contact", async (ctx) => {
//   await ctx.reply("Спасибо за контакт!");
// });

// bot.hears("Хорошо", async (ctx) => {
//   await ctx.reply("Класс!", {
//     reply_markup: { remove_keyboard: true },
//   });
// });

// bot.on("msg", async (ctx) => {
//   console.log(ctx.msg);
// });
/*
bot.hears(["пинг", "еще пинг"], async (ctx) => {
  await ctx.reply("понг");
});
bot.hears(/пиздец/, async (ctx) => {
  await ctx.reply("Ругаемся?");
});
bot.hears('ID', async (ctx) => {
    await ctx.reply(`Ваш ID: ${ctx.from.id}`);
  });
  */
/*
// bot.on("message:voice", async (ctx) => {
//   await ctx.reply("Голос как у черта");
// });
// bot.on("message:entities:url", async (ctx) => {
//     await ctx.reply("Ссылка на цп ?");
//   });
// bot.on('msg').filter((ctx) =>{
//    return ctx.from.id === 1065724677
// },async (ctx) => {
//     await ctx.reply('Привет, админ!')
// })
*/
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error", e);
  }
});

bot.start();
