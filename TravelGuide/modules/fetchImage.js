const fetch = require("node-fetch");

async function fetchImage(cityName) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;

    try {
        const response = await fetch(url)

        if (!response.ok) {
            console.error('API error: ${response.status}');
            return null;
        }

        const data = await response.json();

        if (data.thumbnail && data.thumbnail.source) {
            return data.thumbnail.source;
        } else {
            // no thumbnail available
            return null;
        }
    } catch (err) {
        console.error(err);
        return null;
    }

}

module.exports = { fetchImage };