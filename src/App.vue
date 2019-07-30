<template>
  <div id="app">
    <div class="index">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  created: function () {
    console.log = function () {

    }
  },
  mounted: function () {
    // console.log = function () {}
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
body, html {
  margin: 0px;
  padding: 0px;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
* {
  padding: 0px;
  margin: 0px;
  /* box-sizing: border-box; */
  list-style: none;
}
/* 统一覆盖样式 */
.index, .el-container {
  height: 100%;
}
/* 覆盖element组件高度：
header 40px;
tabs 继承header100%;
tabs_header margin 0; */
.el-header {
  height: 40px!important;
}
.el-header .el-tabs {
  height: 100%;
}
.el-header .el-tabs .el-tabs__header {
  margin: 0;
}

/* 统一覆盖所有子页面的el-pagination控件样式 */
.el-pagination {
  height: 40px;
  margin: 13px 5px 0 0;
  padding: 0px;
  text-align: right;
  line-height: 40px;
}

.el-dialog .el-dialog__body {
  padding: 20px 20px 15px;
}
.el-dialog .el-form-item {
  margin-bottom: 18px;
}
.el-dialog .el-form-item__content, .el-form-item__label {
  line-height: 32px;
}
.el-dialog .el-input {
  max-width: 200px;
  font-size: 13px;
}
.el-dialog .el-input__inner {
  height: 32px;
  line-height: 32px;
}
</style>
