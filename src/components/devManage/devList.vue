// 4设备管理 -> 4-1设备列表
<template>
  <div class="devListPage">
    <div class="select">
      <span style="margin: auto 1%">设备编号:</span>
      <el-input v-model="input_devMac" placeholder="请输入设备编号" clearable></el-input>
      <span style="margin: auto 1%">场地:</span>
      <el-select v-model="selected" placeholder="请选择">
        <el-option
          v-for="item in selectData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- <el-input v-model="input_areaName" placeholder="请输入场地名称"></el-input> -->
      <span style="margin: auto 1%">连接状态:</span>
      <el-button type="primary" size="small" plain @click="getAll">全部</el-button>
      <el-button type="primary" size="small" plain @click="getOnline">在线</el-button>
      <el-button type="primary" size="small" plain @click="getOutline">离线</el-button>
      <el-button size="small" type="primary" style="margin-left:10%;" @click="searchDev">搜 索</el-button>
    </div>
    <div class="flexbox">
      <div class="box2">
        <el-button size="small" type="primary" style="margin-left:20px;" @click="upload" v-show="false">导入备注信息</el-button>
        共<p style="font-size:20px;display:inline-block;color: #007aff">{{total}}</p>台设备，在线<p style="font-size:20px;color:#007aff;display:inline-block;">{{online}}</p>台
      </div>
    </div>
    <div class="tableDiv">
      <el-table
        :span-method="objectSpanMethod"
        ref="multipleTable"
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        border
        style="width: 100%;font-size:12px;"
        :max-height="tableMaxHeght">
        <el-table-column
          align="center"
          prop="id"
          label="设备编号">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="设备名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="province"
          label="省份">
        </el-table-column>
        <el-table-column
          align="center"
          prop="city"
          label="地市">
        </el-table-column>
        <el-table-column
          align="center"
          prop="area"
          label="区域">
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="详细地址">
        </el-table-column>
        <el-table-column
          align="center"
          prop="typeName"
          label="场地类型">
        </el-table-column>
        <el-table-column
          align="center"
          prop="state"
          label="状态">
        </el-table-column>
        <el-table-column
          align="center"
          prop="site"
          label="场地">
        </el-table-column>
        <el-table-column
          align="center"
          label="库存">
          <el-table-column align="center" prop="paper" label="纸巾"></el-table-column>
          <el-table-column align="center" prop="num" label="数量"></el-table-column>
          <el-table-column align="center" prop="price" label="单价"></el-table-column>
          <el-table-column
            label="修改"
            align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editKuCun(scope.$index, scope.row)">修改</el-button>
          </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editBt(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="unbind(scope.$index, scope.row)">解绑</el-button>
          </template>
        </el-table-column>
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
          <el-input v-model="editform.deviceId" :disabled="isedit" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="editform.devName" clearable></el-input>
        </el-form-item>
        <!-- 分组这里最终提交的时候要考虑分组是新建的情况 -->
        <el-form-item label="设备转移" v-show="isadd">
          <el-select v-model="editform.formselected" placeholder="请选择">
            <el-option
              v-for="item in formselectData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="库存">
          <el-input v-model="editform.num"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 解绑设备对话框 -->
    <el-dialog
      title="解绑设备"
      :visible.sync="unbindShow"
      width="30%"
      center>
      确定要解绑设备编号为：<span style="font-size: blod; text-color: rgb(231,255,255);">{{unbindId}}</span> 吗？
      <span slot="footer" class="dialog-footer">
        <el-button @click="unbindShow = false">取 消</el-button>
        <el-button type="primary" @click="unbindConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑库存弹窗 -->
    <el-dialog title="编辑库存" :visible.sync="edikucun" width="30%" center>
      <el-form :model="kucun" label-width="100px">
        <el-form-item label="纸巾">
          <el-input v-model="kucun.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="kucun.num" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edikucun = false">取 消</el-button>
        <el-button type="primary" @click="editKuCunConfirm">确 定</el-button>
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
      spanArr: [], // pos是spanArr地索引，用于存放每一行记录的合并数如果是第一条记录（索引为０），向数组中加入１，并设置索引位置；如果不是第一条记录，则判断它与前一条记录是否相等，如果相等，则向spanArr中添入元素０，并将前一位元素＋１，表示合并行数＋１，以此往复，得到所有行的合并数，０即表示该行不显示
      param: {
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8
      },
      selectedValue: [],
      input_devMac: '', // 输入设备编号
      input_areaName: '', // 输入场地名称
      total: 6,
      online: 3,
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      transferDialogVisible: false,
      editDialogTitle: '',
      editDialogVisible: false,
      edikucun: false,
      isedit: true,
      isadd: false,
      unbindShow: false,
      timer: 0,
      locationlist: [],
      grouplist: [],
      selectedSite: [],
      // 设备转移场地
      devSiteOptions: [],
      devDeviceIdList: [],
      formselectData: [],
      // 表格数据
      tableData: [],
      unbindId: '',
      selectData: [
        {
          value: '',
          label: '全部'
        }
      ], // 下拉选择框
      selected: '',
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
        formselected: '',
        state: 0,
        num: '',
        group: '',
        msg: ''
      },
      kucun: [],  // 库存编辑弹窗
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 40 - 55, // ===tableDiv的高度
      screenHeight: document.body.clientHeight, // 监听变化辅助用，一定要设初始值
      onresizeTimer: false // 屏幕高度变化定时器，避免频繁调用window.onresize()方法
    }
  },
  watch: {
    // 监听屏幕高度改变表格高度
    screenHeight (val) {
      /* 触发dom操作，考虑到函数节流，避免window.onresize()方法频繁触发
      强调一点，window.onresize()方法频繁触发也无所谓，前提是在不操作dom的情况下 */
      if (!this.onresizeTimer) {
        this.tableContainerHeightSet()
        this.onresizeTimer = true
        const that = this
        setTimeout(function () {
          that.onresizeTimer = false
        }, 400)
      }
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.managerId = sessionGetStore('managerId')
    this.param.roleId = sessionGetStore('roleId')
    this.param.state = ''
    this.param.siteId = ''
    this.param.id = ''
    this.backQueDevPage()
    this.backQueArea()
  },
  mounted: function () {
    // 表格容器高度初始化
    this.tableContainerHeightSet()
    // 监听屏幕高度
    this.screenOnresizeFun()
  },
  beforeDestroy: function () {
    // 停止定时器
    window.clearInterval(this.timer)
  },
  methods: {
    // 表格容器高度随窗口视口变化函数
    tableContainerHeightSet: function () {
      var windowHeight = $(window).height()
      var mainHeight = windowHeight - 40 - 40 - 40
      $('.tableDiv').height(mainHeight - 40 - 40 - 55)
      this.tableMaxHeght = mainHeight - 40 - 40 - 55
    },
    // 监听屏幕高度
    screenOnresizeFun: function () {
      const that = this
      window.onresize = () => {
        return (() => {
          that.screenHeight = document.body.clientHeight
          console.log('that.screenHeight: ' + that.screenHeight)
        })() // 不加最后()会报错，并没有立即执行,立即执行函数
      }
    },
    // 合并单元格，必须在tableData加载出来之后才能调用
    getSpanArr: function (data) {
      // 清空spanArr的缓存，每次刷新列表时，spanArr总从0开始
      this.spanArr = []
      let contactDot = 0
      this.tableData.forEach((item, index) => {
        item.index = index
        if (index === 0) {
          this.spanArr.push(1)
        } else {
          if (item.id === this.tableData[index - 1].id) {
            this.spanArr[contactDot] += 1
          } else {
            this.spanArr.push(1)
            contactDot = index
          }
        }
      })
    },
    // 合并单元格
    objectSpanMethod: function ({row, column, rowIndex, columnIndex}) {
      // columnIndex表示要合并第几列，从0开始
      for (var i = 0; i < 9; i++) {
        if (columnIndex === i) {
          const _row = this.spanArr[rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      }
      if (columnIndex === 13) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 开启定时器，定时查询设备在线状态
    queryLoop: function () {
      window.clearInterval(this.timer)
      this.timer = window.setInterval(this.backOnlineQue, 3000)
    },
    // 查询全部状态
    getAll: function () {
      this.param.state = ''
      this.backQueDevPage()
    },
    // 查询在线状态
    getOnline: function () {
      this.param.state = 1
      this.backQueDevPage()
    },
    // 查询离线状态
    getOutline: function () {
      this.param.state = 0
      this.backQueDevPage()
    },
    // 根据条件查找设备
    searchDev: function () {
      console.log(this.input_devMac)
      this.param.id = this.input_devMac
      this.param.siteId = this.selected
      this.backQueDevPage()
    },
    // 解绑设备
    unbind: function (index, row) {
      console.log()
      this.param.id = this.tableData[index].id
      this.unbindId = this.tableData[index].id
      this.unbindShow = true
    },
    // 确定解绑设备
    unbindConfirm: function () {
      this.unbindShow = false
      this.backUnbind()
    },
    // 转移设备
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
    // 编辑库存
    editKuCun: function (index, row) {
      this.kucun.name = this.tableData[index].paper
      this.kucun.price = this.tableData[index].price
      this.kucun.num = this.tableData[index].num
      this.kucun.deviceId = this.tableData[index].id
      this.kucun.paperId = this.tableData[index].paperId
      this.edikucun = true
    },
    // 确定编辑库存
    editKuCunConfirm: function () {
      this.edikucun = false
      this.backUpdateDevPaper()
    },
    // 编辑设备按钮
    editBt: function (index, row) {
      this.editDialogTitle = '设备信息'
      this.isedit = true
      this.isadd = true
      this.param.deviceId = this.tableData[index].id
      this.editform.deviceId = this.tableData[index].id
      console.log(this.param.deviceId)
      // 查看设备详情
      this.backQueDevInfo()
      this.editDialogVisible = true
    },
    // 设备场地转移
    siteChangeHandle: function (value) {
      console.log(value)
      console.log(this.selectedSite)
    },
    sendOrder: function (index, row) {
    },
    changeswitch: function (index, row) {
      console.log('开锁控制')
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      // this.tableMaxHeght = document.body.clientHeight - 40 - 20 - 40 - 40 - 40 - 42 - 53 // ===tableDiv的高度
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueDevPage()
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
        this.param.siteId = ''
        // this.param.siteId = this.selectedSite[1]
        console.log(this.deviceId)
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
            for (let j = 0; j < response.data.records[i].paperList.length; j++) {
              let obj = {}
              obj.id = response.data.records[i].id
              obj.name = response.data.records[i].name
              obj.site = response.data.records[i].site
              obj.province = response.data.records[i].province
              obj.city = response.data.records[i].city
              obj.area = response.data.records[i].area
              obj.address = response.data.records[i].address
              obj.typeName = response.data.records[i].typeName
              obj.state = response.data.records[i].state ? '在线' : '离线'
              obj.paper = response.data.records[i].paperList[j].paper
              obj.num = response.data.records[i].paperList[j].num
              obj.price =  response.data.records[i].paperList[j].price
              obj.paperId =  response.data.records[i].paperList[j].paperId
              this.tableData.push(obj)
            }
          }
          // 清空编辑库存表单
          this.kucun = {
            name: null,
            price: null,
            num: null
          }
          console.log(this.tableData)
          this.getSpanArr()
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
        this.editform.formselected = response.data.siteName
        this.formselectData = [] // 初始化
        if (response.data.siteList) {
          for (let i = 0; i < response.data.siteList.length; i++) {
            let obj = {}
            obj.label = response.data.siteList[i].name
            obj.value = response.data.siteList[i].id
            this.formselectData.push(obj)
          }
        }
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
        this.backQueDevPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 解绑设备
    backUnbind: function () {
      sessionSetStore('bacName', '解绑设备')
      back.unbindDev(this.param).then(function (response) {
        if (response.code === 0) {
          this.param.id = ''
          this.backQueDevPage()
        } else {
          this.$message.error('解绑错误')
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 场地查询，用在显示场地搜索中，显示场地编码 siteId=id
    backQueArea: function () {
      let paramObj = {
        managerId: this.param.managerId,
        roleId: this.param.roleId,
        groupId: '',
        name: '',
        address: ''
      }
      sessionSetStore('bacName', '场地查询')
      back.queArea(paramObj).then(function (response) {
        if (response.code === 0) {
          console.log(response.data)
          for (var i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.value = response.data[i].id
            obj.label = response.data[i].name
            this.selectData.push(obj)
          }
          console.log(this.selectData)
        } else {
          this.$message.error('场地获取错误')
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 修改设备纸巾库存
    backUpdateDevPaper: function () {
      let paramObj = {
        deviceId: this.kucun.deviceId,
        paperId: this.kucun.paperId,
        num: this.kucun.num,
        price: Number(this.kucun.price)
      }
      sessionSetStore('bacName', '修改设备纸巾库存')
      console.log(this.param)
      back.updateDevPaper(paramObj).then(function (response) {
        console.log('bianjikucun')
        if (response.code === 0) {
          this.backQueDevPage()
        } else {
          this.$message.error('修改设备纸巾库存')
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
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
.select {
  width: 100%;
  height: 40px;
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
  height: 30px;
  margin: 6px 0;
}
.box2 {
  font-size:15px;
  letter-spacing:3px
}
.box2 p {
  margin-top: 10px;
}
.devListPage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
/* .tableDiv {
  overflow: hidden;
} */
</style>
