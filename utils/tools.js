const convert = require('xml-js')
const randomstring = require("randomstring")

exports.xml2js = xml => {
  let message = convert.xml2js(xml, {
    compact: true,
    textKey: 'value',
    cdataKey: 'value'
  }).xml
  
  let reducedObj = Object.keys(message).reduce((obj, key) => {
    obj[key] = message[key]['value']
    return obj
  }, {})

  return reducedObj
}

exports.genTimestamp = () => {
  return new Date().getTime()
}

exports.genNonceStr = () => {
  return randomstring.generate(32)
}

exports.genTimestampSecond = () => {
  return Math.ceil((new Date().getTime())/1000)
}