const https = require('https');


module.exports = (req, res) => {
  const searchParams = new URLSearchParams(req._parsedUrl.search);
  searchParams.set('appid', process.env.APP_ID)

  https.get(`https://api.wolframalpha.com/v2/query?${searchParams}`, (resp) => {

    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      res.setHeader('Access-Control-Allow-Origin', `chrome-extension://${process.env.EXT_ID}`);
      res.setHeader('Vary', 'Origin');
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET");
      let contentType = resp.headers['content-type'];
      if (searchParams.get('output') === 'json') {
        contentType = contentType.replace('text/plain', 'application/json');
      }
      res.setHeader('Content-Type', contentType)
      res.send(data);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
