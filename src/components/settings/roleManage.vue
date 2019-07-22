// 10 系统配置 -> 10-1角色管理
<template>
  <div class="userBase">
    <el-header>
      <el-tabs v-model="usermanage_activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first"></el-tab-pane>
          <el-tab-pane label="代理管理" name="first"></el-tab-pane>
          <el-tab-pane label="管理员管理" name="second"></el-tab-pane>
      </el-tabs>
    </el-header>
    <el-container class="userBasemain">
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import Routers from '@/router'
export default {
  name: 'userBase',
  data () {
    return {
      usermanage_activeName: 'first'
    }
  },
  computed: {
  },
  // 生命周期钩子--创建期
  created: function () {
    this.usermanage_activeName = sessionGetStore('usermanage_activeName')
    console.log(this.usermanage_activeName)
  },
  mounted: function () {
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toAgency()
      } else if (tab.index === '1') {
        this.toManager()
      }
    },
    toAgency: function () {
      this.usermanage_activeName = 'first'
      sessionSetStore('usermanage_activeName', this.usermanage_activeName)
      Routers.push({ path: '/home/usermanage/agency' })
    },
    toManager: function () {
      this.usermanage_activeName = 'second'
      sessionSetStore('usermanage_activeName', this.usermanage_activeName)
      Routers.push({ path: '/home/usermanage/manager' })
    }
  }
}
</script>

<style scoped>
.userBase{
  /* overflow: hidden; */
  background-color: #FFFFFD;
}
.userBasemain {
  width: 100%;
  /* padding: 0 20px; */
}
</style>
