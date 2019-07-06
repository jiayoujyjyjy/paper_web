
import axios from 'axios'
import * as url from './urlConfig'

export const back = {
  /*
  ********* 1 场地分组模块 *********
  */

  /*
  ********* 2 场地模块 *********
  */

  /*
  ********* 3 设备模块 *********
  */
  // 3.1 设备分页查询
  queDevPage (param) {
    // degugger
    return axios({
      url: `${url.backbasurl}/api/v1/device/page?pageNo=${param.currentPage}&pageSize=${param.pagesize}&id=${param.devId}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'managerId': param.managerId
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
      url: `${url.backbasurl}/api/v1/device/unbind?id=${param.deviceId}`,
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
  ********* 4 纸巾模块 *********
  */
  // 4.1 纸巾分页查询
  quePaperPage (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/paper/page?pageNo=${param.currentPage}&pageSize=${param.pagesize}`,
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
  quePaperList (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/paper/lsit`,
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
      url: `${url.backbasurl}/api/v1/order/page?pageNo=${param.currentPage}&pageSize=${param.pagesize}&deviceId=${param.deviceId}&siteId=${param.siteId}&managerId=${param.managerId}&userId=${param.userId}&state=${param.state}&site=${param.site}&id=${param.id}&paperId=${param.paperId}`,
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
  // 7.2 设备统计
  queDeviceStatis (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/statis/device?pageNo=${param.currentPage}&pageSize=${param.pagesize}&deviceId=${param.deviceId}&siteId=${param.siteId}&beginDate=${param.beginDate}&endDate=${param.endDate}&queryType=${param.queryType}`,
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
  // 7.3 场地统计
  queSiteStatis (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/statis/site?pageNo=${param.currentPage}&pageSize=${param.pagesize}&siteId=${param.siteId}&beginDate=${param.beginDate}&endDate=${param.endDate}&queryType=${param.queryType}`,
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
