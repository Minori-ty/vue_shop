// 导入 request 模块
const request = require('request')

// 自动匹配运单号所属的物流公司
function autoComNumber(orderno) {
  // http://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=804909574412544580
  const url = `http://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=${orderno}`
  return new Promise(function(resolve, reject) {
    request(url, (err, response, body) => {
      if (err) return reject({ status: 500, msg: err.message })
      // resolve(body)
      // console.log(body.num)
      body = JSON.parse(body)
      if (body.auto.length <= 0) return reject({ status: 501, msg: '无对应的物流公司' })
      resolve({ status: 200, msg: body.auto[0], comCode: body.auto[0].comCode })
    })
  })
}

async function getLogisticsInfo(req, res) {
  const result = await autoComNumber(req.params.orderno)

  if (result.status !== 200) {
    return {
      meta: {
        status: 500,
        message: '获取物流信息失败！'
      }
    }
  }

  //   // http://www.kuaidi100.com/query?type=yuantong&postid=804909574412544580&temp=0.5873204070187814&phone=
  // https://www.kuaidi100.com/query?type=yuantong&postid=804909574412544580&temp=0.6319710544680956&phone=
  const dataUrl = `http://www.kuaidi100.com/query?type=${result.comCode}&postid=${
    req.params.orderno
  }&temp=0.6319710544680956&phone=`
  console.log(dataUrl)
  request(dataUrl, (err, response, body) => {
    if (err) {
      return res.send({
        meta: {
          status: 501,
          message: '获取物流信息失败！'
        }
      })
    }
    console.log(JSON.parse(body))
    // 获取物流信息成功
    return res.send({
      meta: {
        status: 200,
        message: '获取物流信息成功！'
      },
      // data: (JSON.parse(body)).data
      data: [
        {
          time: '2019-03-19 13:07:40',
          ftime: '2019-03-19 13:07:40',
          context: '快件已签收 签收人: 家人 感谢使用圆通速递，期待再次为您服务',
          location: null
        },
        {
          time: '2019-03-19 07:49:12',
          ftime: '2019-03-19 07:49:12',
          context: '北京市顺义区顺义机场公司派件人: 侯国宝（155****5526） 正在派件',
          location: null
        },
        {
          time: '2019-03-19 06:38:38',
          ftime: '2019-03-19 06:38:38',
          context: '快件已到达 北京市顺义区顺义机场公司',
          location: null
        },
        {
          time: '2019-03-18 21:45:46',
          ftime: '2019-03-18 21:45:46',
          context: '快件已发往 北京市顺义区顺义机场公司',
          location: null
        },
        {
          time: '2019-03-18 19:32:10',
          ftime: '2019-03-18 19:32:10',
          context: '快件已到达 北京转运中心',
          location: null
        },
        {
          time: '2019-03-18 00:21:50',
          ftime: '2019-03-18 00:21:50',
          context: '快件已发往 北京转运中心',
          location: null
        },
        {
          time: '2019-03-17 21:25:35',
          ftime: '2019-03-17 21:25:35',
          context: '快件已到达 淮安转运中心',
          location: null
        },
        {
          time: '2019-03-17 19:16:06',
          ftime: '2019-03-17 19:16:06',
          context: '快件已发往 江苏省宿迁市沭阳县公司',
          location: null
        },
        {
          time: '2019-03-17 19:04:21',
          ftime: '2019-03-17 19:04:21',
          context: '江苏省宿迁市沭阳县公司取件人: 李红雨（15751571351） 已收件',
          location: null
        }
      ]
    })
  })
}

module.exports = {
  getLogisticsInfo
}
