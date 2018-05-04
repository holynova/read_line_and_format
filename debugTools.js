const log = console.log.bind(console)
const logJson = (data) => {
  log(JSON.stringify(data, null, 2))
}

module.exports = {
  log,
  logJson,
}