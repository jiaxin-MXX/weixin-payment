const Koa = require('koa')
const Router = require('koa-router')
const paymentRouter = require('./router/')

const app = new Koa()
const port = 3333

const router = new Router()
router.use('/', paymentRouter.routes())
app.use(router.routes())

app.use(() => {
  console.log(0)
})

app.listen(port, () => {
  console.log(`localhost:${port}`)
})