// Runs each time the server is started or the app is installed

var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var cacheLib = require('/lib/xp/cache');
var httpClient = require('/lib/http-client');
var xmlParser = require('/lib/xmlParser');

var view = resolve('rss-viewer.html');
var cache = cacheLib.newCache({
    size: 1,
    expire: 3600 // 1 hour
});


// Runs each time the part is rendered on the page

function handleGet(request) {

    var component = portal.getComponent();
    var config = component.config;

    // Clear cache if URL param 'nocache' is present
    if (request.params.nocache) {
        cache.clear();
    }

    if (config.sourceRssUrl && config.sourceRssUrl.trim()) {
        var url = config.sourceRssUrl.trim();
        try {
            // Get items from cache or RSS feed
            // URL is used as the unique cache key
            var items = cache.get(url, function () {
                var itemsFromRss = [];

                var rssRequest = httpClient.request({
                    url: config.sourceRssUrl.trim(),
                    connectionTimeout: config.connectionTimeout || 10000,
                    readTimeout: config.readTimeout || 10000
                });

                // Add each item in the RSS feed into items[] as JavaScript objects
                if (rssRequest && rssRequest.body) {
                    var rssAsJson = xmlParser.parse(rssRequest.body);
                    if (rssAsJson.rss && rssAsJson.rss.channel && rssAsJson.rss.channel.item) {
                        rssAsJson.rss.channel.item.forEach(function (item, index) {
                            var numResults = config.numResults || 5;
                            if (index < numResults) {
                                // Add current item with its relevant values
                                itemsFromRss.push({
                                    link: item.link,
                                    title: item.title
                                });
                            }
                        });
                    }
                }

                return itemsFromRss;
            });
        } catch (e) {
            log.error('Unable to get items from RSS feed. ' + e.message);
        }
    }

    var model = {
        heading: config.heading || null,
        items: (items && items.length) ? items : null,
        text: portal.processHtml({ value: config.text })
    };

    return {
        contentType: 'text/html',
        body: thymeleaf.render(view, model)
    };
}

exports.get = handleGet;
