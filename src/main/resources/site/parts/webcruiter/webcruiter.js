var portal = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');
var httpClient = require('/lib/http-client');
var xmlParser = require('/lib/xmlParser');

var view = resolve('webcruiter.html');



function handleGet(request) {

    var component = portal.getComponent();
    var config = component.config;

    var vacancies = [];
    if (config.sourceRssUrl && config.sourceRssUrl.trim()) {
        var rssRequest;
        try {
            rssRequest = httpClient.request({
                url: config.sourceRssUrl.trim(),
                connectionTimeout: config.connectionTimeout || 10000,
                readTimeout: config.readTimeout || 10000
            });
        } catch (e) {
            log.error(e);
        }

        // Add each vacancy in the RSS feed into vacancies[] as JavaScript objects
        if (rssRequest && rssRequest.body) {
            var rssAsJson = xmlParser.parse(rssRequest.body);
            if (rssAsJson.rss && rssAsJson.rss.channel && rssAsJson.rss.channel.item) {
                rssAsJson.rss.channel.item.forEach(function (item) {
                    // Add current vacancy with its relevant values
                    vacancies.push({
                        link: item.link,
                        title: item.title
                    });
                });
            }
        }
    }

    var model = {
        heading: config.heading || null,
        vacancies: vacancies,
        text: portal.processHtml({ value: config.text })
    };

    return {
        contentType: 'text/html',
        body: thymeleaf.render(view, model)
    };
}

exports.get = handleGet;




