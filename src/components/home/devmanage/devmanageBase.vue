<template>
  <div class="devmanageBase">
    <el-header>
      <el-tabs v-model="devmanage_activeName" @tab-click="handleClick">
          <el-tab-pane label="设备列表" name="first"></el-tab-pane>
          <el-tab-pane label="设备转移记录" name="second"></el-tab-pane>
      </el-tabs>
    </el-header>
    <el-container class="devmanageBasemain">
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import Routers from '@/router'
export default {
  name: 'devmanageBase',
  data () {
    return {
      devmanage_activeName: 'first'
    }
  },
  computed: {
  },
  // 生命周期钩子--创建期
  created: function () {
    this.devmanage_activeName = sessionGetStore('devmanage_activeName')
    console.log(this.devmanage_activeName)
  },
  mounted: function () {
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toDevList()
      } else if (tab.index === '1') {
        this.toDevTransferRecord()
      }
    },
    toDevList: function () {
      this.devmanage_activeName = 'first'
      sessionSetStore('devmanage_activeName', this.devmanage_activeName)
      Routers.push({ path: '/home/devmanage/devList' })
    },
    toDevTransferRecord: function () {
      this.devmanage_activeName = 'second'
      sessionSetStore('devmanage_activeName', this.devmanage_activeName)
      Routers.push({ path: '/home/devmanage/devTransferRecord' })
    }
  }
}
</script>

<style scoped>
.devmanageBase{
  /* overflow: hidden; */
  background-color: #FFFFFD;
}
.devmanageBasemain {
  width: 100%;
  /* padding: 0 20px; */
}
</style>
