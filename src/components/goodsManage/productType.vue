// 5.商品类型 -> 5-2商品类型
<template>
  <div class="productType">
        <div class="select">
        <span style="margin: auto 1%;">商品类型</span>
        <el-input size="small" v-model="selection.name" placeholder="请输入商品类型"></el-input>
        <!-- <span style="margin: auto 1%">产品类型</span>
        <el-autocomplete
          class="inline-input"
          suffix-icon="el-icon-arrow-down"
          v-model="selection.type"
          :fetch-suggestions="querySearch_DevId"
          placeholder="请输入或选择产品类型">
        </el-autocomplete> -->
        <el-button type="primary" size="small" style="margin: auto 1%" @click="searchBt">搜索</el-button>
        <el-button type="primary" size="small" style="margin: auto 1%" @click="addBt">新增</el-button>
      </div>
    <div class="tableDiv" style="margin-top: 1%">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="width: 100%;font-size:12px;"
        @selection-change="handleSelectionChange">
        <el-table-column
          align="center"
          prop="deviceId"
          label="商品类型"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="productName"
          label="备注"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="productType"
          label="创建时间"
          min-width="20%">
        </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            min-width="20%">
            <template slot-scope="scope">
            <el-button type="text" size="small" @click="editBt(scope.$index, scope.row)">编辑</el-button>
            <span style="margin: auto 10%">|</span>
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
        <el-form-item label="商品类型" prop="productType">
          <el-input v-model="editform.num" placeholder="请填写商品类型"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="price">
          <el-input v-model="editform.price" placeholder="请填写备注" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
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
        'pagesize_DiaDev': 8,
        name: '',
        type: ''
      },
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      dialogEditVisible: false,
      isEditOrAdd: null,
      dialogTitle: '',
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
        productType: [
          { required: true, validator: checkProductType, trigger: 'blur' }
        ]
      },
      // 表格最大高度 header mainOuterPadding tabs mainInPadding footer serachDiv bugSet
      tableMaxHeght: document.body.clientHeight - 40 - 20 - 40 - 72 + 13 // ===tableDiv的高度
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.managerId = sessionGetStore('managerId')
    this.backQuePaperPage()
  },
  mounted: function () {
    var windowWidth = $(window).width()
    $('.tableDiv').width(windowWidth - 200 - 20 - 40) // 解决表格滚动条分页益处问题
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 40 - 20 - 40
    $('.productType').height(mainHeight)
    $('.tableDiv').height(mainHeight - 72 - 26 + 13)
  },
  methods: {
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
      this.param.name = this.selection.name
      if (this.selection.type === '小包纸') {
        this.param.type = 1
      } else if (this.selection.type === '小包纸') {
        this.param.type = 2
      } else {
        this.param.type = ''
      }
      this.backQuePaperPage()
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
            // 清空搜索框内容
            this.selection.name = ''
            this.selection.type = ''
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
    // // 纸巾查询
    // backQuePaperList: function () {
    //   back.quePaperList().then(function (response) {
    //     console.log(response)
    //   })
    //     .catch(function (error) {
    //       console.log(error)
    //     })
    // },
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
.productType {
  padding: 20px;
  background-color: white;
}
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.productType >>> .el-dialog__header {
  border-bottom: 1px solid #CDC9C9;
}
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
</style>
