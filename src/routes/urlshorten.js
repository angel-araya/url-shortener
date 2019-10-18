const mongoose = require('mongoose');
const validUrl = require('valid-url');
const shortId = require('short-id');
require('dotenv').config();

const UrlShorten = mongoose.model('UrlShorten');

const errorUrl = `${process.env.DOMAIN}${process.env.ERROR_URI}`;

module.exports = (app) => {
    /* resolve the url */
    app.get('/l/:code', async (req, res) => {
        const urlCode = req.params.code;

        console.log(`looking for code: ${req.params.code}`);

        const item = await UrlShorten.findOne({ urlCode });

        if (!item) return res.redirect(errorUrl);
        res.redirect(item.originalUrl);
    });

    /* Redirect to the original URL */
    app.get('/api/item/:code', async (req, res) => {
        const urlCode = req.params.code;
        const item = await UrlShorten.findOne({ urlCode });

        if (item) return res.redirect(item.originalUrl);
        else return res.redirect(errorUrl);
    });

    /* Create a short url from the original */
    app.post('/api/item', async (req, res) => {
        const { originalUrl, shortBaseUrl } = req.body;

        if (!validUrl.isUri(shortBaseUrl)) return res.status(401).json('Invalid URL');

        const urlCode = shortId.generate();

        if (validUrl.isUri(originalUrl)) {
            try {
                const item = await UrlShorten.findOne({ originalUrl, shortBaseUrl });
                if (item) return res.status(200).json(item);
                else {
                    const shortUrl = `${shortBaseUrl}/${urlCode}`;
                    const newItem = new UrlShorten({
                        originalUrl,
                        shortUrl,
                        urlCode,
                    });

                    await newItem.save();
                    res.status(200).json(newItem);
                }
            } catch (err) {
                res.status(401).json(`${err}`);
            }
        } else {
            return res.status(401).json('Invalid Original Url');
        }
    });
};
