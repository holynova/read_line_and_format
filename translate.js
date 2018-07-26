const LineProcessor = require('./LineProcessor');


// let s = new Splitter('data.txt')
// 输入从文件中读到的行数据
// 输出需要存到文件中的数字
const dealWithLines = (lines) => {
  let result = {}
  for (let line of lines) {
    let parts = line.split(/\t/g)
    let [id, cn, en] = parts
    let languageStr = en
    if (languageStr) {
      let reg = /{.+?}/g
      let match = languageStr.match(reg)
      if (match) {
        let formattedStr = languageStr.replace(reg, '{value}')
        result[id] = formattedStr
        if (match.length > 1) {
          log(id, languageStr)
        }
      } else {
        result[id] = languageStr
      }
    } else {
      // log(JSON.stringify(parts, null, 2))
    }
  }
  return result;
}

let l = new LineProcessor('translateData.txt', dealWithLines, './translate_output')

l.go()
