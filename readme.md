# 微信支付-扫码支付

微信扫码支付

一、介绍

https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=6_1

本案例采用模式二开发

二、具体步骤：

①生成需要编译成二维码格式的js数据

```js
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
  //生成签名
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
```



②进行签名检验获取sgin

> 安全规范
>
> https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=4_3

③生成xml格式文件

```js
 const xmlBody = genXml(_prepay, sign)
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
```

④调用统一下单接口获取code_url（下单连接）

>统一下单接口详情
>
>https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_1

⑤吧code_url生成二维码返回前端



### 用户支付完成之后

①获取支付信息，（存在raw-body里面）

```js
let result = await getRawBody(ctx.req, {
    length: ctx.req.headers['content-length'],
    limit: '1mb',
    encoding: contentType.parse(ctx.req).parameters.charset
  })
```

②把信息转成js数据格式，取出sgin删除原有数据的sgin

```js
  let notifyResult = xml2js(result)
  
  let sign = notifyResult.sign

  delete notifyResult.sign
```

③把删除完的信息再次进行签名校验，获取新的sgin

```js
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
```

④新老sgin进行比较，新的需要转大写，相同返回支付成功页面


> 微信官网介绍
>
> https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=6_5


