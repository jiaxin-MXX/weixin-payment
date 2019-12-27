const axios = require('axios')

exports.get = ({
  url
}) => {
  return axios({
    url
  })
  .then((result) => {
    return result.data
  })
}

exports.post = ({
  url,
  data
}) => {
  return axios({
    url,
    method: 'POST',
    headers: {
      'content-type': 'text/plain'
    },
    data
  })
  .then((result) => {
    return result
  })
}