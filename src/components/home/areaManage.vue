// 场地管理  ->>> 场地列表
<template>
  <div class="areaManagePage">
    <div class="select">
      <!-- 模糊搜索 -->
      <span style="width:80px;margin-top:6px">场地名称</span>
      <el-input size="small" v-model="selection.name" placeholder="请输入或选择场地名称"></el-input>
      <span style="width:80px;margin-top:6px">详细地址</span>
      <el-input size="small" v-model="selection.address" placeholder="请输入或选择详细地址"></el-input>
      <el-button type="primary" size="small" @click="searchBt">搜索</el-button>
      <el-button type="primary" size="small" @click="addBt">添加场地</el-button>
    </div>
    <div class="tableDiv" style="margin-top: 20px;">
      <el-table
        :header-cell-style="{'font-size':'12px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="font-size:12px;">
        <el-table-column
          align="center"
          prop="id"
          label="场地编码"
          min-width="100%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="场地名称">
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="详细地址">
        </el-table-column>
        <el-table-column
          align="center"
          prop="isDefault"
          label="默认地址">
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceNum"
          label="设备数量">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detailBt(scope.$index, scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="updateBt(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="delBt(scope.$index, scope.row)">删除</el-button>
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

    <!--修改/添加对话框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditVisible"
      :before-close="handleClose"
      width="50%"
      center>
      <!-- 当点击详情时，:disabled=true；其他为false (true为禁用）-->
      <el-form :model="detailForm" label-width="100px">
        <el-form-item label="场地编码" v-show="editShow">
          <el-input v-model="detailForm.id" placeholder="请填写场地编码" :disabled="unchange"></el-input>
        </el-form-item>
        <el-form-item label="场地名称">
          <el-input v-model="detailForm.name" placeholder="请填写场地名称" :disabled="unchange"></el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="detailForm.province" placeholder="请填写省份" :disabled="unchange"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="detailForm.city" placeholder="请填写城市" :disabled="unchange"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="detailForm.area" placeholder="请填写地区" :disabled="unchange"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="detailForm.address" placeholder="请填写详细地址" :disabled="unchange"></el-input>
        </el-form-item>
        <!-- 场地类型需为数字，在表单验证中体现 -->
        <!-- <el-form-item label="场地类型" prop="type">
          <el-input v-model.number="detailForm.type" placeholder="请填写场地类型" :disabled="unchange"></el-input>
        </el-form-item> -->
        <el-form-item label="场地类型">
          <el-select v-model="detailForm.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="unchange">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认地址">
          <!-- <el-input v-model="detailForm.isDefault"></el-input> -->
          <el-radio v-model="detailForm.isDefault" :label="1" :disabled="unchange">是</el-radio>
          <el-radio v-model="detailForm.isDefault" :label="0" :disabled="unchange">否</el-radio>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <!-- 编辑按钮 -->
        <el-button type="primary" v-show="editShow" @click="editConfirm">确 定</el-button>
        <!-- 添加按钮 -->
        <el-button type="primary" v-show="addShow" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!--删除对话框-->
    <el-dialog
      title="删除场地"
      :visible.sync="delShow"
      width="50%"
      center>
      <div style="text-align:center">
      <span>是否要删除 <span style="color: #2d0dd2">场地编号为:{{deleId}}</span> </span>
      </div>
      <span slot="footer">
        <el-button @click="delShow = false">取 消</el-button>
        <el-button type="primary" @click="delConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import $ from 'jquery'
export default {
  name: 'areaManagePage',
  data () {
    return {
      param: {
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8
      },
      // midData: [],
      editShow: false,
      addShow: false,
      delShow: false,
      unchange: false,
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      options: [],
      siteList: [{
        value: '江泰国际广场1楼'
      }, {
        value: '江泰国际广场2楼'
      }, {
        value: '江泰国际广场3楼'
      }, {
        value: '江泰国际广场4楼'
      }],
      devIdlist: [],
      dialogTitle: '', // 详情对话框标题
      detailForm: {},
      deleId: '',
      dialogEditVisible: false,
      changeData: {}, // 中间变量,用于在修改弹窗中显示省份/城市/地区/场地类型
      tableData: [{
        id: '',
        name: '',
        address: '',
        isDefault: '',
        deviceNum: ''
      }],
      selection: {
        name: '',
        address: ''
      },
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 27 - 46, // ===tableDiv的高度
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
    // 分页查询请求可选项置空函数
    this.pageQueSelInit()
    this.backQueAreaPage()
  },
  mounted: function () {
    this.tableContainerHeightSet()
    // 监听屏幕高度
    this.screenOnresizeFun()
  },
  methods: {
    // 表格容器高度随窗口视口变化函数
    tableContainerHeightSet: function () {
      var windowHeight = $(window).height()
      var mainHeight = windowHeight - 40 - 40 - 40
      $('.tableDiv').height(mainHeight - 40 - 27 - 46)
      this.tableMaxHeght = mainHeight - 40 - 27 - 46
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
    // 弹窗取消按钮
    handleClose: function () {
      this.dialogEditVisible = false
      this.editShow = false
      this.addShow = false
      this.delShow = false
      this.unchange = false
      this.options = []
    },
    // 添加场地按钮
    addBt: function () {
      this.detailForm = {
        name: '',
        address: '',
        isDefault: '',
        province: '',
        city: '',
        area: '',
        type: ''
      }
      this.dialogTitle = '添加场地'
      this.dialogEditVisible = true
      this.addShow = true
      this.backQueEnum()
    },
    // 确定添加场地
    addConfirm: function () {
      console.log(this.detailForm)
      if (this.detailForm.id === '' ||
        this.detailForm.name === '' ||
        this.detailForm.address === '' ||
        this.detailForm.isDefault === '' ||
        this.detailForm.province === '' ||
        this.detailForm.city === '' ||
        this.detailForm.area === '' ||
        this.detailForm.type === '') {
        this.notificationInfo('错误！', '所有项目必须填完！')        
      } else {
        this.addShow = false
        this.dialogEditVisible = false
        this.backAddArea()
      }
    },
    // 删除场地按钮
    delBt: function (index, row) {
      this.delShow = true
      this.deleId = this.tableData[index].id
    },
    // 确定删除
    delConfirm: function () {
      this.backDelArea()
      this.delShow = false
      this.deleId = ''
    },
    // 修改按钮
    updateBt: function (index, row) {
      this.deleId = this.tableData[index].id
      this.dialogTitle = '修改场地'
      this.dialogEditVisible = true
      this.editShow = true
      this.backShowArea()
    },
    // 修改对话框确定按键
    editConfirm: function () {
      console.log('详情对话框确定按键')
      console.log(this.detailForm)
      if (this.detailForm.id === '' ||
        this.detailForm.name === '' ||
        this.detailForm.address === '' ||
        this.detailForm.isDefault === '' ||
        this.detailForm.province === '' ||
        this.detailForm.city === '' ||
        this.detailForm.area === '' ||
        this.detailForm.type === '') {
        this.notificationInfo('错误！', '所有项目必须填完！')        
      } else {
        this.dialogEditVisible = false
        this.editShow = false
        this.backUpdateArea()
        this.detailForm = {}
      }
    },
    // 搜索按钮
    searchBt: function () {
      console.log(this.selection)
      this.param.name = this.selection.name
      this.param.address = this.selection.address
      this.backQueAreaPage()
    },
    // 详情按钮
    detailBt: function (index, row) {
      this.dialogTitle = '场地详情'
      this.dialogEditVisible = true
      this.unchange = true
      this.deleId = this.tableData[index].id
      this.backShowArea()
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueAreaPage()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 场地分页查询
    backQueAreaPage: function () {
      let paramObj = {
        managerId: this.param.managerId,
        roleId: this.param.roleId,
        pageNo: this.param.currentPage,
        pageSize: this.param.pagesize,
        groupId: this.param.groupId,
        name: this.param.name,
        address: this.param.address
      }
      sessionSetStore('backName', '场地分页查询')
      back.queAreaPage(paramObj).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            // 存储表格数据
            let obj = {}
            obj.id = response.data.records[i].id
            obj.name = response.data.records[i].name
            obj.address = response.data.records[i].address
            obj.isDefault = response.data.records[i].isDefault === 1 ? '是' : '否'
            obj.deviceNum = response.data.records[i].deviceNum
            this.tableData.push(obj) // 或用this.tableData[i] = obj亦可
            console.log(this.tableData)
            // 中间变量midData：用于搜索
            // this.midData = this.tableData
            // 存储场地名称列表
            let devObj = {}
            devObj.value = response.data.records[i].name
            this.devIdlist[i] = devObj
            // 存储详细地址列表
            let siteObj = {}
            siteObj.value = response.data.records[i].address
            this.siteList[i] = siteObj
            // 清空表单
            this.detailForm = {
              id: '',
              name: '',
              address: '',
              isDefault: '',
              province: '',
              city: '',
              area: '',
              type: ''
            }
          }
        } else {
          this.tableData = []
          this.siteList = []
          this.devIdlist = []
        }
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    // 修改场地
    backUpdateArea: function () {
      let paramObj = {
        id: this.detailForm.id,
        name: this.detailForm.name,
        address: this.detailForm.address,
        isDefault: this.detailForm.isDefault,
        province: this.detailForm.province,
        city: this.detailForm.city,
        area: this.detailForm.area,
        type: this.detailForm.type
      }
      sessionSetStore('backName', '修改场地')
      back.updateArea(paramObj).then(function (response) {
        console.log(response)
        this.backQueAreaPage()
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    // 添加场地
    backAddArea: function () {
      let paramObj = {
        managerId: this.param.managerId,
        name: this.detailForm.name,
        address: this.detailForm.address,
        isDefault: this.detailForm.isDefault,
        province: this.detailForm.province,
        city: this.detailForm.city,
        area: this.detailForm.area,
        type: this.detailForm.type
      }
      sessionSetStore('backName', '添加场地')
      back.addArea(paramObj).then(function (response) {
        console.log(response)
        this.backQueAreaPage()
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    // 删除场地
    backDelArea: function () {
      let paramObj = {
        id: this.deleId
      }
      sessionSetStore('backName', '删除场地')
      back.delArea(paramObj).then(function (response) {
        console.log(response)
        this.backQueAreaPage()
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    // 查看场地详情
    backShowArea: function () {
      let paramObj = {
        id: this.deleId
      }
      this.detailForm = {}
      sessionSetStore('backName', '查看场地详情')
      back.showArea(paramObj).then(function (response) {
        console.log(response)
        this.detailForm = response.data
        this.backQueEnum()
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    // 获取场地类型
    backQueEnum: function () {
      let paramObj = {
        type: 'SITE_TYPE'
      }
      sessionSetStore('backName', '获取场地类型')
      back.queEnum(paramObj).then(function (response) {
        console.log(response)
        let arr = {}
        for (var i = 0; i < response.data.length; i++) {
          arr.value = response.data[i].enumKey
          arr.label = response.data[i].enumValue
          this.options.push(arr)
          console.log(this.detailForm.type)
          arr = {}
        }
        console.log(this.options)
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    /*
      *
      *******************   辅助函数   *********************
      *
    */
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.devId = ''
      this.param.groupId = ''
      this.param.name = ''
      this.param.address = ''
      this.param.roleId = 0
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
.select .el-input {
  width: 200px;
  margin-right: 5px;
}
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width:auto;
}
.areaManagePage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
</style>
