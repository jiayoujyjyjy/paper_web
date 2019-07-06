<template>
  <div class="devListPage">
    <div class="select">
      <el-input v-model="input_devMac" placeholder="请输入设备编号" @keyup.enter.native="searchDev"></el-input>
      <el-button size="small" type="primary" style="margin-left:20px;" @click="searchDev">搜索</el-button>
    </div>
    <div class="flexbox">
      <div class="box2">
        <el-button size="small" type="primary" style="margin-left:20px;" @click="upload" v-show="false">导入备注信息</el-button>
        共<p style="font-size:20px;display:inline-block;color: #007aff">{{total}}</p>台设备，在线<p style="font-size:20px;color:#007aff;display:inline-block;">{{online}}</p>台
      </div>
    </div>
    <div class="tableDiv">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        border
        style="width: 100%;font-size:12px;"
        @selection-change="handleSelectionChange">
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
          prop="devName"
          label="设备名称"
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
          min-width="20%">
        </el-table-column>
        <!-- <el-table-column
          align="center"
          label="开锁控制"
          min-width="10%">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.unlock"
              @change="changeswitch(scope.$index, scope.row)">
            </el-switch>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <el-pagination
      @current-change="handlePaginationChange"
      :current-page="param.currentPage"
      :page-size="param.pagesize"
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
        <el-form-item label="设备名称">
          <el-input v-model="editform.devName"></el-input>
        </el-form-item>
        <!-- 分组这里最终提交的时候要考虑分组是新建的情况 -->
        <el-form-item label="设备转移" v-show="isadd">
          <el-cascader
            :options="devSiteOptions"
            v-model="selectedSite"
            @change="siteChangeHandle">
          </el-cascader>
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
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import $ from 'jquery'
export default {
  data () {
    return {
      param: {
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8
      },
      selectedValue: [],
      input_devMac: '', // 输入设备编号
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
      selectedSite: [],
      // 设备转移场地
      devSiteOptions: [{
        label: '孵化器',
        value: 'fuhuaqi',
        children: [{
          label: '1幢',
          value: 'buildingOne'
        }, {
          label: '2幢',
          value: 'buildingTwo'
        }]
      }, {
        label: '杭电',
        value: 'hdu',
        children: [{
          label: '11号楼',
          value: '11lou'
        }, {
          label: '22号楼',
          value: '22lou'
        }]
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
        devName: '名称1',
        state: '在线',
        location: '江泰国际广场2楼',
        unlock: true,
        locaDetail: '',
        group: ''
      }, {
        deviceId: '139761',
        devName: '名称2',
        state: '离线',
        location: '江泰国际广场3楼',
        unlock: false,
        locaDetail: '',
        group: ''
      }, {
        deviceId: '139761',
        devName: '名称5',
        state: '在线',
        location: '江泰国际广场2楼',
        unlock: true,
        locaDetail: '',
        group: ''
      }, {
        deviceId: '139761',
        devName: '名称4',
        state: '在线',
        location: '江泰国际广场3楼',
        unlock: true,
        locaDetail: '',
        group: ''
      }],
      multipleSelection: [],
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
        devName: '名称1',
        state: 0,
        group: '',
        msg: ''
      }
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.managerId = sessionGetStore('managerId')
    this.param.devId = ''
    this.backQueDevPage()
  },
  mounted: function () {
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 60 - 20 - 40 - 20 - 40
    $('.devListPage').height(mainHeight)
    $('.tableDiv').height(mainHeight - 32 - 40 - 32 - 20 - 50 + 40)
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
    // 根据设备编号查找
    searchDev: function () {
      console.log(this.input_devMac)
      this.param.devId = this.input_devMac
      this.backQueDevPage()
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
      this.isadd = true
      this.param.deviceId = this.tableData[index].deviceId
      // 查看设备详情
      this.backQueDevInfo()
      // this.editform = {
      //   deviceId: this.tableData[index].deviceId,
      //   devName: this.tableData[index].devName
      // }
      this.editDialogVisible = true
    },
    // 设备场地转移
    siteChangeHandle: function (value) {
      console.log(value)
      console.log(this.selectedSite)
    },
    // // 新增设备按钮
    // addBt: function () {
    //   this.editDialogTitle = '新增设备'
    //   this.isedit = false
    //   this.isadd = true
    //   this.editform = {
    //     deviceId: '',
    //     location: '',
    //     locaDetail: '',
    //     state: 0,
    //     group: '',
    //     msg: ''
    //   }
    //   this.editDialogVisible = true
    // },
    sendOrder: function (index, row) {
    },
    changeswitch: function (index, row) {
      console.log('开锁控制')
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueDevPage()
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
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
        // 1.新增设备
        console.log('新增设备')
        console.log(this.editform)
      } else {
        // 2.更改设备
        console.log('设备信息')
        console.log(this.editform)
        this.param.deviceId = this.editform.deviceId
        this.param.deviceName = this.editform.devName
        this.param.siteId = this.selectedSite[1]
        this.backUpdateDevice()
        this.editDialogVisible = false
      }
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 设备分页查询
    backQueDevPage: function () {
      // degugger
      sessionSetStore('backName', '设备分页查询')
      back.queDevPage(this.param).then(function (response) {
        console.log(response)
        this.total = response.sumNum
        this.online = response.onlineNum
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.deviceId = response.data.records[i].id
            obj.devName = response.data.records[i].name
            obj.location = response.data.records[i].site
            obj.stateNum = response.data.records[i].state
            if (obj.stateNum === 0) {
              obj.state = '离线'
            } else if (obj.stateNum === 1) {
              obj.state = '在线'
            }
            this.tableData.push(obj)
          }
        } else {
          this.tableData = []
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 查看设备详情
    backQueDevInfo: function () {
      sessionSetStore('backName', '查看设备详情')
      back.queDevInfo(this.param).then(function (response) {
        console.log(response)
        this.editform.deviceId = response.data.id
        this.editform.devName = response.data.name
        let groupList = []
        this.devSiteOptions = [] // 初始化
        if (response.data.groupList) {
          for (let i = 0; i < response.data.groupList.length; i++) {
            let groupObj = {}
            groupObj.value = response.data.groupList[i].id
            groupObj.label = response.data.groupList[i].name
            let siteList = []
            if (response.data.groupList[i].siteList === undefined) {
              siteList[0] = {}
              groupObj.children = siteList
              groupList[i] = groupObj
              continue
            }
            for (let j = 0; j < response.data.groupList[i].siteList.length; j++) {
              let siteObj = {}
              siteObj.value = response.data.groupList[i].siteList[j].id
              siteObj.label = response.data.groupList[i].siteList[j].name
              siteList[j] = siteObj
            }
            groupObj.children = siteList
            groupList[i] = groupObj
          }
        }
        this.devSiteOptions = groupList
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 修改设备
    backUpdateDevice: function () {
      sessionSetStore('backName', '修改设备')
      back.updateDevice(this.param).then(function (response) {
        console.log(response)
        this.param.devId = ''
        this.backQueDevPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    backUnbind: function () {
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    },
    // 查询设备在线状态
    backOnlineQue: function () {
    },
    //
    // *******************   辅助函数   *********************
    //
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.devId = ''
      this.param.deviceId = ''
      this.param.siteId = ''
      this.param.managerId = ''
      this.param.userId = ''
      this.param.state = ''
      this.param.site = ''
      this.param.id = ''
      this.param.paperId = ''
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

<style scoped>
.devListPage {
  padding: 20px;
  background-color: white;
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
.select .el-input {
  width: 230px;
  margin-right: 5px;
}
.flexbox {
  /* margin: 20px 0 0 0; */
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
