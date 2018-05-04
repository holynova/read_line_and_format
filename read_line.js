
const fs = require('fs')
const path = require('path')
// import fs from 'fs'
// let inputs = require('./data')
// let data = inputs.data
const log = console.log.bind(console)


function readFromFile(fileName, callback) {
  fs.readFile(fileName, 'utf-8', (error, data) => {
    if (error) {
      throw error
    } else {
      if (typeof callback === 'function') {
        callback(data)
      }
    }
  })
}

function splitLines(data) {

  let arr = data
    .replace(/\r/g, '')
    .replace(/^\s+||\s+$/g, '')
    // .replace(/(\r\n)+/ig, '')
    .split(/\n{2,}/g)
  // log(JSON.stringify(data, null, 2))
  // log(JSON.stringify(arr, null, 2))
  let team = []
  for (let i = 0; i < arr.length; i += 3) {
    team.push({
      name: arr[i],
      title: arr[i + 1],
      avator: 1,
      link: 2,
      infoList: arr[i + 2] ? arr[i + 2].split(/\n{1,}/) : null,

      // infoList: arr[i + 2]
    })
  }
  saveToFile(team)

}

function saveToFile(data, dir = './output', ext = '.js') {
  function save(str, dir) {
    let now = new Date().getTime()
    let fileName = 'result' + now + ext
    let fullName = path.join(dir, fileName)
    log(fullName)
    let fd = fs.writeFile(fullName, str, (error) => {
      if (error) {
        throw error
      }
      log('写入文件成功')
    })
    // fs.close(fd)
  }
  let str = data
  if (typeof data === 'object') {
    str = JSON.stringify(data, null, 2)
  } else if (typeof data === 'string') {
    str = data
  } else {
    throw new Error(`filetype error ${typeof data}`)
    // log('file type error', typeof data)
    // return
  }
  // log(fs.existsSync(dir))
  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, () => {
      save(str, dir)
    })
  } else {
    save(str, dir)
  }

}
let inputFileName = 'data.txt'

// splitLines(data)
readFromFile(inputFileName, (data) => {
  splitLines(data)
})

