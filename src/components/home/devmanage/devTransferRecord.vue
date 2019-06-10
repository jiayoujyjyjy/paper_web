<template>
  <div class="devTransferRecordPage">
    <div class="select">
      <el-select v-model="selectedValue" placeholder="请选择需要查询的设备编号" @change="searchDev">
        <el-option
          v-for="item in devDeviceIdList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-table
      :header-cell-style="{'font-size':'14px'}"
      :data="tableData"
      border
      style="width: 100%;font-size:12px;">
      <el-table-column
        align="center"
        prop="deviceId"
        label="设备编号"
        min-width="20%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="date"
        label="转移时间"
        min-width="20%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="beforeloca"
        label="原投放地址"
        min-width="30%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="afterloca"
        label="转移投放地址"
        min-width="30%">
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handlePaginationChange"
      :current-page="currentPage"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="eltotal">
    </el-pagination>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
    return {
      selectedValue: '',
      total: 6,
      online: 3,
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      devDeviceIdList: [{
        value: '139761',
        label: '139761'
      }, {
        value: '139762',
        label: '139762'
      }, {
        value: '139763',
        label: '139763'
      }, {
        value: '139764',
        label: '139764'
      }, {
        value: '139765',
        label: '139765'
      }, {
        value: '139766',
        label: '139766'
      }],
      // 表格数据
      tableData: [{
        deviceId: '139761',
        date: '2017-11-25 16:27:08',
        beforeloca: '江泰国际广场4楼',
        afterloca: '江泰国际广场2楼'
      }]
    }
  },
  mounted: function () {
    var windowHeight = $(window).height()
    $('.el-table').height(windowHeight - 280)
  },
  methods: {
    searchDev: function (val) {
      console.log(val)
    },
    handlePaginationChange: function (value) {
      console.log(value)
    }
  }
}
</script>

<style scoped>
.devTransferRecordPage {
  width: 100%;
}
.select {
  width: 100%;
  height: auto;
  text-align: left;
}
.el-select >>> .el-input {
  font-size: 12px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin: 20px 20px 0 0;
  float: right;
}
</style>
