const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const static = require('koa-static')
let bodyparser = require('koa-bodyparser')
let views = require('koa-views')

const paymentRouter = require('./router/')

const app = new Koa()
const port = 3333

app.use(static('./public'))
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))
app.use(bodyparser())

const router = new Router()
router.use('/', paymentRouter.routes())
app.use(router.routes())

app.listen(port, () => {
  console.log(`localhost:${port}`)
})