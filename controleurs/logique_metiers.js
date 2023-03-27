const SerpApi = require('google-search-results-nodejs');
process.env.PUPPETEER_EXECUTABLE_PATH = '/usr/bin/google-chrome-stable'

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality

const axios = require('axios');
const cheerio = require('cheerio');
const ps = require('./objets')
const fs = require('fs');




exports.searchShooesSraping = (req, res, next) => {
    (async () => {
        let choix = "basket";
        let link = `https://www.google.com/search?q=${choix}&hl=fr&source=lnms&tbm=shop&ei=3uYhZPPNLd3YkdUPiJK3-Ac&start=80&sa=X&ved=2ahUKEwiH04u82fz9AhVfVKQEHT_IBsgQ_AUoAXoECAMQAw&biw=1920&bih=929`
        console.log(link);
        try {
            await ps.initiate({ millisecondsTimeoutSourceRequestCount: 30000 }, true); 
            const crawlResults = await ps.crawl(link);
            const $ = cheerio.load(crawlResults.pageSource);
            const images = [];
            $('.VOo31e').each(async (i, el) => {
                const url = $(el).find(".ArOc1c").children().first().attr('src');
                images.push(url);
                const path = `./images/${choix}/${i+80}.png`;
                const writer = fs.createWriteStream(path);
                const response = await axios({
                    url,
                    responseType: 'stream',
                });
                response.data.pipe(writer);
            });
            ps.close();
            return res.status(200).json({ images });
        } catch (e){
            console.log(e);
            return res.status(500).json({ message: "Erreur interne du serveur" });
        }
    })();
}
