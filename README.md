# 行处理程序
## 作用
1. 从文件中按行读取数据
2. 按行处理数据
3. 将结果存入新的文件

## 使用方法及参数
1. 准备数据源文件`dataSource.txt`
2. 创建`instance`, 并传入配置参数

  ```
  const LineProcessor = require('./LineProcessor');
  function lineHandler(lines){
    let result = {}
    for(let line of lines){
    // 按行处理数据
      result.key = value
      ...
    }
    // 返回一个数据, JSON序列化后存入输出文件
    return result
  }

  let config = {
    dataFileName:'translateData.txt',
    lineHandler,
  }

  let l = new LineProcessor(config)

  l.go()

  ```
3. node运行

## 构造器参数

变量[=默认值] | 类型|是否必传|描述
---|---|---|---
   `dataFileName`|string|必传|数据文件名
   `lineHandler`| function(lines){}|必传|行处理函数
   `outputFileName` = ''|string|非必传|文件名(不含后缀) 不传则会按时间自动命名
   `outputDir` = './output'|string|非必传|输出文件夹
   `outputExt` = '.json'|srting|非必传|文件后缀
   `outputFileNamePrefix` = 'result' |string|非必传|输出文件名前缀(最终输出会在前缀后自动加时间戳)

## 翻译脚本使用方法
### v1.0 (已废弃)
### v2.0
- 将翻译稿中B到J列复制, 粘贴到`translateData.txt`,并保存
- `node trans.js` 
- 查看`output/`文件夹中的最新文件, 着重检查`__errors`和`__warnings`
- 修复错误, 并重复上述过程, 直到正确
