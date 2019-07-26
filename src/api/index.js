
import axios from 'axios'
import * as url from './urlConfig'

export const back = {
  /*
  ********* 0 公共分类 *********
  */
  // 0.1 枚举查询 test
  queEnum (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/enum/list?type=${param.type}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        // degugger
        // console.log(error)
        return Promise.reject(error) // Promise.reject跳到具体页面api请求.catch()
        // return error // 跳到具体页面api请求.then()
        // 以上: 只有return Promise.reject(error)才会跳到.catch()其他再怎么return都会跳到.then()
      })
  },
  /*
  ********* 1 场地分组模块 *********
  */

  /*
  ********* 2 场地模块 *********
  */
  // 3.1 场地分页查询
  queAreaPage (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/site/page?pageNo=${param.pageNo}&pageSize=${param.pageSize}&groupId=${param.groupId}&name=${param.name}&address=${param.address}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        managerId: param.managerId,
        roleId: param.roleId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        // degugger
        // console.log(error)
        return Promise.reject(error) // Promise.reject跳到具体页面api请求.catch()
        // return error // 跳到具体页面api请求.then()
        // 以上: 只有return Promise.reject(error)才会跳到.catch()其他再怎么return都会跳到.then()
      })
  },
  // 2.2 扫码查询场地
  // 2.3 场地查询
  queArea (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/site/list?groupId=${param.groupId}&name=${param.name}&address=${param.address}`,
      method: 'get',
      headers: {
        managerId: param.managerId,
        roleId: param.roleId
      },
      data: {}
    })
      .then((response) => {
        // degugger
        return response.data // 跳到具体页面api请求.then()
      })
      .catch((error) => {
        // degugger
        // console.log(error)
        return Promise.reject(error) // Promise.reject跳到具体页面api请求.catch()
        // return error // 跳到具体页面api请求.then()
        // 以上: 只有return Promise.reject(error)才会跳到.catch()其他再怎么return都会跳到.then()
      })
  },
  // 2.4 新增场地
  addArea (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/site/add`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
        name: param.name,
        province: param.province,
        city: param.city,
        area: param.area,
        address: param.address,
        type: param.type,
        isDefault: param.isDefault
      }
    })
      .then((response) => {
        // degugger
        return response.data // 跳到具体页面api请求.then()
      })
      .catch((error) => {
        // degugger
        // console.log(error)
        return Promise.reject(error) // Promise.reject跳到具体页面api请求.catch()
        // return error // 跳到具体页面api请求.then()
        // 以上: 只有return Promise.reject(error)才会跳到.catch()其他再怎么return都会跳到.then()
      })
  },
  // 2.5 修改场地
  updateArea (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/site/update`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        id: param.id,
        name: param.name,
        province: param.province,
        city: param.city,
        area: param.area,
        address: param.address,
        type: param.type,
        isDefault: param.isDefault
      }
    })
      .then((response) => {
        // degugger
        return response.data // 跳到具体页面api请求.then()
      })
      .catch((error) => {
        // degugger
        // console.log(error)
        return Promise.reject(error) // Promise.reject跳到具体页面api请求.catch()
        // return error // 跳到具体页面api请求.then()
        // 以上: 只有return Promise.reject(error)才会跳到.catch()其他再怎么return都会跳到.then()
      })
  },
  // 2.6 查看场地详情
  showArea (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/site/show?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        // degugger
        return response.data // 跳到具体页面api请求.then()
      })
      .catch((error) => {
        // degugger
        // console.log(error)
        return Promise.reject(error) // Promise.reject跳到具体页面api请求.catch()
        // return error // 跳到具体页面api请求.then()
        // 以上: 只有return Promise.reject(error)才会跳到.catch()其他再怎么return都会跳到.then()
      })
  },
  // 2.7 删除场地
  delArea (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/site/delete?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        // degugger
        return response.data // 跳到具体页面api请求.then()
      })
      .catch((error) => {
        // degugger
        // console.log(error)
        return Promise.reject(error) // Promise.reject跳到具体页面api请求.catch()
        // return error // 跳到具体页面api请求.then()
        // 以上: 只有return Promise.reject(error)才会跳到.catch()其他再怎么return都会跳到.then()
      })
  },
  /*
  ********* 3 设备模块 *********
  */
  // 3.1 设备分页查询
  queDevPage (param) {
    // degugger
    return axios({
      url: `${url.backbasurl}/api/v1/device/page?pageNo=${param.currentPage}&pageSize=${param.pagesize}&id=${param.id}&state=${param.state}&siteId=${param.siteId}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        managerId: param.managerId,
        roleId: param.roleId
      },
      data: {
      }
    })
      .then((response) => {
        // degugger
        return response.data // 跳到具体页面api请求.then()
      })
      .catch((error) => {
        // degugger
        // console.log(error)
        return Promise.reject(error) // Promise.reject跳到具体页面api请求.catch()
        // return error // 跳到具体页面api请求.then()
        // 以上: 只有return Promise.reject(error)才会跳到.catch()其他再怎么return都会跳到.then()
      })
  },
  // 3.2 设备操作记录分页查询
  queDevOperRecordPage (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/pageOperation?pageNo=${param.currentPage}&pageSize=${param.pagesize}&id=${param.devId}&operationType=${param.operationType}&site=${param.site}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 异常设备分页查询
  devNormal (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/fault?pageNo=${param.pageNo}&pageSize=${param.pageSize}&id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        managerId: param.managerId,
        roleId: param.roleId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 3.3 设备分页查询（小程序）
  // 3.4 修改设备纸巾库存
  updateDevPaper (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/updatePaper`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
        deviceId: param.deviceId,
        paperId: param.paperId,
        num: param.num,
        price: param.price
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 3.5 新增设备
  addDevice (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/add`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
        id: param.deviceId,
        name: param.deviceName,
        siteId: param.siteId
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 3.6 修改设备
  updateDevice (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/update`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
        id: param.deviceId,
        name: param.deviceName,
        siteId: param.siteId
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 3.7 修改设备状态
  updateDevState (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/updateState`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
        id: param.deviceId,
        state: param.deviceState
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 3.8 查看设备详情
  queDevInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/show?id=${param.deviceId}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 3.9 解绑设备
  unbindDev (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/unbind?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 远程启动
  devStartup (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/startup?id=${param.id}&siteId=${param.siteId}&paperId=${param.paperId}&type=${param.type}&num=${param.num}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 设备远程启动记录分页查询
  devStartupPage (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/pageStart?pageNo=${param.pageNo}&pageSize=${param.pageSize}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 库存告警分页查询
  stockAlarm (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/pageAlarm?pageNo=${param.pageNo}&pageSize=${param.pageSize}&id=${param.id}&siteId=${param.siteId}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        managerId: param.managerId,
        roleId: param.roleId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 设备补货记录分页查询
  addLog (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/pageReplenishment?pageNo=${param.pageNo}&pageSize=${param.pageSize}&id=${param.id}&siteId=${param.siteId}&beginDate=${param.beginDate}&endDate=${param.endDate}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        managerId: param.managerId,
        roleId: param.roleId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /*   
  ***********纸巾分类模块*********
  */
  // 纸巾分类查询
  paperType (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/paperType/list?name=${param.name}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 纸巾分类分页查询
  paperTypePage (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/paperType/page?name=${param.name}&pageNo=${param.pageNo}&pageSize=${param.pageSize}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 新增纸巾分类
  addPaperType (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/paperType/add?name=${param.name}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // // 修改纸巾分类
  // changePaperType (param) {
  //   return axios({
  //     url: `${url.backbasurl}/api/v1/paperType/update?name=${param.name}&id=`,
  //     method: 'get',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     data: {
  //     }
  //   })
  //     .then((response) => {
  //       return response.data
  //     })
  //     .catch((error) => {
  //       return Promise.reject(error)
  //     })
  // },
  /*
  ********* 4 纸巾模块 *********
  */
  // 4.1 纸巾分页查询
  quePaperPage (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/paper/page?pageNo=${param.currentPage}&pageSize=${param.pagesize}&name=${param.name}&type=${param.type}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 4.2 纸巾查询
  // quePaperList (param) {
  //   return axios({
  //     url: `${url.backbasurl}/api/v1/paper/lsit`,
  //     method: 'get',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     data: {
  //     }
  //   })
  //     .then((response) => {
  //       return response.data
  //     })
  //     .catch((error) => {
  //       return Promise.reject(error)
  //     })
  // },
  // 4.3 新增纸巾
  addPaper (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/paper/add`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
        name: param.name,
        type: param.type,
        num: param.num,
        price: param.price
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 4.4 修改纸巾
  updatePaper (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/paper/update`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
        id: param.id,
        name: param.name,
        type: param.type,
        num: param.num,
        price: param.price
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 4.5 查看纸巾详情
  quePaperInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/paper/show?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 4.6 删除纸巾
  delPaper (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/paper/delete?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /*
  ********* 5 订单模块 *********
  */
  // 5.1 订单分页查询
  queOrderPage (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/order/page?pageNo=${param.currentPage}&pageSize=${param.pagesize}&deviceId=${param.deviceId}&siteId=${param.siteId}&userId=${param.userId}&state=${param.state}&site=${param.site}&id=${param.id}&paperId=${param.paperId}&beginDate=${param.beginDate}&endDate=${param.endDate}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        managerId: param.managerId,
        roleId: param.roleId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 5.2 修改订单
  updateOrder (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/order/update`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
        id: param.id,
        state: param.state,
        refundReason: param.refundReason
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 5.3 查看订单详情
  queOrderInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/order/show?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /*
  ********* 6 管理员模块 *********
  */
  // 6.1 管理员分页查询
  queManagerPage (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/page?pageNo=${param.currentPage}&pageSize=${param.pagesize}&nickname=${param.nickname}&roleType=${param.roleType}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 6.2 新增管理员
  addManager (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/add`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: param.username,
        nickname: param.nickname,
        phone: param.phone,
        password: param.password,
        roleType: param.roleType
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 6.3 修改管理员
  updateManager (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/update`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        id: param.id,
        username: param.username,
        nickname: param.nickname,
        phone: param.phone,
        password: param.password,
        roleType: param.roleType
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 6.4 查看管理员详情
  queManagerInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/show?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 6.5 删除管理员
  delManager (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/delete?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 6.6 登录管理员
  loginManager (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/login`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: param.username,
        password: param.password
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 6.7 修改账号状态
  updateStatus (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/updateStatus`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        id: param.id,
        isValid: param.isValid
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /*
  ********* 7 统计模块 *********
  */
  // 7.1 控制台统计
  queConsoleStatis (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/statis/console`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 7.2 我的收益
  myIncome (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/statis/myIncome?beginDate=${param.beginDate}&endDate=${param.endDate}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        managerId: param.managerId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 7.3 交易统计
  tradeStatis (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/statis/transaction?pageNo=${param.currentPage}&pageSize=${param.pagesize}&type=${param.type}&queryType=${param.queryType}&beginDate=${param.beginDate}&endDate=${param.endDate}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        managerId: param.managerId,
        roleId: param.roleId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 7.3 设备统计
  queDeviceStatis (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/statis/device?pageNo=${param.currentPage}&pageSize=${param.pagesize}&deviceId=${param.deviceId}&siteId=${param.siteId}&beginDate=${param.beginDate}&endDate=${param.endDate}&queryType=${param.queryType}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        managerId: param.managerId,
        roleId: param.roleId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // 7.3 场地统计
  queSiteStatis (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/statis/site?siteId=${param.siteId}&beginDate=${param.beginDate}&endDate=${param.endDate}&queryType=${param.queryType}&pageNo=${param.pageNo}&pageSize=${param.pageSize}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        managerId: param.managerId,
        roleId: param.roleId
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /*
  ********* x 角色模块 *********
  */
  // x.1 角色分页查询
  queRolePage (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/role/page?pageNo=${param.currentPage}&pageSize=${param.pagesize}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // x.1.1 角色查询
  queRoleList (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/role/list`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // x.2 新增角色
  addRole (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/role/add`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        name: param.name,
        menuIds: param.menuIds
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // x.3 修改角色
  updateRole (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/role/update`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        id: param.id,
        name: param.name,
        menuIds: param.menuIds
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // x.4 查看角色详情
  queRoleInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/role/show?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // x.5 删除角色
  delRole (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/role/delete?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // x.6 菜单查询
  queMenuList (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/menu/list`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /*
  ********* xx 子账号模块 *********
  */
  // xx.1 子账号分页查询
  queChildAccountPage (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/pageSub?pageNo=${param.currentPage}&pageSize=${param.pagesize}&username=${param.username}&nickname=${param.nickname}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // xx.2 新增子账号
  addChildAccount (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/addSub`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: param.username,
        nickname: param.nickname,
        password: param.password,
        roleType: param.roleType,
        siteIds: param.siteIds
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // x.3 修改子账号
  updateChildAccount (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/updateSub`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        id: param.id,
        username: param.username,
        nickname: param.nickname,
        password: param.password,
        roleType: param.roleType,
        siteIds: param.siteIds
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // x.4 查看子账号详情
  queChildAccountInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/showSub?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  // x.5 删除子账号
  delChildAccount (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/deleteSub?id=${param.id}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}
