<template>
  <div class="devTransferRecordPage">
    <div class="select">
      <el-select v-model="selectedValue" placeholder="请选择需要查询的设备编号" @change="searchDev">
        <el-option
          v-for="item in devDeviceIdList"
          :key="item.value + randomValue"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="tableDiv">
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        border
        :max-height="tableMaxHeght"
        style="width: 100%;font-size:12px;">
        <el-table-column
          align="center"
          prop="deviceId"
          label="设备编号"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="type"
          label="操作类型"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="转移时间"
          min-width="20%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="oldSite"
          label="原投放地址"
          min-width="30%">
        </el-table-column>
        <el-table-column
          align="center"
          prop="newSite"
          label="转移投放地址"
          min-width="30%">
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
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import { character } from '@/components/config/Character'
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
      selectedValue: '',
      total: 6,
      online: 3,
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      devDeviceIdList: [],
      randomValue: character.randomWord(true, 9, 12),
      // 表格数据
      tableData: [{
        deviceId: '139761',
        type: '注册', // 操作类型 1-注册 2-转移 3-解绑
        createTime: '2017-11-25 16:27:08',
        oldSite: '江泰国际广场4楼',
        newSite: '江泰国际广场2楼'
      }],
      // 表格最大高度 header mainOuterPadding tabs mainInPadding footer serachDiv bugSet
      tableMaxHeght: document.body.clientHeight - 40 - 20 - 40 - 40 - 62 - 53 + 13 // ===tableDiv的高度
    }
  },
  created: function () {
    // session获取登录者关键参数
    this.param.managerId = sessionGetStore('managerId')
    this.pageQueSelInit()
    this.backQueDevOperRecodPage()
  },
  mounted: function () {
    var windowHeight = $(window).height()
    var windowWidth = $(window).width()
    var mainHeight = windowHeight - 40 - 20 - 40 - 40 // header mainOuterPadding tabs mainInPadding
    console.log(mainHeight)
    $('.devTransferRecordPage').height(mainHeight) // 设置的是内容高度，巨坑啊卧槽
    $('.tableDiv').height(mainHeight - 62 - 53 + 13) // serachDiv footer
    $('.tableDiv').width(windowWidth - 200 - 20 - 40) // 解决表格滚动条分页益处问题
  },
  methods: {
    searchDev: function (val) {
      console.log(val)
      this.param.devId = val
      this.backQueDevOperRecodPage()
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueDevOperRecodPage()
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 设备操作记录分页查询
    backQueDevOperRecodPage: function () {
      sessionSetStore('backName', '设备操作记录分页查询')
      back.queDevOperRecordPage(this.param).then(function (response) {
        console.log(response)
        this.eltotal = response.data.total
        if (response.data.records) {
          this.tableData = []
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.id = response.data.records[i].id
            obj.deviceId = response.data.records[i].deviceId
            obj.typeNum = response.data.records[i].type
            if (obj.typeNum === 1) {
              obj.type = '注册'
            } else if (obj.typeNum === 2) {
              obj.type = '转移'
            } else if (obj.typeNum === 3) {
              obj.type = '解绑'
            }
            obj.oldSite = response.data.records[i].oldSite
            obj.newSite = response.data.records[i].newSite
            obj.createTime = response.data.records[i].createTime
            this.tableData.push(obj)
            // 存储设备编码列表
            let devObj = {}
            devObj.value = response.data.records[i].deviceId
            this.devDeviceIdList[i] = devObj
          }
        } else {
          this.tableData = []
          this.devDeviceIdList = []
        }
      }.bind(this))
        .catch((error) => {
          console.log(error)
        })
    },
    //
    // *******************   辅助函数   *********************
    //
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
.devTransferRecordPage {
  padding: 20px;
  background-color: white;
  width: 100%;
}
.select {
  width: 100%;
  height: 40px;
  text-align: left;
  margin-bottom: 22px;
}
.el-select >>> .el-input {
  font-size: 12px;
}
</style>
