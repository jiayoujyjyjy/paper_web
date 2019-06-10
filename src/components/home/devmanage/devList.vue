<template>
  <div class="devListPage">
    <div class="select">
      <el-select v-model="selectedValue" multiple placeholder="请选择需要查询的设备编号">
        <el-option
          v-for="item in devDeviceIdList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" style="margin-left:20px;" @click="searchDev">搜索</el-button>
    </div>
    <div class="flexbox">
      <div>勾选操作：
        <el-button size="small" type="primary" @click="unbind">批量解绑</el-button>
        <el-button size="small" type="primary" style="margin-left:20px;" @click="transfer">设备转移</el-button>
        <el-button size="small" type="primary" style="margin-left:20px;" @click="addBt">设备添加</el-button>
      </div>
      <div class="box2">
        <el-button size="small" type="primary" style="margin-left:20px;" @click="upload" v-show="false">导入备注信息</el-button>
        共<p style="font-size:20px;display:inline-block;color: #007aff">{{total}}</p>台设备，在线<p style="font-size:20px;color:#007aff;display:inline-block;">{{online}}</p>台
      </div>
    </div>
    <div class="tablediv">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        border
        style="width: 100%;font-size:12px;"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          min-width="10%">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="10%">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="editBt(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceId"
          label="设备编号"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="msg"
          label="备注"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="state"
          label="状态"
          min-width="10%"
          :filters="filter_state"
          :filter-method="filterState">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.state === '在线' ? 'success' : 'danger'"
              disable-transitions>{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="location"
          label="场地"
          min-width="20%"
          :filters="filter_Location"
          :filter-method="filterLoca">
        </el-table-column>
        <el-table-column
          align="center"
          label="开锁控制"
          min-width="10%">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.unlock"
              @change="changeswitch(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      @current-change="handlePaginationChange"
      :current-page="currentPage"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="eltotal">
    </el-pagination>

    <!-- 转移设备对话框 -->
    <el-dialog
      title="转移设备"
      :visible.sync="transferDialogVisible"
      width="24%"
      center>
      <el-form :model="transferform" label-width="100px">
        <el-form-item label="设备编号">
          {{transferform.deviceId}}
        </el-form-item>
        <el-form-item label="现投放地址">
          {{transferform.beforeLoca}}
        </el-form-item>
        <el-form-item label="转移地址">
          <el-autocomplete
            class="inline-input"
            suffix-icon="el-icon-arrow-down"
            v-model="transferform.afterLoca"
            :fetch-suggestions="querySearch"
            placeholder="请输入或选择">
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="transferDiaConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加/编辑设备对话框 -->
    <el-dialog
      :title="editDialogTitle"
      :visible.sync="editDialogVisible"
      width="30%"
      center>
      <el-form :model="editform" label-width="100px">
        <el-form-item label="设备编号">
          <el-input v-model="editform.deviceId" :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="投放地址">
          <el-input v-model="editform.location" :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="地址详情">
          <el-input v-model="editform.locaDetail" :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="状态"  v-show="isedit">
          <el-input v-model="editform.state" disabled></el-input>
        </el-form-item>
        <!-- 分组这里最终提交的时候要考虑分组是新建的情况 -->
        <el-form-item label="分组" v-show="isadd">
          <el-autocomplete
            class="inline-input"
            suffix-icon="el-icon-arrow-down"
            v-model="editform.group"
            :fetch-suggestions="querySearchGroup"
            placeholder="请选择或输入新建分组"
            >
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="2"
            :maxlength="20"
            placeholder="请输入备注内容，不超过20个字"
            v-model="editform.msg">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
    return {
      selectedValue: [],
      total: 6,
      online: 3,
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      transferDialogVisible: false,
      editDialogTitle: '',
      editDialogVisible: false,
      isedit: true,
      isadd: false,
      timer: 0,
      locationlist: [{
        value: '江泰国际广场1楼'
      }, {
        value: '江泰国际广场2楼'
      }, {
        value: '江泰国际广场3楼'
      }, {
        value: '江泰国际广场4楼'
      }],
      grouplist: [{
        value: '江泰国际广场'
      }, {
        value: '丽水金汇广场'
      }],
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
        msg: '备注',
        state: '在线',
        location: '江泰国际广场2楼',
        unlock: true,
        locaDetail: '',
        group: ''
      }, {
        deviceId: '139761',
        msg: '备注',
        state: '离线',
        location: '江泰国际广场3楼',
        unlock: false,
        locaDetail: '',
        group: ''
      }, {
        deviceId: '139761',
        msg: '备注',
        state: '在线',
        location: '江泰国际广场2楼',
        unlock: true,
        locaDetail: '',
        group: ''
      }, {
        deviceId: '139761',
        msg: '备注',
        state: '在线',
        location: '江泰国际广场3楼',
        unlock: true,
        locaDetail: '',
        group: ''
      }],
      multipleSelection: [],
      filter_Location: [{
        text: '江泰国际广场2楼',
        value: '江泰国际广场2楼'
      }, {
        text: '江泰国际广场3楼',
        value: '江泰国际广场3楼'
      }],
      filter_state: [{
        text: '在线',
        value: '在线'
      }, {
        text: '离线',
        value: '离线'
      }],
      transferform: {
        deviceId: '139761',
        beforeLoca: '',
        afterLoca: ''
      },
      editform: {
        deviceId: '',
        location: '',
        locaDetail: '',
        state: 0,
        group: '',
        msg: ''
      }
    }
  },
  mounted: function () {
    var windowHeight = $(window).height()
    $('.tablediv').height(windowHeight - 360)
  },
  beforeDestroy: function () {
    // 停止定时器
    window.clearInterval(this.timer)
  },
  methods: {
    // 开启定时器，定时查询设备在线状态
    queryLoop: function () {
      window.clearInterval(this.timer)
      this.timer = window.setInterval(this.backOnlineQue, 3000)
    },
    searchDev: function () {
      console.log(this.selectedValue)
    },
    // 解绑设备
    unbind: function () {
      if (this.multipleSelection.length !== 0) {
        this.$confirm('您确定解绑这些设备吗?', '批量解绑', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.backUnbind()
        }).catch(() => {
        })
      } else {
        this.$message.error('请至少选择一个设备')
      }
    },
    transfer: function () {
      if (this.multipleSelection.length === 1) {
        this.transferform.beforeLoca = this.multipleSelection[0].location
        this.transferDialogVisible = true
      } else if (this.multipleSelection.length === 0) {
        this.$message.error('请至少选择一个设备')
      } else {
        this.$message.error('一次只能选择一个设备')
      }
    },
    upload: function () {
    },
    // 编辑设备按钮
    editBt: function (index, row) {
      this.editDialogTitle = '设备信息'
      this.isedit = true
      this.isadd = false
      this.editform = {
        deviceId: this.tableData[index].deviceId,
        location: this.tableData[index].location,
        locaDetail: this.tableData[index].locaDetail,
        state: this.tableData[index].state,
        group: '',
        msg: this.tableData[index].msg
      }
      this.editDialogVisible = true
    },
    // 新增设备按钮
    addBt: function () {
      this.editDialogTitle = '新增设备'
      this.isedit = false
      this.isadd = true
      this.editform = {
        deviceId: '',
        location: '',
        locaDetail: '',
        state: 0,
        group: '',
        msg: ''
      }
      this.editDialogVisible = true
    },
    sendOrder: function (index, row) {
    },
    changeswitch: function (index, row) {
      console.log('开锁控制')
    },
    handlePaginationChange: function (value) {
      console.log(value)
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    filterLoca: function (value, row) {
      return row.location === value
    },
    filterState: function (value, row) {
      return row.state === value
    },
    // 设备转移对话框自动填充
    querySearch: function (queryString, cb) {
      var locationlist = this.locationlist
      var results = queryString ? locationlist.filter(this.createFilter(queryString)) : locationlist
      cb(results)
    },
    createFilter: function (queryString) {
      return (locationlist) => {
        return (locationlist.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 设备新增对话框自动填充
    querySearchGroup: function (queryString, cb) {
      var grouplist = this.grouplist
      var results = queryString ? grouplist.filter(this.createFilterGroup(queryString)) : grouplist
      cb(results)
    },
    createFilterGroup: function (queryString) {
      return (grouplist) => {
        return (grouplist.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 对话框操作
    transferDiaConfirm: function () {
      console.log(this.transferform)
      console.log('确认转移')
    },
    // 添加/编辑对话框确认操作
    editDialogConfirm: function () {
      if (this.editDialogTitle === '新增设备') {
        console.log('新增设备')
        console.log(this.editform)
      } else {
        console.log('设备信息')
        console.log(this.editform)
      }
    },
    //
    // *******************   API调用   *********************
    //
    backDevlistQue: function () {
      // this.queryLoop()
    },
    backUnbind: function () {
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    // 查询设备在线状态
    backOnlineQue: function () {
    }
  }
}
</script>

<style scoped>
.devListPage {
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
.tablediv {
  overflow: auto;
}
.flexbox {
  margin: 20px 0 0 0;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.box2 {
  font-size:15px;
  letter-spacing:3px
}
.el-pagination {
  margin: 20px 20px 0 0;
  float: right;
}
.devListPage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
