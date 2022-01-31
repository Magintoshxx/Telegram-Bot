require("dotenv").config();

const BOT_API       = process.env.BOT_API || '5278128402:AAHYu4FNGUOlrHczrpq-qLtWyBPaqVSr4mI';
const PORT          = process.env.PORT || 3000;
const URL           = process.env.URL || 'https://telebotax.herokuapp.com';

const { Telegraf, Markup } = require('telegraf')
const bot       = new Telegraf(BOT_API);

const config = require('./config');

// Bota start verdiğinizde atılan ilk mesaj
bot.start((ctx) => {
    return ctx.reply("Hey");
});


bot.hears(/selam/ig, async (ctx, next) => {
    await ctx.telegram.sendPhoto(ctx.chat.id,
        'https://www.ajanskirim.com/wp-content/uploads/2019/03/1525995635Merhaba.jpg',
        { caption:  `<b>${ctx.from.first_name}</b>`,  parse_mode: 'HTML' })
    return next();
});

bot.command('temizle', (ctx, temiz) =>{

   let k = 0;
for(let i = 0; i <= 1; i++ ){
    k =  ctx.message.message_id-i;
    ctx.deleteMessage(k)
}
    return ctx.reply("Sohbet geçmişi temizlendi.")
    
})


bot.command('destur', async (ctx, next) => {
    await ctx.telegram.sendMessage(ctx.chat.id, `<b>${ctx.from.first_name}, Hoşgeldiniz hünkarım. </b>`, { parse_mode: 'HTML' })
    return next();
});


bot.command('web', async (ctx, next) => {
    await ctx.reply('<b>Hangi web sitesine erişmek istiyorsunuz.?</b>', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [Markup.button.url('Asos Turizm', 'www.asosturizm.com')],
            [Markup.button.url('Asos Transfer', 'www.asostransfer.com')],
            [Markup.button.url('TransferSepetim', 'www.transfersepetim.com')],
            [Markup.button.url('VipUpp', 'www.vipupp.com.tr')],
            [Markup.button.url('Staff', 'www.asosturizm.com/staff')],
            [Markup.button.callback('Yok ben almıyım.', 'kapat')]
        ])
    })
}
            
            async function searchMessage(ctx){
    await ctx.reply('<b>Hangi arama motorunu kullanmak istiyorsunuz?</b>', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
         [Markup.button.url('Asos Turizm', 'www.asosturizm.com')],
            [Markup.button.url('Asos Transfer', 'www.asostransfer.com')],
            [Markup.button.url('TransferSepetim', 'www.transfersepetim.com')],
            [Markup.button.url('VipUpp', 'www.vipupp.com.tr')],
            [Markup.button.url('Staff', 'www.asosturizm.com/staff')],
            [ Markup.button.callback('Yok ben almıyım.', 'kapat'), Markup.button.callback('Diğer', 'all')]
        ])
    })
}


bot.action('all', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.editMessageText('Yandex, DuckDuckGo, Yahoo ?', Markup.inlineKeyboard([
            [Markup.button.url('Asos Turizm', 'www.asosturizm.com')],
            [Markup.button.url('Asos Transfer', 'www.asostransfer.com')],
            [Markup.button.url('TransferSepetim', 'www.transfersepetim.com')],
            [Markup.button.url('VipUpp', 'www.vipupp.com.tr')],
            [Markup.button.url('Staff', 'www.asosturizm.com/staff')],
        [Markup.button.callback('Geri', 'geri')]
    ]))
})


bot.action('geri', ctx => {
    ctx.deleteMessage()
    searchMessage(ctx)
})


bot.action('kapat', ctx => {
    ctx.answerCbQuery()
    ctx.deleteMessage()
});


bot.command("buton", ctx => {
    ctx.deleteMessage()
    searchMessage(ctx)
})



bot.use(
    require('./handlers/middlewares'),
    require('./plugin')
);

// Kodlarda hata çıkarsa bunun sayesinde çalışmaya devam eder.
bot.catch((err) => {
    console.log('Error: ', err)
})

// Botun kullanıcı adını alan bir kod.
bot.telegram.getMe().then(botInfo => {
    bot.options.username = botInfo.username
    console.log(`Bot Başlatıldı! => ${bot.options.username}`)
})

// Heroku sitesinde botunuzun kullanıcı adı gözükür -> deneyselbot.herokuapp.com
const cb = function(req, res) {
    res.end(`${bot.options.username}`)
}

// Botun webhook ile çalışmasını sağlar.
bot.launch({
    webhook: {
        domain: `${URL}`,
        port: `${PORT}`,
        cb
    }
})

// Bu botumuzu nazikçe durdurmayı etkinleştirir.
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
