const publicFun1 = {
  /**
   * element组件notice通知提示
   */
  // that-vue组件，调用createElement用
  notificationInfo (that, titlePara, messagePara) {
    const h = that.$createElement
    console.log(that)
    that.$notify({
      title: titlePara,
      message: h('i', {style: 'color: teal'}, `${messagePara}`)
    })
  }
}

export default publicFun1
