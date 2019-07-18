<template>
  <div class="productmanagePage">
    <div class="flexbox">
        <div class="box">
        <span style="width:80px;margin-top:6px">产品名称</span>
        <el-input size="small" v-model="selection.name" placeholder="请输入产品名称"></el-input>
      </div>
        <!-- <div>产品名称
          <el-autocomplete
            class="inline-input"
            suffix-icon="el-icon-arrow-down"
            v-model="selection.name"
            :fetch-suggestions="querySearch_Loca"
            placeholder="请输入或选择产品名称">
          </el-autocomplete>
        </div> -->
        <div style="margin: 0 20px;">产品类型
          <el-autocomplete
            class="inline-input"
            suffix-icon="el-icon-arrow-down"
            v-model="selection.type"
            :fetch-suggestions="querySearch_DevId"
            placeholder="请输入或选择产品类型">
          </el-autocomplete>
        </div>
        <el-button type="primary" size="small" @click="searchBt">搜索</el-button>
      <div class="box">
        <el-button type="primary" size="small" @click="addBt">新增</el-button>
      </div>
    </div>
    <div class="tableDiv">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="width: 100%;font-size:12px;"
        @selection-change="handleSelectionChange">
        <!-- <el-table-column
          type="selection"
          min-width="10%">
        </el-table-column> -->
        <el-table-column
          align="center"
          prop="deviceId"
          label="产品编码"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="productName"
          label="产品名称"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="productType"
          label="产品类型"
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
          prop="num"
          label="库存"
          min-width="10%">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="20%">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="showRecordBt(scope.$index, scope.row)">查看操作记录</el-button> -->
            <el-button type="text" size="small" @click="editBt(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="text" @click="delBt(scope.$index, scope.row)">删除</el-button>
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

    <!--新增/编辑对话框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditVisible"
      width="20%"
      center>
      <el-form :model="editform" label-width="100px" :rules="rulesLogin" ref="editform">
        <el-form-item label="产品编码" v-show="isProductIdShowDia">
          <el-input v-model="editform.deviceId" :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="editform.productName" placeholder="请填写产品名称"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="productType">
          <el-select v-model="editform.productType" placeholder="请选择产品类型">
            <el-option v-for="item in productTypeOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品库存" prop="num">
          <el-input v-model="editform.num" placeholder="请填写产品库存"></el-input>
        </el-form-item>
        <el-form-item label="产品单价" prop="price">
          <el-input v-model="editform.price" placeholder="请填写产品单价"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm('editform')">确 定</el-button>
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
    // 校验产品名
    var checkProductName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('产品名称不能为空'))
      } else if (value.length > 20) {
        callback(new Error('产品名称长度不超过20位'))
      } else {
        callback()
      }
    }
    // 校验库存
    var checkStock = (rule, value, callback) => {
      let numReg = /^[0-9]*$/
      if (value === '') {
        return callback(new Error('库存不能为空'))
      } else if (!numReg.test(value)) {
        callback(new Error('库存只能为数字'))
      } else {
        callback()
      }
    }
    // 校验价格
    var checkPrice = (rule, value, callback) => {
      let numReg = /^[0-9]*$/
      if (value === '') {
        callback(new Error('单价不能为空'))
      } else if (!numReg.test(value)) {
        callback(new Error('单价只能为数字'))
      } else {
        callback()
      }
    }
    // 校验产品类型
    var checkProductType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('产品类型不能为空'))
      } else {
        callback()
      }
    }
    return {
      param: {
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaDev': 1,
        'pagesize_DiaDev': 8
      },
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      dialogEditVisible: false,
      isEditOrAdd: null,
      dialogTitle: '',
      multipleSelection: [],
      isedit: false,
      selection: {
        name: '',
        type: ''
      },
      midData: [], // 中间量，存储tableData（用于搜索）
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
        productName: '纸巾',
        productType: '抽纸',
        num: '10', // 没有预置项则表单不能同步显示，大坑啊,而且要注意字符数字格式转化
        price: '100'
      },
      isProductIdShowDia: false,
      productTypeOptions: [
        { label: '小包纸', value: 1 },
        { label: '卷纸', value: 2 }
      ],
      tableData: [],
      // 表单校验
      rulesLogin: {
        productName: [
          { required: true, validator: checkProductName, trigger: 'blur' }
        ],
        productType: [
          { required: true, validator: checkProductType, trigger: 'blur' }
        ],
        num: [
          { required: true, validator: checkStock, trigger: 'blur' }
        ],
        price: [
          { required: true, validator: checkPrice, trigger: 'blur' }
        ]
      },
      // 表格最大高度 header mainOuterPadding tabs mainInPadding footer serachDiv bugSet
      tableMaxHeght: document.body.clientHeight - 40 - 20 - 40 - 72 + 13 // ===tableDiv的高度
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.id = sessionGetStore('managerId')
    this.backQuePaperPage()
  },
  mounted: function () {
    var windowWidth = $(window).width()
    $('.tableDiv').width(windowWidth - 200 - 20 - 40) // 解决表格滚动条分页益处问题
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 40 - 20 - 40
    $('.productmanagePage').height(mainHeight)
    $('.tableDiv').height(mainHeight - 72 - 53 + 13)
  },
  methods: {
    // // 选择投放地址自动完成
    // querySearch_Loca: function (queryString, cb) {
    //   var locationlist = this.locationlist
    //   var results = queryString ? locationlist.filter(this.createFilter_Loca(queryString)) : locationlist
    //   // 调用 callback 返回建议列表的数据
    //   cb(results)
    // },
    // createFilter_Loca: function (queryString) {
    //   return (locationlist) => {
    //     return (locationlist.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    //   }
    // },
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
      console.log(row)
      this.dialogTitle = '编辑'
      this.isEditOrAdd = 0
      this.isProductIdShowDia = true
      this.isedit = true
      this.param.id = row.deviceId
      this.backQuePaperInfo()
      this.dialogEditVisible = true
    },
    // 新增产品按钮
    addBt: function () {
      console.log(this.tableData)
      this.dialogTitle = '新增'
      this.isEditOrAdd = 1
      this.isProductIdShowDia = false
      this.isedit = false
      // // 这种对象初始化方式不够灵活
      // this.editform = {
      //   deviceId: '',
      //   productName: '',
      //   productType: ''
      // }
      this.editform.deviceId = ''
      this.editform.productName = ''
      this.editform.productType = ''
      this.editform.num = ''
      this.editform.price = ''
      this.dialogEditVisible = true
    },
    // 对话框修改确认
    editConfirm: function (formName) {
      console.log(formName)
      console.log(this.$refs[formName])
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('正确提交')
          console.log(this.editform)
          this.param.id = this.editform.deviceId
          this.param.name = this.editform.productName
          this.param.type = Number(this.editform.productType)
          this.param.num = Number(this.editform.num)
          this.param.price = Number(this.editform.price)
          if (this.isEditOrAdd === 0) {
            this.backUpdatePaper()
          } else {
            // 表单验证
            this.backAddPaper()
          }
          this.dialogEditVisible = false
        } else {
          console.log('错误提交')
        }
      })
    },
    // 查看操作记录，库存增减记录
    showRecordBt: function () {
      console.log('查看操作记录')
    },
    // 删除产品对话框
    delBt: function (index, row) {
      console.log(index)
      console.log(row)
      this.$confirm('确定删除该产品吗?', '删除该产品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.param.id = row.deviceId
        this.backdelPaper()
      }).catch(() => {
      })
    },
    // 搜索按钮
    searchBt: function () {
      console.log(this.selection)
      this.backQuePaperList()
      // // 如果要搜索的产品类型和产品名称为空，则显示全部列表
      // if (this.selection.name === '' && this.selection.type === '') {
      //   this.tableData = this.midData
      // } else if (this.selection.name !== '' && this.selection.type === '') {
      //   // 如果只搜索名称，不搜索类型
      //   this.tableData = []
      //   for (var i = 0; i < this.midData.length; i++) {
      //     if (this.selection.name === this.midData[i].productName) {
      //       this.tableData.push(this.midData[i])
      //     }
      //   }
      //   // 搜索不到数据时，通知搜索错误
      //   if (this.tableData.length === 0) {
      //     this.notificationInfo('错误！', '产品名称不存在！')
      //   }
      // } else if (this.selection.name === '' && this.selection.type !== '') {
      //   // 如果只搜索名称，不搜索类型
      //   this.tableData = []
      //   for (var j = 0; j < this.midData.length; j++) {
      //     if (this.selection.type === this.midData[j].productType) {
      //       this.tableData.push(this.midData[j])
      //     }
      //   }
      //   // 搜索不到数据时，通知搜索错误
      //   if (this.tableData.length === 0) {
      //     this.notificationInfo('错误！', '产品类型不存在！')
      //   }
      // } else if (this.selection.name !== '' && this.selection.type !== '') {
      //   // 同时搜索设备名称和设备类型时
      //   this.tableData = []
      //   for (var k = 0; k < this.midData.length; k++) {
      //     if (this.selection.type === this.midData[k].productType && this.selection.name === this.midData[k].productName) {
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
    handleSelectionChange: function (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQuePaperPage()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 纸巾分页查询
    backQuePaperPage: function () {
      sessionSetStore('backName', '纸巾分页查询')
      back.quePaperPage(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          this.locationlist = []
          this.devIdlist = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            let nameObj = {}
            let typeObj = {}
            obj.deviceId = response.data.records[i].id
            obj.productName = response.data.records[i].name
            nameObj.value = response.data.records[i].name
            obj.productTypeNum = response.data.records[i].type
            obj.productType = response.data.records[i].type === 1 ? '小报纸' : '卷纸'
            typeObj.value = obj.productType
            obj.num = response.data.records[i].num
            obj.price = response.data.records[i].price
            this.tableData.push(obj) // 或用this.tableData[i] = obj亦可
            this.locationlist.push(nameObj)
            this.devIdlist.push(typeObj)
            console.log(this.tableData)
            console.log(this.locationlist)
            console.log(this.devIdlist)
            this.midData = this.tableData
          }
        } else {
          this.tableData = []
          this.locationlist = []
          this.devIdlist = []
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 新增纸巾
    backAddPaper: function () {
      sessionSetStore('backName', '新增纸巾')
      back.addPaper(this.param).then(function (response) {
        console.log(response)
        this.backQuePaperPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 修改纸巾
    backUpdatePaper: function () {
      sessionSetStore('backName', '修改纸巾')
      back.updatePaper(this.param).then(function (response) {
        console.log(response)
        this.backQuePaperPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 查看纸巾详情
    backQuePaperInfo: function () {
      return new Promise(function (resolve, reject) {
        sessionSetStore('backName', '查看纸巾详情')
        back.quePaperInfo(this.param).then(function (response) {
          console.log(response)
          let obj = {}
          if (response.data !== undefined) {
            obj.deviceId = response.data.id
            obj.productName = response.data.name
            obj.productType = response.data.type
            obj.num = response.data.num
            obj.price = response.data.price
          }
          this.editform = obj
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    // 删除纸巾
    backdelPaper: function () {
      sessionSetStore('backName', '删除纸巾')
      back.delPaper(this.param).then(function (response) {
        console.log(response)
        this.backQuePaperPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 纸巾查询
    backQuePaperList: function () {
      back.quePaperList().then(function (response) {
        console.log(response)
      })
        .catch(function (error) {
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
      this.param.operationType = '2'
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
.productmanagePage {
  padding: 20px;
  background-color: white;
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
