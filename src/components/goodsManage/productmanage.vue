// 5商品管理 -> 5-1商品列表
<template>
  <div class="productmanagePage">
        <div class="select">
        <span style="margin: auto 1%;">商品名称</span>
        <el-input size="small" v-model="productName" placeholder="请输入产品名称"></el-input>
        <span style="margin: auto 1%">商品类型</span>
      <el-select v-model="selected" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
        <el-button type="primary" size="small" style="margin: auto 1%" @click="searchBt">搜索</el-button>
        <el-button type="primary" size="small" style="margin: auto 1%" @click="addBt">添加商品</el-button>
      </div>
    <div class="tableDiv" style="margin-top: 20px">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        stripe
        border
        :max-height="tableMaxHeght"
        style="margin-top: 20px; font-size:12px;"
        @selection-change="handleSelectionChange">
        <el-table-column
          label="序号"
          width="50"
          align="center"
          type="index">
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceId"
          label="商品ID"
          min-width="10%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="productName"
          label="商品名称"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="productType"
          label="商品类型"
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
        <el-form-item label="商品ID" v-show="isProductIdShowDia">
          <el-input v-model="editform.deviceId" :disabled="isedit"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="editform.productName" placeholder="请填写商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="productType">
          <el-select v-model="editform.productType" placeholder="请选择商品类型">
            <el-option v-for="item in option"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品库存" prop="num">
          <el-input v-model="editform.num" placeholder="请填写商品库存"></el-input>
        </el-form-item>
        <el-form-item label="商品单价" prop="price">
          <el-input v-model="editform.price" placeholder="请填写商品单价"></el-input>
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
        return callback(new Error('商品名称不能为空'))
      } else if (value.length > 20) {
        callback(new Error('商品名称长度不超过20位'))
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
        callback(new Error('商品类型不能为空'))
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
      multipleSelection: [],
      isedit: false,
      productName: '',
      options: [
        {
          value: '',
          label: '全部'
        }
      ],  // 用于搜索,要显示'全部'
      option: [], // 编辑时,不能出现'全部'
      selected: '全部',
      editform: {
        deviceId: '139761',
        productName: '商品',
        productType: '抽纸',
        num: '10', // 没有预置项则表单不能同步显示，大坑啊,而且要注意字符数字格式转化
        price: '100'
      },
      isProductIdShowDia: false,
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
      tableMaxHeght: document.body.clientHeight - 40 - 40 - 40 - 40 - 35 - 38, // ===tableDiv的高度
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
    this.param.id = sessionGetStore('managerId')
    this.backQuePaperPage()
    // 获取商品分类
    this.backpaperType()
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
      $('.tableDiv').height(mainHeight - 40 - 35 - 38)
      this.tableMaxHeght = mainHeight - 40 - 35 - 38
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
      this.$confirm('确定删除该商品吗?', '删除该商品', {
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
      this.param.name = this.productName
      this.param.type = this.selected
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
    // 商品分页查询
    backQuePaperPage: function () {
      sessionSetStore('backName', '商品分页查询')
      back.quePaperPage(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.deviceId = response.data.records[i].id
            obj.productName = response.data.records[i].name
            obj.productTypeNum = response.data.records[i].type
            obj.productType = response.data.records[i].type === 1 ? '小包纸' : '卷纸'
            obj.num = response.data.records[i].num
            obj.price = response.data.records[i].price
            this.tableData.push(obj) // 或用this.tableData[i] = obj亦可
            console.log(this.tableData)
            this.midData = this.tableData
            // 清空搜索框
            this.productName = ''
            this.selected = ''
          }
        } else {
          this.tableData = []
          this.devIdlist = []
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 新增商品
    backAddPaper: function () {
      sessionSetStore('backName', '新增商品')
      back.addPaper(this.param).then(function (response) {
        console.log(response)
        this.param.name = ''
        this.param.type = ''
        this.backQuePaperPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 修改商品
    backUpdatePaper: function () {
      sessionSetStore('backName', '修改商品')
      back.updatePaper(this.param).then(function (response) {
        console.log(response)
        this.param.name = ''
        this.param.type = ''
        this.backQuePaperPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 查看商品详情
    backQuePaperInfo: function () {
      return new Promise(function (resolve, reject) {
        sessionSetStore('backName', '查看商品详情')
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
    // 删除商品
    backdelPaper: function () {
      sessionSetStore('backName', '删除商品')
      back.delPaper(this.param).then(function (response) {
        console.log(response)
        this.backQuePaperPage()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 获取商品分类
    backpaperType: function () {
      this.param.name = ''
      sessionSetStore('backName', '获取商品分类')
      back.paperType(this.param).then(function (response) {
        console.log(response)
        if (response.code === 0) {
          for (var i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.value = response.data[i].id
            obj.label = response.data[i].name
            this.options.push(obj)
            this.option.push(obj)
            console.log(this.options)
          }
        }
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // // 商品查询
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
.box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.productmanagePage >>> .el-dialog__header {
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