/*

Example response using the following RSS URL:
https://www.webcruiter.no/webservices/webcruiterculture.asmx/RSSFeed?Company_Id=3281829219&Culture_Id=NB-NO&cultureid=NB-NO&link_source_id=500&par=YCvhGF9zp2pgScoAIQLm94RlcDGgBaJSTIdoZB2w%2bS5w9%2f1s4sHZnSjeaBYFRFh2B7n0vXzgbg2qAsq%2bP3vyiZMaOZthsHaaUTIILEPwM4eGKtakf%2bRpktpDsSVbi0LMB0P1mKXrzhhaoYL3NUjBE1%2f6HE8UCt6NVTGo2KBWDSshUz3wH7OmlCgkXziLd6SRqagUPKc0n6ZteQG089pC2zdsSBnT%2b1xchdnjJDjARI0%3d

Values to fetch:
rss.channel.item[].url
rss.channel.item[].title

{
    "rss": {
        "xmlns:wc": "http://webcruiter.no/xml/",
        "channel": {
            "item": [
                {
                    "dc:pubDate": "2017-06-09",
                    "wc:Qualification": "",
                    "link": "https://www.webcruiter.no/wcmain/advertviewpublic.aspx?oppdragsnr=3477715527&company_id=3281829219&Link_source_id=500&use_position_site_header=0&culture_id=NB-NO&par=YCvhGF9zp2pgScoAIQLm94RlcDGgBaJSTIdoZB2w%2bS5w9%2f1s4sHZnSjeaBYFRFh2B7n0vXzgbg2qAsq%2bP3vyiZMaOZthsHaaUTIILEPwM4eGKtakf%2bRpktpDsSVbi0LMB0P1mKXrzhhaoYL3NUjBE1%2f6HE8UCt6NVTGo2KBWDSshUz3wH7OmlCgkXziLd6SRqagUPKc0n6ZteQG089pC2zdsSBnT%2b1xcMsentKDgdv0%3d",
                    "dc:creator": "Elisabeth Grebstad Rødseth",
                    "wc:ApplicableCondition": "",
                    "wc:Personality": "",
                    "description": "DETTE ER IKKE EN UTLYSNING - INGEN LEDIG STILLING - DENNE ER OPPRETTET KUN MED BAKGRUNN I BEDRIFTENS BEHOV FOR CV OVERSIKT PÅ LEDERNIVÅ",
                    "wc:RefNr": 3477715527,
                    "wc:StartDate": "",
                    "title": "CV registering for Ledere - IKKE LEDIG STILLING",
                    "wc:CompanyId": 3281829219,
                    "wc:ExternalPositionCode": "",
                    "wc:WorkplacePostno": "0154",
                    "wc:WePubDateTo": "",
                    "wc:AdvertTextFree": "",
                    "wc:CountryName": "Norge",
                    "wc:company_name": "Mantena",
                    "wc:EndDate": "",
                    "wc:WorkplaceCounties": "",
                    "wc:WorkplaceStreetAddress": "Karl Johansgate 2",
                    "wc:IntranetPubDateTo": "2022-01-01",
                    "wc:Culture_Id": "NB-NO",
                    "wc:EducationTitle": "",
                    "wc:AdvertId": 3477715527,
                    "wc:IntranetPubDateFrom": "2017-06-09",
                    "wc:WorkplacePostaddress": "Oslo",
                    "dc:date": "2017-06-09",
                    "wc:WePubDateFrom": "",
                    "wc:apply_within_date": "Snarest",
                    "wc:CountryId": 1,
                    "wc:WorkhourPercentage": 0,
                    "wc:NumberOfPositions": 1
                },
                {
                    "dc:pubDate": "2018-02-09",
                    "wc:Qualification": "Fagbrev innenfor logistikkfaget. Lang erfaring kan kompensere for kravet til fagbrev\r\nDatakunnskaper\r\nTruckførerbevis T1, T2 og T4\r\nKrankurs G4\r\nLastebilsertifikat C1 og C2 kan være en fordel\r\nHar du teknisk forståelse på deler er det en fordel\r\nKjenner til Leanarbeid\r\nBeherske norsk, skriftlig og muntlig",
                    "link": "https://www.webcruiter.no/wcmain/advertviewpublic.aspx?oppdragsnr=3708631042&company_id=3281829219&Link_source_id=500&use_position_site_header=0&culture_id=NB-NO&par=YCvhGF9zp2pgScoAIQLm94RlcDGgBaJSTIdoZB2w%2bS5w9%2f1s4sHZnSjeaBYFRFh2B7n0vXzgbg2qAsq%2bP3vyiZMaOZthsHaaUTIILEPwM4eGKtakf%2bRpktpDsSVbi0LMB0P1mKXrzhhaoYL3NUjBE1%2f6HE8UCt6NVTGo2KBWDSshUz3wH7OmlCgkXziLd6SRqagUPKc0n6ZteQG089pC2zdsSBnT%2b1xcMsentKDgdv0%3d",
                    "dc:creator": "Elisabeth Grebstad Rødseth",
                    "wc:ApplicableCondition": "Vi tilbyr varierte arbeidsoppgaver i et uformelt og hyggelig miljø.\r\nLønn etter tariff.",
                    "wc:Personality": "Nøyaktig\r\nPålitelig\r\nPunktlig\r\nLiker å samarbeide og jobbe i team\r\nBidrar til å opprettholde og forbedre lagersystemer og rutiner\r\nEndringsvillig\r\nRyddig",
                    "description": "Mantena kan tilby den totale logistikkløsningen – fra kontraktsinngåelser til innkjøp, lageroptimalisering, varelegging, pakking og transport. Våre medarbeidere har lang erfaring og god kunnskap om leverandører innen jernbanerelaterte virksomheter.\r\nVi har utstyr for løfting og lagring av tunge komponenter, samt spesialtilpassede kjøretøy for transport av boggier og andre tyngre komponenter. Vi kjenner hele verdikjeden, fra behov til ferdig komponent – og ut til vedlikeholdsenhetene. Vi har gode systemer og rutiner til å optimalisere togvedlikeholdet. \r\n\r\nFor å bidra til gode leveranser i hele Mantena søker vi nå etter flere personer på lageret vårt på Grorud.",
                    "wc:RefNr": 3708631042,
                    "wc:StartDate": "",
                    "title": "Logistikkmedarbeider",
                    "wc:CompanyId": 3281911286,
                    "wc:ExternalPositionCode": "",
                    "wc:WorkplacePostno": "0975",
                    "wc:WePubDateTo": "2018-02-25",
                    "wc:AdvertTextFree": "",
                    "wc:CountryName": "Norge",
                    "wc:company_name": "Mantena Logistikk",
                    "wc:EndDate": "",
                    "wc:WorkplaceCounties": "",
                    "wc:WorkplaceStreetAddress": "Eilerts Smiths vei 1",
                    "wc:IntranetPubDateTo": "2018-02-25",
                    "wc:Culture_Id": "NB-NO",
                    "wc:EducationTitle": "Logistikkfagbrev",
                    "wc:AdvertId": 3708631042,
                    "wc:IntranetPubDateFrom": "2018-02-09",
                    "wc:WorkplacePostaddress": "Oslo",
                    "dc:date": "2018-02-08",
                    "wc:WePubDateFrom": "2018-02-09",
                    "wc:apply_within_date": "2018-02-25",
                    "wc:CountryId": 1,
                    "wc:WorkhourPercentage": 100,
                    "wc:NumberOfPositions": 3
                }
            ],
            "link": "https://www.webcruiter.no/wcmain/advertviewpublic.aspx?company_id=3281829219&Link_source_id=500&par=YCvhGF9zp2pgScoAIQLm94RlcDGgBaJSTIdoZB2w%2bS5w9%2f1s4sHZnSjeaBYFRFh2B7n0vXzgbg2qAsq%2bP3vyiZMaOZthsHaaUTIILEPwM4eGKtakf%2bRpktpDsSVbi0LMB0P1mKXrzhhaoYL3NUjBE1%2f6HE8UCt6NVTGo2KBWDSshUz3wH7OmlCgkXziLd6SRqagUPKc0n6ZteQG089pC2zdsSBnT%2b1xchdnjJDjARI0%3d",
            "description": "WebCruiter.no",
            "language": "NO",
            "title": "WebCruiter.no",
            "wc:culture_id": "NB-NO"
        },
        "version": 2,
        "xmlns:dc": "http://purl.org/dc/elements/1.1/"
    }
}

*/
