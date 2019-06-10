<template>
  <div class="productmanagePage">
    <div class="flexbox">
      <div class="box">
        <div>投放地址
          <el-autocomplete
            class="inline-input"
            suffix-icon="el-icon-arrow-down"
            v-model="selection.location"
            :fetch-suggestions="querySearch_Loca"
            placeholder="请输入或选择投放地址">
          </el-autocomplete>
        </div>
        <div style="margin: 0 20px;">设备编码
          <el-autocomplete
            class="inline-input"
            suffix-icon="el-icon-arrow-down"
            v-model="selection.deviceId"
            :fetch-suggestions="querySearch_DevId"
            placeholder="请输入或选择编号">
          </el-autocomplete>
        </div>
        <el-button type="primary" size="small" @click="searchBt">搜索</el-button>
      </div>
      <div class="box">
        <el-button type="primary" size="small" @click="addBt">新增</el-button>
        <el-button size="small" type="primary" style="margin-left:20px;" @click="delBt">删除</el-button>
      </div>
    </div>
    <el-table
      :header-cell-style="{'font-size':'14px'}"
      :data="tableData"
      stripe
      border
      style="width: 100%;font-size:12px;"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        min-width="10%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="deviceId"
        label="设备编码"
        min-width="10%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="location"
        label="投放地址"
        min-width="20%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="productName"
        label="产品名称"
        min-width="20%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="price"
        label="单价"
        min-width="10%">
      </el-table-column>
      <el-table-column
        align="center"
        prop="stock"
        label="当前库存"
        min-width="10%">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="20%">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showRecordBt(scope.$index, scope.row)">查看操作记录</el-button>
          <el-button type="text" size="small" @click="editBt(scope.$index, scope.row)">编辑</el-button>
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

    <!--新增/编辑对话框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditVisible"
      width="20%"
      center>
      <el-form :model="editform" label-width="100px">
        <el-form-item label="设备编码">
          <el-input v-model="editform.deviceId"  :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="投放地址">
          <el-input v-model="editform.location"  :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="editform.productName"  :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input type="number" v-model="editform.price"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="editform.stock"  label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>

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
      dialogEditVisible: false,
      dialogTitle: '',
      multipleSelection: [],
      isedit: false,
      selection: {
        location: '',
        deviceId: ''
      },
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
      editform: {
        deviceId: '139761',
        location: '江泰国际广场1楼',
        productName: '纸巾',
        price: 0.5,
        stock: 20
      },
      tableData: [{
        deviceId: '139761',
        location: '江泰国际广场1楼',
        productName: '纸巾',
        price: 0.5,
        stock: 20
      }, {
        deviceId: '139761',
        location: '江泰国际广场1楼',
        productName: '湿巾',
        price: 1,
        stock: 20
      }, {
        deviceId: '139762',
        location: '江泰国际广场2楼',
        productName: '纸巾',
        price: 0.5,
        stock: 20
      }, {
        deviceId: '139762',
        location: '江泰国际广场2楼',
        productName: '湿巾',
        price: 1,
        stock: 20
      }]
    }
  },
  mounted: function () {
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 120
    $('.productmanagePage').height(mainHeight)
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
    // 编辑产品信息按钮
    editBt: function (index, row) {
      this.dialogTitle = '编辑'
      this.isedit = true
      this.editform = {
        deviceId: this.tableData[index].deviceId,
        location: this.tableData[index].location,
        productName: this.tableData[index].productName,
        price: this.tableData[index].price,
        stock: this.tableData[index].stock
      }
      this.dialogEditVisible = true
    },
    // 新增产品按钮
    addBt: function () {
      this.dialogTitle = '新增'
      this.isedit = false
      this.editform = {
        deviceId: '',
        location: '',
        productName: '',
        price: 0,
        stock: 0
      }
      this.dialogEditVisible = true
    },
    // 对话框修改确认
    editConfirm: function () {
      console.log(this.editform)
      if (this.dialogTitle === '新增') {
        console.log('新增')
      } else {
        console.log('修改')
      }
    },
    // 查看操作记录，库存增减记录
    showRecordBt: function () {
      console.log('查看操作记录')
    },
    // 删除产品对话框
    delBt: function () {
      if (this.multipleSelection.length !== 0) {
        this.$confirm('您确定删除所选产品信息吗?', '删除产品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.backDel()
        }).catch(() => {
        })
      } else {
        this.$message.error('请至少选择一个条目')
      }
    },
    // 搜索按钮
    searchBt: function () {
      console.log(this.selection)
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
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
.productmanagePage {
  padding: 20px;
  background-color: white;
}
.el-pagination {
  margin: 20px 20px 0 0;
  float: right;
}
.flexbox {
  margin: 20px 0 20px 0;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.productmanagePage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
