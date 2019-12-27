const Koa = require('koa');
const app = new Koa();
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
const port = 8081;

server.listen(process.env.PORT || port, () => {
  console.log(`app run at : http://127.0.0.1:${port}`);
})

module.exports = io