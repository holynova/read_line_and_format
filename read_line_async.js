const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
// import fs from 'fs'
// import path from 'path'
// import { promisify } from 'util'

const fileUtil = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  mkdir: promisify(fs.mkdir),
}

const log = console.log.bind(console)
const logJson = (data) => {
  log(JSON.stringify(data, null, 2))
}

async function formatFromFile(filename) {
  // log(filename)
  let data = await fileUtil.readFile(filename, 'utf-8')
  // logJson(data)
  let team = split(data)
  await saveToFile(team)

}
async function saveToFile(data, dir = './output', ext = '.js') {
  async function save(str, dir) {
    let now = new Date().getTime()
    let fileName = 'result' + now + ext
    let fullName = path.join(dir, fileName)
    // log(fullName)
    await fileUtil.writeFile(fullName, str)
    log('写入文件成功')
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
    await fileUtil.mkdir(dir)
  }
  save(str, dir)
}

function split(data) {
  let arr = data
    .replace(/\r/g, '')
    .replace(/^\s+||\s+$/g, '')
    .split(/\n{2,}/g)
  let team = []
  for (let i = 0; i < arr.length; i += 3) {
    team.push({
      name: arr[i],
      title: arr[i + 1],
      avator: 1,
      link: 2,
      infoList: arr[i + 2] ? arr[i + 2].split(/\n{1,}/) : null,
    })

  }
  return team
}

formatFromFile('data.txt')