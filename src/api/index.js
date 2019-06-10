
import axios from 'axios'
import * as url from './urlConfig'

// 对后台进行请求
export const back = {
  // 1用户管理
  // 1.1用户注册
  userRegister (param) {
    return axios({
      url: `${url.backbasurl}/manager/user/register`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        name: param.name,
        mobile: param.mobile,
        password: param.password,
        code: param.code
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.2用户登录，手机登录
  userLogMobile (param) {
    return axios({
      url: `http://yapi.thingcom.com:3000/mock/6/api/v1/manage/user/login`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        mobile: param.mobile,
        password: param.password
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.3用户登录，邮箱登录
  userLogMail (param) {
    return axios({
      url: `${url.backbasurl}/manager/user/login`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: param.email,
        password: param.password
      }
    }
    )
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.4查询用户信息
  userInfoQue (param) {
    return axios({
      url: `${url.backbasurl}/manager/user?userId=${param.userId}`,
      method: 'get',
      headers: {
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
      // withCredentials: true
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.5修改用户基本信息
  userInfoMod (param) {
    return axios({
      url: `${url.backbasurl}/manager/user`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Content-Type': 'application/json',
        'Authorization': param.Authorization
      },
      data: {
        userId: param.userId,
        name: param.name,
        mobile: param.mobile,
        company: param.company,
        email: param.email
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.6修改账号密码
  passwordMod (param) {
    return axios({
      url: `${url.backbasurl}/manager/user/password?oldPass=${param.oldPassword}&newPass=${param.newPassword}`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Content-Type': 'application/json',
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
