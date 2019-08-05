/**
 * 工具文件
 * int -> 16进制字符串
 */
export const character = { // export加上可以被外部引用！！！！  暴露
/**
 * 数据转换
 * int -> 16进制的2字符字符串
 */
  intTostring2 (num) {
    let x = Number(num).toString(16)
    if (x.length === 1) {
      return '0' + x
    } else if (x.length === 2) {
      return x
    } else if (x.length > 2) {
      return x.substring(x.length - 2, x.length)
    }
  },
  /**
 * 数据转换
 * int -> 16进制的4字符字符串
 */
  intTostring4 (num) {
    let x = Number(num).toString(16)
    if (x.length === 1) {
      return '000' + x
    } else if (x.length === 2) {
      return '00' + x
    } else if (x.length === 3) {
      return '0' + x
    } else if (x.length === 4) {
      return x
    } else if (x.length > 4) {
      return x.substring(x.length - 4, x.length)
    }
  },
  /**
 * randomWord 产生任意长度随机字母数字组合
 * randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 * 用法  randomWord(false,6);规定位数 flash
 *      randomWord(true,3，6);长度不定，true
 * arr变量可以把其他字符加入，如以后需要小写字母，直接加入即可
 */
  randomWord (randomFlag, min, max) {
    let str = ''
    let range = min
    let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    // 随机产生
    if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min
    }
    for (let i = 0; i < range; i++) {
      let pos = Math.round(Math.random() * (arr.length - 1))
      str += arr[pos]
    }
    return str
  },
  /**
 * 获取当前时间 格式：yyyyMMddHHMMSS
 */
  getCurrentTime (interval) {
    var date = new Date()
    console.log(date)
    date = +date - interval
    console.log(date)
    date = new Date(date)
    var month = this.zeroFill(date.getMonth() + 1) // 月
    var day = this.zeroFill(date.getDate()) // 日
    var hour = this.zeroFill(date.getHours()) // 时
    var minute = this.zeroFill(date.getMinutes()) // 分
    var second = this.zeroFill(date.getSeconds()) // 秒
    // 当前时间
    var curTime = date.getFullYear() + '-' + month + '-' + day +
            ' ' + hour + ':' + minute + ':' + second
    return curTime
  },
  // 昨日
  getDayTime () {
    var day = new Date()
    day.setDate(day.getDate() - 1)
    return day
  },
  // 本周
  getWeek () {
    var day = new Date()
    var num = day.getDay() - 1
    day.setDate(day.getDate() - num)
    day.setDate(day.getDate() + 6)
    return day
  },
  // 本月
  getMonth () {
    
  },
  /**
  * 补零
  */
  zeroFill (i) {
    if (i >= 0 && i <= 9) {
      return '0' + i
    } else {
      return i
    }
  }
}
