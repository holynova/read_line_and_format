const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify

const fileUtil = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  mkdir: promisify(fs.mkdir),
}
const log = console.log.bind(console)
const logJson = (data) => {
  log(JSON.stringify(data, null, 2))
}

//===============================
// 关键参数 lineHandler 函数
// 输入从文件中读到的行数据
// 输出需要存到文件中的数字
class LineProcessor {
  constructor(dataFileName, lineHandler, outputDir = './output', outputExt = '.js', ) {
    this.dataFileName = dataFileName
    this.outputDir = outputDir
    this.outputExt = outputExt
    this.lineHandler = lineHandler

    // this.formatLine = this.formatLine.bind(this)
    this.saveToFile = this.saveToFile.bind(this)
    this.getOutputFileName = this.getOutputFileName.bind(this)
    this.dataToStr = this.dataToStr.bind(this)

    this.formatData = this.formatData.bind(this)
    this.getLineArray = this.getLineArray.bind(this)

  }


  // formatLine(data) {
  //   let cleanData = data
  //     .replace(/\r/g, '')
  //     .replace(/^\s+||\s+$/g, '')
  //   let arr = cleanData.split(/\n{2,}/g)

  //   let result = []
  //   for (let i = 0; i < arr.length; i += 3) {
  //     result.push({
  //       name: arr[i],
  //       title: arr[i + 1],
  //       avator: 1,
  //       link: 2,
  //       infoList: arr[i + 2] ? arr[i + 2].split(/\n{1,}/) : null,
  //     })
  //   }
  //   return result
  // }

  formatData(data) {
    let result = null
    let lines = this.getLineArray(data)
    if (typeof this.lineHandler === 'function') {
      result = this.lineHandler(lines)
    }
    return result
  }

  getLineArray(data) {
    let cleanData = data
      .replace(/\r/g, '')
      .replace(/^\s+||\s+$/g, '')
    let lines = cleanData.split(/\n{1,}/g)
    return lines;
  }

  dataToStr(data) {
    let str = data
    if (typeof data === 'object') {
      str = JSON.stringify(data, null, 2)
    } else if (typeof data === 'string') {
      str = data
    } else {
      throw new Error(`filetype error ${typeof data}`)
    }
    return str
  }

  getOutputFileName() {
    let now = new Date().getTime()
    let fileName = 'result' + now + this.outputExt
    let fullName = path.join(this.outputDir, fileName)
    return fullName
  }

  saveToFile(data) {

    //===============================
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir)
    }
    // save(str, dir)
    let filename = this.getOutputFileName()
    let dataStr = this.dataToStr(data)
    fileUtil.writeFile(filename, dataStr)
    return filename;
  }

  go() {
    fileUtil.readFile(this.dataFileName, 'utf-8')
      .then(this.formatData)
      .then(this.saveToFile)
      .then((name) => {
        log('已存入文件' + name)
      })
      .catch(err => {
        throw err
      })
  }
}

module.exports = LineProcessor

