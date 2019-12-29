const querystring = require('querystring')
const crypto = require('crypto')
const convert = require('xml-js')
const QRCode = require('qrcode')
const getRawBody = require('raw-body')
const contentType = require('content-type')

const config = require('../config/')
const { post } = require('../utils/http')
const io = require('../utils/socket')

let client = null
io.on('connection', socket => {
  client = socket
})

const {
  genNonceStr,
  xml2js
} = require('../utils/tools')

const genSign = (_prepay) => {
  const _sortedPrepay = Object.keys(_prepay).sort().reduce((obj, key) => {
    obj[key] = _prepay[key]
    return obj
  }, {})

  const stringA = querystring.stringify(_sortedPrepay, null, null, {
    encodeURIComponent: (value) => {
      return decodeURIComponent(value)
    }
  })

  const prepay = stringA + '&key=' + config.key

  const signValue = crypto.createHash('md5').update(prepay).digest('hex')

  return signValue
}

const genXml = (_prepay, sign) => {
  const dataObj = {
    xml: {
      ..._prepay,
      sign
    }
  }
  
const xmlBody = convert.js2xml(dataObj, {
    compact: true
  })
  // console.log(xmlBody)
  return xmlBody
}

exports.payment = async (ctx, next) => {
  const { body, out_trade_no } = ctx.query

  // 统一下单
  // 1. 公众账号ID
  const appid = config.appid

  // 2. 商户号
  const mch_id = config.mch_id

  // 3. 随机字符串
  const nonce_str= genNonceStr()

  // 5. 商品描述

  // 6. 商户订单号

  // 7. 标价金额
  const total_fee = 1

  // 8. 通知地址
  const notify_url = config.notify_url

  // 9. 交易类型
  const trade_type = 'NATIVE'

  // 4. 签名
  const _prepay = {
    appid,
    mch_id,
    nonce_str,
    body:'一听可乐',
    out_trade_no:'12312',
    total_fee,
    notify_url,
    trade_type
  }

  const sign = genSign(_prepay)
  const xmlBody = genXml(_prepay, sign)
  
  // 调用统一下单接口
  let result = await post({
    url: config.unifiedorder,
    data: xmlBody
  })
  
  let { code_url } = xml2js(result.data)
  
  let imgurl = await QRCode.toDataURL(code_url)

  await ctx.render('qrcode', {
    imgurl
  })
}

exports.notify = async (ctx, next) => {

  let result = await getRawBody(ctx.req, {
    length: ctx.req.headers['content-length'],
    limit: '1mb',
    encoding: contentType.parse(ctx.req).parameters.charset
  })

  let notifyResult = xml2js(result)
  
  let sign = notifyResult.sign
  delete notifyResult.sign
  let mySign = genSign(notifyResult)

  if (sign === mySign.toUpperCase()) {
    ctx.set('Content-type', 'text/plain')
    ctx.body = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>'
    client.emit('getMsg', 'success')
  } else {
    ctx.body = '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[ERROR]]></return_msg></xml>'
  }
}