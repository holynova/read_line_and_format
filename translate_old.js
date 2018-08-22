// const log = console.log.bind(console)
const log = () => { }
const LineProcessor = require('./LineProcessor');

const genValue = (lines, type = 'cn') => {
  let result = {}
  let errors = []
  let cnt = 0
  let notFullErrorCnt = 0
  let numberErrorCnt = 0
  for (let i = 0; i < lines.length; i++) {
    // for (let line of lines) {
    let line = lines[i]
    let parts = line.replace(' ', ' ').split(/\t+/g)
    // 不能分成五段, 则证明没有填好, 报错
    if (parts.length !== 5) {
      notFullErrorCnt++
      let errorMsg = `error 这一行没填满 变量不够 | 行号:${i + 1} 内容:${line} 内容长度"${parts.length}`
      errors.push(errorMsg)
      log(errorMsg)
    } else {
      const [pageNo, fieldNo, fullNo, cn, en] = parts
      let full = parseInt(pageNo, 10) * 1000 + parseInt(fieldNo, 10)
      if (full !== parseInt(fullNo, 10)) {
        numberErrorCnt++
        let errorMsg = `error 编号计算有问题 | 行号:${i + 1} 内容:${line} ${JSON.stringify({ full, fullNo })}`
        errors.push(errorMsg)
        log(errorMsg)
      } else {
        let languageStr = type === 'cn' ? cn : en
        let reg = /{.+?}/g
        let match = languageStr.match(reg)
        let formattedStr = languageStr
        if (match) {
          formattedStr = languageStr.replace(reg, '{value}')
          if (match.length > 1) {
            let errorMsg = `多于一个变量 | 行号:${i + 1} 内容:${line}`
            errors.push(errorMsg)
            log(errorMsg)
            // log(`多于一个变量`, line)
          }
        }
        // log(`成功${fullNo}`)
        result[fullNo] = formattedStr
        cnt++
      }
    }
  }
  let allCnt = cnt + notFullErrorCnt + numberErrorCnt
  let summary = `总共${allCnt} = 成功${cnt}个词组 + 行没填满${notFullErrorCnt}个 + 编号计算有错误${numberErrorCnt}`
  console.log(summary)
  errors.push(summary)
  result.__errors = errors
  return result
}

const genCN = (lines) => {
  return genValue(lines, 'cn')
}
const genEN = (lines) => {
  return genValue(lines, 'en')
}


let l1 = new LineProcessor('translateData.txt', genCN, './output', '.json')
let l2 = new LineProcessor('translateData.txt', genEN, './output', '.json')
// let l2 = new LineProcessor('translateData.txt', genEN, './translate_output', '.json')

l1.go()
l2.go()
