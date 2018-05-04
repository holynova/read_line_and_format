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
class Splitter {
  constructor(dataFileName, outputDir = './output', outputExt = '.js') {
    this.dataFileName = dataFileName
    this.outputDir = outputDir
    this.outputExt = outputExt

    this.formatLine = this.formatLine.bind(this)
    this.saveToFile = this.saveToFile.bind(this)
    this.getOutputFileName = this.getOutputFileName.bind(this)
    this.dataToStr = this.dataToStr.bind(this)
  }

  go() {
    fileUtil.readFile(this.dataFileName, 'utf-8')
      .then(this.formatLine)
      .then(this.saveToFile)
      .then(() => {
        log('已存入文件')
      })
      .catch(err => {
        throw err
      })
  }

  formatLine(data) {
    let arr = data
      .replace(/\r/g, '')
      .replace(/^\s+||\s+$/g, '')
      .split(/\n{2,}/g)
    let result = []
    for (let i = 0; i < arr.length; i += 3) {
      result.push({
        name: arr[i],
        title: arr[i + 1],
        avator: 1,
        link: 2,
        infoList: arr[i + 2] ? arr[i + 2].split(/\n{1,}/) : null,
      })
    }
    return result
    // let p = new Promise((resolve, reject) => {
    //   resolve(result)
    // })
    // return p
    // return team
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
  }
}

let s = new Splitter('data.txt')
s.go()
