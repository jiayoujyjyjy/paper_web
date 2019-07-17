// 场地管理
<template>
  <div class="areaManagePage">
    <div class="flexbox">
      <!-- 添加了输入自动匹配功能 -->
      <div style="margin: 0 20px;">场地名称
        <el-autocomplete
          size="small"
          class="inline-input"
          suffix-icon="el-icon-arrow-down"
          v-model="selection.name"
          :fetch-suggestions="querySearch_DevId"
          placeholder="请输入或选择场地名称">
        </el-autocomplete>
      </div>
      <div>详细地址
        <el-autocomplete
          size="small"
          class="inline-input"
          suffix-icon="el-icon-arrow-down"
          v-model="selection.address"
          :fetch-suggestions="querySearch_Loca"
          placeholder="请输入或选择详细地址">
        </el-autocomplete>
      </div>
      <el-button type="primary" size="small" @click="searchBt">搜索</el-button>
      <el-button type="primary" size="small" @click="addBt">添加场地</el-button>
    </div>
    <div class="tableDiv">
      <el-table
        :header-cell-style="{'font-size':'12px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="width: 100%;font-size:12px;">
         <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="省份">
                <span>{{ props.row.province }}</span>
              </el-form-item>
              <el-form-item label="城市">
                <span>{{ props.row.city }}</span>
              </el-form-item>
              <el-form-item label="地区">
                <span>{{ props.row.area }}</span>
              </el-form-item>
              <el-form-item label="分组">
                <span>{{ props.row.isGroup }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column> -->
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
      <el-form :model="detailForm" label-width="100px">
        <el-form-item label="场地编码" v-show="editShow">
          <el-input v-model="detailForm.id" placeholder="请填写场地编码"></el-input>
        </el-form-item>
        <el-form-item label="场地名称">
          <el-input v-model="detailForm.name" placeholder="请填写场地名称"></el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="detailForm.province" placeholder="请填写省份"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="detailForm.city" placeholder="请填写城市"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="detailForm.area" placeholder="请填写地区"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="detailForm.address" placeholder="请填写详细地址"></el-input>
        </el-form-item>
        <!-- 场地类型需为数字，在表单验证中体现 -->
        <el-form-item label="场地类型">
          <el-input v-model="detailForm.type" placeholder="请填写场地类型"></el-input>
        </el-form-item>
        <el-form-item label="默认地址">
          <!-- <el-input v-model="detailForm.isDefault"></el-input> -->
          <el-radio v-model="detailForm.isDefault" :label="1">是</el-radio>
          <el-radio v-model="detailForm.isDefault" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="场地分组编码" v-show="groupHide">
          <el-input v-model="detailForm.isGroup"></el-input>
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
      groupHide: false,
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
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
      // 表格最大高度 header mainOuterPadding tabs mainInPadding footer serachDiv bugSet
      tableMaxHeght: document.body.clientHeight - 40 - 20 - 40 - 72 - 53 + 13
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
    var windowWidth = $(window).width()
    $('.tableDiv').width(windowWidth - 200 - 20 - 40) // 解决表格滚动条分页益处问题
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 40 - 20 - 40
    $('.areaManagePage').height(mainHeight)
    $('.tableDiv').height(mainHeight - 72 - 53 + 13)
  },
  methods: {
    // 弹窗取消按钮
    handleClose: function () {
      this.dialogEditVisible = false
      this.editShow = false
      this.addShow = false
      this.delShow = false
      this.groupHide = false
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
    },
    // 确定添加场地
    addConfirm: function () {
      this.addShow = false
      this.dialogEditVisible = false
      this.backAddArea()
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
    // 选择投放地址自动完成
    querySearch_Loca: function (queryString, cb) {
      var siteList = this.siteList
      var results = queryString ? siteList.filter(this.createFilter_Loca(queryString)) : siteList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter_Loca: function (queryString) {
      return (siteList) => {
        return (siteList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
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
    // 修改按钮
    updateBt: function (index, row) {
      this.dialogTitle = '修改场地'
      this.detailForm = {
        id: this.tableData[index].id,
        name: this.tableData[index].name,
        address: this.tableData[index].address,
        isDefault: this.tableData[index].isDefault === '是' ? 1 : 0,
        province: this.changeData.province,
        city: this.changeData.city,
        area: this.changeData.area,
        type: this.changeData.type
      }
      this.dialogEditVisible = true
      this.editShow = true
    },
    // 修改对话框确定按键
    editConfirm: function () {
      console.log('详情对话框确定按键')
      console.log(this.detailForm)
      this.dialogEditVisible = false
      this.editShow = false
      this.backUpdateArea()
      this.detailForm = {}
    },
    // 搜索按钮
    searchBt: function () {
      console.log(this.selection)
      this.param.name = this.selection.name
      this.param.address = this.selection.address
      this.backQueAreaPage()
      // // 如果要搜索的场地名称和详细地址为空，则显示全部列表
      // if (this.selection.name === '' && this.selection.address === '') {
      //   this.tableData = this.midData
      // } else if (this.selection.name !== '' && this.selection.address === '') {
      //   // 如果只搜索名称，不搜索类型
      //   this.tableData = []
      //   for (var i = 0; i < this.midData.length; i++) {
      //     if (this.selection.name === this.midData[i].name) {
      //       this.tableData.push(this.midData[i])
      //     }
      //   }
      //   // 搜索不到数据时，通知搜索错误
      //   if (this.tableData.length === 0) {
      //     this.notificationInfo('错误！', '产品名称不存在！')
      //   }
      // } else if (this.selection.name === '' && this.selection.address !== '') {
      //   // 如果只搜索名称，不搜索类型
      //   this.tableData = []
      //   for (var j = 0; j < this.midData.length; j++) {
      //     if (this.selection.address === this.midData[j].address) {
      //       this.tableData.push(this.midData[j])
      //     }
      //   }
      //   // 搜索不到数据时，通知搜索错误
      //   if (this.tableData.length === 0) {
      //     this.notificationInfo('错误！', '产品类型不存在！')
      //   }
      // } else if (this.selection.name !== '' && this.selection.address !== '') {
      //   // 同时搜索设备名称和设备类型时
      //   this.tableData = []
      //   for (var k = 0; k < this.midData.length; k++) {
      //     if (this.selection.address === this.midData[k].address && this.selection.name === this.midData[k].name) {
      //       this.tableData.push(this.midData[k])
      //     }
      //   }
      //   // 搜索不到数据时，通知搜索错误
      //   if (this.tableData.length === 0) {
      //     this.notificationInfo('错误！', '产品名称或产品类型不存在！')
      //   }
      //   console.log(this.tableData)
      // }
    },
    // 详情按钮
    detailBt: function (index, row) {
      this.dialogTitle = '场地详情'
      this.dialogEditVisible = true
      this.groupHide = true
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
            // this.detailForm = {
            //   id: '',
            //   name: '',
            //   address: '',
            //   isDefault: '',
            //   province: '',
            //   city: '',
            //   area: '',
            //   type: ''
            // }
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
    // 场地查询
    // backQueArea: function () {
    //   let paramObj = {
    //     managerId: this.param.managerId,
    //     roleId: this.param.roleId,
    //     groupId: this.param.groupId,
    //     name: this.param.name,
    //     address: this.param.address
    //   }
    //   sessionSetStore('backName', '场地查询')
    //   back.queArea(paramObj).then(function (response) {
    //     console.log(response)
    //     this.backQueAreaPage()
    //   }.bind(this))
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // },
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
      sessionSetStore('backName', '查看场地详情')
      back.showArea(paramObj).then(function (response) {
        console.log(response)
        this.detailForm = response.data
        this.changeData.province = response.data.province
        this.changeData.city = response.data.city
        this.changeData.area = response.data.area
        this.changeData.type = response.data.type
        this.backQueAreaPage()
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
.areaManagePage {
  padding: 20px;
  background-color: white;
  font-size: 14px;
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
.areaManagePage >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
/* .demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
} */
</style>
