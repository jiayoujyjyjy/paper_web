export const publicFun = {
  /**
   * element组件notice通知提示
   */
  // that-vue组件，调用createElement用
  // 不实用，需要传递整个vuecomponent，性能不好
  notificationInfo (that, titlePara, messagePara) {
    console.log(that)
    const h = that.$createElement
    that.$notify({
      title: titlePara,
      message: h('i', {style: 'color: teal'}, `${messagePara}`)
    })
  },
  /**
   * 分页查询请求可选项置空函数
   */
  pageQueSelInit: function () {
    this.param.devId = ''
    this.param.operationType = ''
    this.param.deviceId = ''
    this.param.siteId = ''
    this.param.managerId = ''
    this.param.userId = ''
    this.param.state = ''
    this.param.site = ''
    this.param.id = ''
    this.param.paperId = ''
  }
}
