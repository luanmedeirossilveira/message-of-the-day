const { default: axios } = require("axios");
const { translate } = require("@vitalets/google-translate-api");
const { createClient } = require("pexels");

const server = require("websocket").server,
  http = require("http");

const socket = new server({
  httpServer: http.createServer().listen(1337),
});

const apiConselho = "https://api.adviceslip.com/advice";
const apiKeyPexels = "563492ad6f917000010000017666a0669a824f069a9727f7637a5aa5";

const client = createClient(apiKeyPexels);
const query = "Nature";

socket.on("request", function (request) {
  const connection = request.accept(null, request.origin);

  connection.on("message", function () {
    setInterval(function () {
      axios
        .get(apiConselho)
        .then((res) => {
          client.photos.search({ query, per_page: 1 }).then(async (photos) => {
            const { text } = await translate(res.data.slip.advice, {
              to: "pt-br",
            });

            connection.send(
              JSON.stringify({
                message: text,
                photo: photos.photos[0].src.original,
              })
            );
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }, 10000);
  });

  connection.on("close", function (connection) {
    console.log("connection closed");
  });
});
