# node file操作实例代码
## 作用
node 读取文件-格式化-输出文件
## 做法
三种写法
- 回调函数不断嵌套
- promise写法
- async + await

## 使用方法
- 引入`LineProcessor类`
```
参数
dataFileName, lineHandler, outputDir = './output', outputExt = '.js'
```
- 创建`dealWithLines`函数
  - 输入从文件中读到的行数据
  - 输出需要存到文件中的数字
- 创建实例
- `instance.go()`

```
const LineProcessor = require('./LineProcessor');

// 输入从文件中读到的行数据
// 输出需要存到文件中的数字
const dealWithLines = (lines) => {
  return lines
}

let l = new LineProcessor('input.txt', dealWithLines)

l.go()

```
