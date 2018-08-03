const log = console.log.bind(console)
const LineProcessor = require('./LineProcessor');


// let s = new Splitter('data.txt')
// 输入从文件中读到的行数据
// 输出需要存到文件中的数字
const dealWithLines = (lines) => {
  let result = {}
  for (let line of lines) {
    let parts = line.replace(' ', ' ').split(/\t/g)
    let [id, cn, en] = parts
    let languageStr = cn
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


const genValue = (lines, type = 'cn') => {
  let result = ''
  for (let line of lines) {
    let parts = line.replace(' ', ' ').split(/\t/g)
    let [id, cn, en] = parts
    let languageStr = type === 'cn' ? cn : en
    if (languageStr) {
      let reg = /{.+?}/g
      let match = languageStr.match(reg)

      //如果有变量
      if (match) {
        let formattedStr = languageStr.replace(reg, '{value}')
        // result[id] = formattedStr

        if (match.length > 1) {
          log(id, languageStr)
          result += '!!!!!多于一个变量\n'
        } else {
          result += formattedStr + '\n'
          // result.push(formattedStr)
        }
      } else {
        result += '-\n'
        // result.push('-')
      }

    } else {
      result += '-\n'

      // result.push('-')
    }
  }
  return result
}

const genCN = (lines) => {
  return genValue(lines, 'cn')
}
const genEN = (lines) => {
  return genValue(lines, 'en')
}


let l1 = new LineProcessor('translateData.txt', genCN, './translate_output')
let l2 = new LineProcessor('translateData.txt', genEN, './translate_output')

l1.go()
l2.go()
