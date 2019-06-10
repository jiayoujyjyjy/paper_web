<template>
  <div class="ordermanagePage">
    <div class="flexbox">
      <div class="box">
        <span style="width:120px;margin-top:6px">支付用户编号</span>
        <el-input size="small" v-model="selection.userId" placeholder="请输入用户ID号"></el-input>
      </div>
      <div class="box">
        <span style="width:60px;margin-top:6px">订单号</span>
        <el-input size="small" v-model="selection.tradId" placeholder="请输入交易/商户订单号"></el-input>
      </div>
      <div>交易状态
        <el-select size="small" v-model="selection.tradState">
          <el-option
            v-for="item in tradStateOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="margin: 0 20px;">设备编码
        <el-autocomplete
          size="small"
          class="inline-input"
          suffix-icon="el-icon-arrow-down"
          v-model="selection.deviceId"
          :fetch-suggestions="querySearch_DevId"
          placeholder="请输入或选择编号">
        </el-autocomplete>
      </div>
      <div>场地
        <el-autocomplete
          size="small"
          class="inline-input"
          suffix-icon="el-icon-arrow-down"
          v-model="selection.location"
          :fetch-suggestions="querySearch_Loca"
          placeholder="请输入或选择场地">
        </el-autocomplete>
      </div>
      <el-button type="primary" size="small" @click="searchBt">查询</el-button>
    </div>
    <el-table
      :header-cell-style="{'font-size':'12px'}"
      :data="tableData"
      stripe
      border
      style="width: 100%;font-size:12px;">
      <el-table-column
        align="center"
        prop="tradDate"
        label="交易时间">
      </el-table-column>
      <el-table-column
        align="center"
        prop="tradId"
        label="交易单号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="merchantId"
        label="商户单号">
      </el-table-column>
      <el-table-column
        align="center"
        prop="tradState"
        label="交易状态">
      </el-table-column>
      <el-table-column
        align="center"
        prop="refundReason"
        label="退款原因">
      </el-table-column>
      <el-table-column
        align="center"
        prop="location"
        label="场地">
      </el-table-column>
      <el-table-column
        align="center"
        prop="deviceId"
        label="设备编码">
      </el-table-column>
      <el-table-column
        align="center"
        prop="amount"
        label="订单金额">
      </el-table-column>
      <el-table-column
        align="center"
        prop="userId"
        label="支付用户编号">
      </el-table-column>
      <el-table-column
        label="详情"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailBt(scope.$index, scope.row)">查看</el-button>
        </template>
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
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      locationlist: [{
        value: '江泰国际广场1楼'
      }, {
        value: '江泰国际广场2楼'
      }, {
        value: '江泰国际广场3楼'
      }, {
        value: '江泰国际广场4楼'
      }],
      devIdlist: [{
        value: '139761'
      }, {
        value: '139762'
      }, {
        value: '139763'
      }, {
        value: '139764'
      }],
      tableData: [{
        tradDate: '',
        tradId: '',
        merchantId: '',
        tradState: '',
        refundReason: '',
        deviceId: '',
        location: '',
        amount: 2,
        userId: ''
      }],
      tradStateOpts: [{
        value: '全部',
        label: '全部'
      }, {
        value: '交易成功',
        label: '交易成功'
      }, {
        value: '全额退款',
        label: '全额退款'
      }],
      selection: {
        userId: '',
        tradId: '',
        tradState: '全部',
        deviceId: '',
        location: ''
      }
    }
  },
  mounted: function () {
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 120
    $('.ordermanagePage').height(mainHeight)
    $('.el-table').height(mainHeight - 120)
  },
  methods: {
    // 选择投放地址自动完成
    querySearch_Loca: function (queryString, cb) {
      var locationlist = this.locationlist
      var results = queryString ? locationlist.filter(this.createFilter_Loca(queryString)) : locationlist
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter_Loca: function (queryString) {
      return (locationlist) => {
        return (locationlist.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 选择设备编码自动完成
    querySearch_DevId: function (queryString, cb) {
      var devIdlist = this.devIdlist
      var results = queryString ? devIdlist.filter(this.createFilter_DevId(queryString)) : devIdlist
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter_DevId: function (queryString) {
      return (devIdlist) => {
        return (devIdlist.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    detailBt: function () {
      console.log('订单详情')
    },
    // 搜索按钮
    searchBt: function () {
      console.log(this.selection)
    },
    handlePaginationChange: function (value) {
      console.log(value)
    },
    //
    // *******************   API调用   *********************
    //
    backDel: function () {
      console.log('删除产品')
    }
  }
}
</script>

<style scoped>
.ordermanagePage {
  padding: 20px;
  background-color: white;
  font-size: 14px;
}
.el-pagination {
  margin: 20px 20px 0 0;
  float: right;
}
.flexbox {
  margin: 20px 80px 20px 0;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
}
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width:auto;
}
.ordermanagePage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
