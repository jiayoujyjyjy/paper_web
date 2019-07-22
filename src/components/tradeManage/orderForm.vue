// 更改为3交易管理-> 3-1交易订单
<template>
  <div class="deviceInfoPage">
    <div class="flexbox1">

      <div>
        <div>
          <span style="margin-right:5px;">日期</span>
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            size="small"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <p></p>
      </div>

      <div>
        <!-- <div style="display: -webkit-flex;display: flex;flex-wrap: nowrap;margin-left:20px;">
          <span style="display:block;margin-top:5px;margin-right:5px;">场地</span>
          <el-popover
            placement="bottom"
            width="300"
            trigger="click"
            >
            <div>
              <el-input v-model="popoverInput" size="small" @change="popInputChange" placeholder="请输入场地名称"></el-input>
              <div class="popdiv">
                <div style="background-color:#f5f7fa;padding:10px;">场地</div>
                <div style="padding-left: 10px;">
                  <el-checkbox v-model="checkedAll_loca" @change="changeCheck">全选</el-checkbox>
                  <el-checkbox-group v-model="checkList_loca" @change="changeCheckGroup">
                    <el-checkbox v-for="item in locationlist" :key="item.key" style="width:100%" :label="item.value"></el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="popdiv">
                <div style="background-color:#f5f7fa;padding:10px;">分组</div>
                <div style="padding-left: 10px;">
                  <el-checkbox v-model="checkedAll_locaGroup" @change="changeCheck">全选</el-checkbox>
                  <el-checkbox-group v-model="checkList_locaGroup" @change="changeCheckGroup">
                    <el-checkbox v-for="item in locaGrouplist" :key="item.key" style="width:100%" :label="item.value"></el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <el-input slot="reference" size="small" suffix-icon="el-icon-arrow-down" v-model="poploca"></el-input>
          </el-popover>
        </div> -->
        <!-- <div>
          <el-button type="text" size="small" @click="addGroup">添加分组</el-button>
          <span class="dividingLine">|</span>
          <el-button type="text" size="small" @click="editGroup">编辑分组</el-button>
        </div> -->
      </div>
      <div style="display: -webkit-flex;display: flex;flex-wrap: nowrap;margin-left:20px;">
        <span style="display:block;margin-top:5px;width:80px;margin-right:5px;">设备编码</span>
        <el-input v-model="input_devId" size="small" placeholder="请输入设备编码"></el-input>
      </div>
    </div>

    <div class="flexbox">
      <div>展示
        <el-radio-group v-model="isTable" size="small">
          <el-radio-button :label="true">详情</el-radio-button>
          <el-radio-button :label="false">趋势</el-radio-button>
        </el-radio-group>
      </div>
      <div class="flexbox">
        <el-button type="primary" size="small" @click="searchBt">查询</el-button>
        <el-button size="small" type="primary" style="margin-left:20px;" @click="resetBt">重置</el-button>
      </div>
    </div>
    <div v-show="isTable">
      <div class="tableDiv">
        <el-table
          :header-cell-style="{'font-size':'14px'}"
          :data="tableData"
          stripe
          border
          :max-height="tableMaxHeght"
          size="small"
          style="width: 100%;font-size:12px;">
          <el-table-column
            align="center"
            prop="name"
            label="名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="deviceId"
            label="设备编码">
          </el-table-column>
          <el-table-column
            align="center"
            prop="location"
            label="投放地址">
          </el-table-column>
          <el-table-column
            align="center"
            prop="state"
            label="状态">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.state === '在线' ? 'success' : 'danger'"
                disable-transitions>{{scope.row.state}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="onlineIncome"
            label="在线收益">
          </el-table-column>
          <el-table-column
            align="center"
            prop="tradNum"
            label="交易笔数">
          </el-table-column>
          <el-table-column
            align="center"
            prop="adIncome"
            label="广告收益">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalIncome"
            label="总收益">
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

    <div v-show="!isTable">
      <div class="chartsRadio">
        <el-radio-group v-model="isIncome" size="small" @change="changeRadio">
          <el-radio-button :label="true">总收益</el-radio-button>
          <el-radio-button :label="false">交易笔数</el-radio-button>
        </el-radio-group>
      </div>
      <div id="diagram">charts</div>
    </div>

    <!--新增/编辑分组对话框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditVisible"
      width="25%"
      center>
      <div v-show="selectGroup">
        <div style="padding:10px;border:1px solid #ebeef5;height:200px;">
          <div v-for="item in locaGrouplist" :key="item.key" style="width:100%;" class="flexbox">
            <span>{{item.value}}</span>
            <div class="flexbox">
              <el-button type="text" size="small" @click="diaEditBt(item.value)">编辑</el-button>
              <span class="dividingLine">|</span>
              <el-button type="text" size="small" @click="diaDelBt(item.value)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!selectGroup">
        <span style="display:block;margin:15px 0 10px 0;">分组名称</span>
        <el-input v-model="editform.groupName" size="small" placeholder="请输入场地分组名称"></el-input>
        <span style="display:block;margin:15px 0 10px 0;">选择加入该组的场地</span>
        <div style="padding:10px;border:1px solid #ebeef5;height:200px;">
          <el-checkbox-group v-model="editform.checkList">
            <el-checkbox v-for="item in locationlist" :key="item.key" style="width:100%" :label="item.value"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <span slot="footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { back } from 'api'
import { sessionSetStore } from '@/components/config/Utils'
import echarts from 'echarts'
import $ from 'jquery'
import Routers from '@/router'
export default {
  data () {
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
      dialogTitle: '',
      dateValue: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      popoverInput: '',
      poploca: '全部',
      checkedAll_loca: true,
      checkedAll_locaGroup: true,
      checkList_loca: [],
      checkList_locaGroup: [],
      input_devId: '',
      isTable: true,
      isIncome: true,
      selectGroup: false,
      locationlist: [{
        key: '江泰国际广场1楼',
        value: '江泰国际广场1楼'
      }, {
        key: '江泰国际广场2楼',
        value: '江泰国际广场2楼'
      }, {
        key: '江泰国际广场3楼',
        value: '江泰国际广场3楼'
      }, {
        key: '江泰国际广场4楼',
        value: '江泰国际广场4楼'
      }, {
        key: '丽水金汇广场4楼',
        value: '丽水金汇广场4楼'
      }],
      locaGrouplist: [{
        key: '江泰',
        value: '江泰'
      }, {
        key: '金汇',
        value: '金汇'
      }],
      editform: {
        groupName: '',
        checkList: []
      },
      tableData: [{
        name: '',
        deviceId: '139761',
        location: '江泰国际广场1楼',
        state: '在线',
        onlineIncome: '',
        tradNum: 10,
        adIncome: '',
        totalIncome: ''
      }, {
        name: '',
        deviceId: '139761',
        location: '江泰国际广场1楼',
        state: '离线',
        onlineIncome: '',
        tradNum: 10,
        adIncome: '',
        totalIncome: ''
      }],
      chartsDataResult: [],
      deviceNameDataResult: [],
      dateDataResult: [],
      tableMaxHeght: document.body.clientHeight - 40 - 20 - 40 - 40 - 52 - 53 + 13
    }
  },
  created: function () {
    this.pageQueSelInit()
    this.backQueDeviceStatis()
  },
  mounted: function () {
    var windowHeight = $(window).height()
    var windowWidth = $(window).width()
    var mainHeight = windowHeight - 40 - 20 - 40 // header mainOuterPadding tabs mainInPadding一侧bug
    $('.deviceInfoPage').height(mainHeight)
    $('.tableDiv').height(mainHeight - 40 - 52 - 53 + 13) // footer serachDiv mainInPadding一侧bug
    $('.tableDiv').width(windowWidth - 200 - 20 - 40) // 解决表格滚动条分页益处问题
    this.dataprocessing()
  },
  // 注销window.onresize事件
  destroyed () {
    window.onresize = null
  },
  methods: {
    // 相关数据处理
    dataprocessing: function () {
      if (this.checkedAll_loca) {
        this.checkList_loca = []
        for (let i = 0; i < this.locationlist.length; i++) {
          this.checkList_loca.push(this.locationlist[i].value)
        }
      }
      if (this.checkedAll_locaGroup) {
        this.checkList_locaGroup = []
        for (let i = 0; i < this.locaGrouplist.length; i++) {
          this.checkList_locaGroup.push(this.locaGrouplist[i].value)
        }
      }
    },
    // 时间格式转换
    GMTToStr: function (time) {
      let date = new Date(time)
      console.log(date)
      let Str = date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' +
      date.getDate() + ' ' +
      date.getHours() + ':' +
      date.getMinutes() + ':' +
      date.getSeconds()
      return Str
    },
    // popover输入搜索过滤
    popInputChange: function () {
      console.log('搜索过滤，popover视图改变')
    },
    changeCheck: function () {
      this.dataprocessing()
      if (this.checkedAll_loca) {
        this.poploca = ''
        for (let i = 0; i < this.locationlist.length; i++) {
          this.poploca = this.poploca + '' + this.locationlist[i].value
        }
      } else {
        this.poploca = ''
      }
    },
    changeCheckGroup: function () {
      if (this.checkList_loca.length !== this.locationlist.length) {
        this.checkedAll_loca = false
      }
      if (this.checkList_locaGroup.length !== this.locaGrouplist.length) {
        this.checkedAll_locaGroup = false
      }
      this.poploca = ''
      for (let i = 0; i < this.checkList_loca.length; i++) {
        this.poploca = this.poploca + '' + this.checkList_loca[i]
      }
    },
    // 总收益、交易笔数图表切换
    changeRadio: function () {
      if (this.isIncome) {
        console.log('收益')
        this.chartsDataResult.forEach(item => {
          item.data = item.incomeData
        })
        this.loaddiagram()
      } else {
        console.log('交易笔数')
        this.chartsDataResult.forEach(item => {
          item.data = item.orderData
        })
        this.loaddiagram()
      }
    },
    searchBt: function () {
      console.log(this.dateValue)
      if (this.dateValue) {
        this.param.beginDate = this.GMTToStr(this.dateValue[0])
        this.param.endDate = this.GMTToStr(this.dateValue[1])
      } else {
        this.pageQueSelInit()
      }
      this.param.deviceId = this.input_devId
      this.backQueDeviceStatis()
    },
    resetBt: function () {
      Routers.push({ path: '/home/blank' })
    },
    // 编辑产品信息按钮
    editGroup: function () {
      this.dialogTitle = '编辑分组'
      this.selectGroup = true
      this.dialogEditVisible = true
    },
    // 新增产品按钮
    addGroup: function () {
      this.dialogTitle = '添加分组'
      this.selectGroup = false
      this.editform = {
        groupName: '',
        checklist: []
      }
      this.dialogEditVisible = true
    },
    // 编辑分组对话框，编辑按钮
    diaEditBt: function (value) {
      console.log(value)
      this.editform = {
        groupName: value,
        checkList: ['江泰国际广场1楼', '江泰国际广场2楼', '江泰国际广场3楼', '江泰国际广场4楼']
      }
      this.selectGroup = false
    },
    // 编辑分组对话框，删除按钮
    diaDelBt: function (value) {
      this.$confirm('您确定删除该分组吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.backDelGroup()
      }).catch(() => {
      })
    },
    // 对话框修改确认
    editConfirm: function () {
      console.log(this.editform)
      if (this.dialogTitle === '添加分组') {
        console.log('添加分组')
      } else {
        console.log('修改')
      }
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.param.currentPage = value
      // 分页查询请求可选项置空函数
      this.pageQueSelInit()
      this.backQueDeviceStatis()
    },
    // 加载图表
    loaddiagram: function () {
      console.log(123)
      var diagramContainer = document.getElementById('diagram')
      var myChart = echarts.init(diagramContainer)
      console.log(this.deviceNameDataResult)
      console.log(this.dateDataResult)
      console.log(this.chartsDataResult)
      // 指定图表的配置项和数据
      // 折线图
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPoniter: {
            type: 'cross'
          }
        },
        dataZoom: [
          {
            type: 'inside', // 鼠标缩放
            start: 0,
            end: 100
          }
        ],
        legend: {
          left: 'left',
          data: this.deviceNameDataResult
        },
        xAxis: {
          data: this.dateDataResult
        },
        yAxis: {},
        series: this.chartsDataResult
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.onresize = function () {
        console.log('chartresize')
        myChart.resize()
      }
    },
    /*
      *
      *******************   API调用   *********************
      *
    */
    // 设备统计
    backQueDeviceStatis: function () {
      sessionSetStore('backName', '设备统计')
      back.queDeviceStatis(this.param).then(function (response) {
        console.log(response)
        // 设备详情数据存储
        this.eltotal = response.data.total
        let tableDataAlter = []
        if (response.data.records) {
          for (let i = 0; i < response.data.records.length; i++) {
            let obj = {}
            obj.name = response.data.records[i].deviceName
            obj.deviceId = response.data.records[i].deviceId
            obj.location = response.data.records[i].siteName
            obj.onlineIncome = response.data.records[i].onlineIncome
            obj.tradNum = response.data.records[i].orderNum
            obj.adIncome = response.data.records[i].advertIncome
            obj.totalIncome = response.data.records[i].totalIncome
            obj.stateNum = response.data.records[i].state
            if (obj.stateNum === 0) {
              obj.state = '离线'
            } else if (obj.stateNum === 1) {
              obj.state = '在线'
            }
            tableDataAlter.push(obj)
          }
        }
        this.tableData = tableDataAlter
        // 设备图表数据存储
        this.chartsDataResult = this.merge(response.deviceStatisTrendList)
        this.chartsDataResult.forEach(item => {
          this.deviceNameDataResult.push(item.name)
        })
        if (this.chartsDataResult) this.dateDataResult = this.chartsDataResult[0].date
        this.loaddiagram() // 必须等待back数据获取后再加载图表
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 分页查询请求可选项置空函数
    pageQueSelInit: function () {
      this.param.deviceId = ''
      this.param.siteId = ''
      this.param.beginDate = ''
      this.param.endDate = ''
      this.param.queryType = ''
    },
    backDelGroup: function () {
      console.log('删除产品')
    },
    // 数组对象合并
    merge: function (list) {
      let idArr = []
      for (let i = 0; i < list.length; i++) {
        if (idArr.indexOf(list[i].deviceId) === -1) {
          idArr.push(list[i].deviceId)
        }
      }
      let result = []
      for (let i = 0; i < idArr.length; i++) {
        let obj = {}
        let orderData = []
        let incomeData = []
        let deviceNameData = []
        let dateData = []
        for (let j = 0; j < list.length; j++) {
          if (idArr[i] === list[j].deviceId) {
            orderData.push(list[j].orderNum)
            incomeData.push(list[j].totalIncome)
            deviceNameData.push(list[j].deviceName)
            dateData.push(list[j].date)
          }
        }
        obj.deviceId = idArr[i]
        obj.name = deviceNameData[i]
        obj.type = 'line'
        obj.smooth = true
        obj.date = dateData
        obj.orderData = orderData
        obj.incomeData = incomeData
        obj.data = incomeData // 默认显示incomeData
        result.push(obj)
      }
      console.log(result)
      return result
    }
  }
}
</script>

<style scoped>
.deviceInfoPage {
  padding: 20px;
  background-color: white;
}
.flexbox1 {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: wrap;
  height: 40px;
}
.flexbox1 > div {
  height: 100%;
}
.flexbox {
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 30px;
  margin: 6px 0 16px 0;
}
.popdiv {
  border: 1px solid #ebeef5;
  margin: 5px;
}
.el-checkbox {
  margin: 5px 0;
}
.dividingLine {
  margin: 6px 10px 0 10px;
  color: #409eff;
}
.chartsRadio {
  margin: 20px 0;
}
#diagram {
  margin: 0 auto;
  width: 75vw;
  height: 66vh;
  border: 1px solid #ebeef5;
  padding:10px;
}
.deviceInfoPage >>> .el-dialog__header {
  background-color: #f4f4f4;
}
</style>
