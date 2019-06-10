<template>
  <div class="placePage">
    <div class="flexbox1">

      <div>
        <div>
          <span style="margin-right:5px;">日期</span>
          <el-date-picker
            v-model="dateValue"
            type="datetimerange"
            size="small"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div>
          <el-button type="text" size="small">今天</el-button>
          <span class="dividingLine">|</span>
          <el-button type="text" size="small">昨日</el-button>
          <span class="dividingLine">|</span>
          <el-button type="text" size="small">本周</el-button>
          <span class="dividingLine">|</span>
          <el-button type="text" size="small">本月</el-button>
        </div>
      </div>

      <div>
        <div style="display: -webkit-flex;display: flex;flex-wrap: nowrap;margin-left:20px;">
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
        </div>
        <div>
          <el-button type="text" size="small" @click="addGroup">添加分组</el-button>
          <span class="dividingLine">|</span>
          <el-button type="text" size="small" @click="editGroup">编辑分组</el-button>
        </div>
      </div>
    </div>

    <div class="flexbox" style="margin:5px 0 10px 0;">
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
      <el-table
        :header-cell-style="{'font-size':'14px'}"
        :data="tableData"
        stripe
        border
        size="small"
        style="width: 100%;font-size:12px;">
        <el-table-column
          align="center"
          prop="location"
          label="投放地址">
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceNum"
          label="设备数量">
        </el-table-column>
        <el-table-column
          align="center"
          prop="tradeNumber"
          label="交易笔数">
        </el-table-column>
        <el-table-column
          align="center"
          prop="onlineIncome"
          label="在线支付">
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

      <el-pagination
        @current-change="handlePaginationChange"
        :current-page="currentPage"
        :page-size="pagesize"
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
import echarts from 'echarts'
import $ from 'jquery'
import Routers from '@/router'
export default {
  data () {
    return {
      currentPage: 1,
      pagesize: 10,
      eltotal: 20,
      dialogEditVisible: false,
      dialogTitle: '',
      dateValue: '',
      popoverInput: '',
      poploca: '全部',
      checkedAll_loca: true,
      checkedAll_locaGroup: true,
      checkList_loca: [],
      checkList_locaGroup: [],
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
        location: '江泰国际广场1楼',
        deviceNum: 6,
        tradeNumber: 2,
        onlineIncome: '',
        adIncome: '',
        totalIncome: ''
      }, {
        location: '江泰国际广场2楼',
        deviceNum: 4,
        tradeNumber: 1,
        onlineIncome: '',
        adIncome: '',
        totalIncome: ''
      }],
      incomeCharts: {
        xdata: ['02-21', '02-22', '02-23', '02-24', '02-25', '02-26', '02-27'],
        ydata1: [2, 5, 6, 2, 5, 8, 3],
        ydata2: [0, 0, 0, 0, 0, 0, 0]
      },
      dealNumCharts: {
        xdata: ['02-21', '02-22', '02-23', '02-24', '02-25', '02-26', '02-27'],
        ydata1: [1, 2, 4, 1, 3, 5, 3],
        ydata2: [0, 0, 0, 0, 0, 0, 0]
      }
    }
  },
  mounted: function () {
    var windowHeight = $(window).height()
    var mainHeight = windowHeight - 120
    $('.placePage').height(mainHeight)
    $('.el-table').height(mainHeight - 150)
    this.dataprocessing()
    this.loaddiagram(this.incomeCharts)
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
        this.loaddiagram(this.incomeCharts)
        console.log('收益')
      } else {
        this.loaddiagram(this.dealNumCharts)
        console.log('交易笔数')
      }
    },
    searchBt: function () {
      console.log(this.GMTToStr(this.dateValue[0]))
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
    handlePaginationChange: function (value) {
      console.log(value)
    },
    // 加载图表
    loaddiagram: function (data) {
      let xdata = data.xdata
      let ydata1 = data.ydata1
      let ydata2 = data.ydata2
      var diagramContainer = document.getElementById('diagram')
      var myChart = echarts.init(diagramContainer)
      // 指定图表的配置项和数据
      // 折线图
      var option = {
        // title: {
        //   text: '总收益',
        //   x: 'center'
        // },
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
        color: ['#303133', '#c23531'],
        legend: {
          left: 'left',
          data: ['1号机', '2号机']
        },
        xAxis: {
          data: xdata
        },
        yAxis: {},
        series: [{
          name: '1号机',
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#303133'
              }
            }
          },
          data: ydata1
        }, {
          name: '2号机',
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#c23531'
              }
            }
          },
          data: ydata2
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
      window.onresize = function () {
        console.log('chartresize')
        myChart.resize()
      }
    },
    //
    // *******************   API调用   *********************
    //
    backDelGroup: function () {
      console.log('删除产品')
    }
  }
}
</script>

<style scoped>
.placePage {
  padding: 20px;
  background-color: white;
}
.flexbox1 {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: wrap;
}
.flexbox {
  display: -webkit-flex;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
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
.placePage >>> .el-dialog__header {
  background-color: #f4f4f4;
}
.el-pagination {
  margin: 20px 20px 0 0;
  float: right;
}
</style>
