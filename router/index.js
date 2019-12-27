const Router = require('koa-router')

const router = new Router()
const { payment } = require('../controller/wepay')

router.get('payment', payment)

module.exports = router