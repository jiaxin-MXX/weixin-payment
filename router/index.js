const Router = require('koa-router')

const router = new Router()
const { payment, notify } = require('../controller/wepay')

router.get('payment', payment)
router.post('wxpay/notify', notify)

module.exports = router