const LineProcessor = require('./LineProcessor')
const log = console.log.bind(console)


class Translator {
  constructor(config) {
    let defaultConfig = {
      dataFileName: 'translateData.txt'
    }
    let allConfig = { ...defaultConfig, config }

    const { dataFileName } = allConfig;
    this.dataFileName = dataFileName

    this.errors = []
    this.warnings = []

    this.formatLine = this.formatLine.bind(this)
    this.getErrorMsg = this.getErrorMsg.bind(this)
    this.validateAndSplit = this.validateAndSplit.bind(this)
    this.splitLine = this.splitLine.bind(this)
    this.countValues = this.countValues.bind(this)
    this.renameValues = this.renameValues.bind(this)
    this.lineHandler = this.createHandler.bind(this)
    this.formatValue = this.formatValue.bind(this)
  }

  formatLine(line) {
    return line
    // .replace(' ', ' ')
    // .replace(/\\n/g, '\n')
    // .replace(/\s|\\s/g, ' ')
  }

  getErrorMsg(msg, line, lineIndex, indexOffset = 1) {
    if (line.indexOf('placeholder') !== -1) {
      return null
    }
    let content = line.replace(/\t/g, ' ').substr(0, 45)
    return `行号${lineIndex + indexOffset}| ${msg} |  内容:${content}`
  }

  validateAndSplit(line, lineIndex) {
    let errors = []
    let lineData = {}
    let values = line.split(/\t/g)
    // 校验部分
    // log(JSON.stringify({
    //   line, lineIndex, values
    // }, null, 2))
    if (values.length !== 9) {
      let msg = this.getErrorMsg('字段数量不够,数量=' + values.length, line, lineIndex)
      errors.push(msg)
    } else {
      let [
        pageNum, posNum, fullNum,
        baseLang, targetLang,
        temp1, temp2, temp3, valueNames] = values
      // log(JSON.stringify(values, null, 2))

      let validators = [
        {
          validator: () => pageNum,
          msg: '页码为空'
        },
        {
          validator: () => posNum,
          msg: '位置码为空'
        },
        {
          validator: () => {
            let full = parseInt(fullNum, 10)
            let page = parseInt(pageNum, 10)
            let pos = parseInt(posNum, 10)
            return full === page * 1000 + pos

          },
          msg: '位置码计算错误'
        },
        {
          validator: () => baseLang,
          msg: '基础语言/中文 为空'
        },
        {
          validator: () => targetLang,
          msg: '目标语言/外语 为空'
        },

        {
          validator: () => {
            return this.countValues(baseLang) === this.countValues(targetLang)
          },
          msg: `两种语言变量数量不同 ${this.countValues(baseLang)} !== ${this.countValues(targetLang)}`
        },

      ]

      let isAllRight = true
      for (let item of validators) {
        const { validator, msg } = item
        if (typeof validator === 'function') {
          if (!validator()) {
            isAllRight = false
            let error = this.getErrorMsg(msg, line, lineIndex)
            errors.push(error)
          }
        }
      }
      if (isAllRight) {
        lineData = {
          pageNum, posNum, fullNum,
          baseLang, targetLang,
          valueNames
        }
      }
    }


    if (errors.length === 0) {
      errors = null
    }
    return { errors, lineData }
  }

  splitLine(line) {
    let arr = line.split(/\t/g)
    return arr
    // let [
    //   pageNum, posNum, fullNum,
    //   baseLang, targetLang,
    //   temp1, temp2, temp3, valueNames] = arr

    // return {
    //   pageNum, posNum, baseLang, targetLang, valueNames
    // }
  }


  countValues(str) {
    let reg = /{.+?}/g
    let match = str.match(reg)
    // if (match) {
    //   result = match.length
    // }
    return match ? match.length : 0
  }

  formatValue(str) {
    return str
      .replace(' ', ' ')
      .replace(/\\n/g, '\n')
      .replace(/\s|\\s/g, ' ')
  }

  renameValues(str, nameStr = null, line, lineIndex) {
    // log(JSON.stringify({ str, nameStr }, null, 2))
    let result = null
    let reg = /{.+?}/g
    let n = this.countValues(str)
    if (n === 0) {
      result = str
    } else if (n === 1) {
      result = str.replace(reg, '{value}')
    } else if (n >= 2) {
      this.warnings.push(this.getErrorMsg('多于一个变量', line, lineIndex))
      // let hasNames = false
      if (nameStr) {
        let names = nameStr.split(/,+/g)
        if (names.length === n) {
          let i = 0
          result = str.replace(reg, (match) => {
            return `{${names[i++]}}`
          })
        } else {
          // this.errors.push(this.getErrorMsg('自定义变量名数量不符', line, lineIndex))
        }
      }

      if (!result) {
        this.errors.push(this.getErrorMsg('变量>1,但没有足够的命名', line, lineIndex))
        let i = 0
        result = str.replace(reg, match => {
          return `{value${i++}}`
        })
      }
    }
    return result
  }



  createHandler(lang = 'cn') {
    return (lines) => {
      let result = {}
      for (let i = 0; i < lines.length; i++) {

        let line = lines[i]
        let cleanLine = this.formatLine(line)
        let { errors, lineData } = this.validateAndSplit(cleanLine, i)
        if (errors) {
          this.errors = [...this.errors, ...errors]
          continue
        }
        // 没有错误
        const { pageNum, posNum, fullNum,
          baseLang, targetLang,
          valueNames } = lineData
        let word = lang === 'cn' ? baseLang : targetLang
        let key = fullNum
        let value = this.renameValues(word, valueNames, line, i)
        result[key] = this.formatValue(value)
      }
      result.__errors = this.errors.filter(value => value)
      result.__warnings = this.warnings.filter(value => value)
      return result
    }

  }


  go(lang = 'cn') {
    let lineHandler = this.createHandler(lang)
    let config = {
      dataFileName: this.dataFileName,
      lineHandler,
      outputFileName: lang,
    }
    let l = new LineProcessor(config)
    l.go()
  }


}

module.exports = Translator

// let t = new Translator()
// t.go()