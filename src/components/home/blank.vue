<template>
  <div>
    <h3>设备统计、场地统计重置刷新跳转</h3>
  </div>
</template>

<script>
import Routers from '@/router'

export default {
  name: 'blankDiv',
  data () {
    return {
    }
  },
  mounted: function () {
    if (this.$store.state.resetPage === 'device') {
      Routers.push({ path: '/home/device' })
    }
    if (this.$store.state.resetPage === 'place') {
      Routers.push({ path: '/home/place' })
    }
  }
}
</script>

<style scoped>
</style>
