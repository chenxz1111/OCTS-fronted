<template>
  <div>
      <el-menu default-active="2" class="el-menu-demo" mode="horizontal" active-text-color="#EE7947">
          <el-col :offset="0" :span="3">
              <el-image
                :fit="'fill'"
                :src="require('../assets/logo.png')"
                style="margin: 2px"
                 @click="$router.push('/merchant')"
              />
            </el-col>
  <el-menu-item index="1" @click="itemlist()" >商品列表</el-menu-item>
  <el-menu-item index="2" >订单列表</el-menu-item>
  <el-menu-item index="3" @click="draftlist()">草稿箱</el-menu-item>
  <el-menu-item index="4" style="float:right" @click="waybackHome()"><font color=#EE7947><strong>返回登录</strong></font></el-menu-item>
  <div style="float:right; margin:15px">
    <el-tag effect='plain' type='warning'><i class="el-icon-coin"></i>￥{{this.income}}</el-tag>
  </div>
</el-menu>
    <el-row style="height: 50px"></el-row>
    <el-container>
      <el-col :offset="1" :span="22">
        <el-card>
          <el-main>
            <el-row>
              <!-- <font size="7">商 户 订 单 页</font> -->
              <el-table :data="nowTable" :header-cell-style="{background:'#F8E6E0'}">
                <el-table-column align="center" label="订单信息">
                  <template slot-scope="scope">
                    <el-row>
                      <el-col :span="4">
                        <el-image
                          :src="scope.row.picture"
                          fit="cover"
                          style="width: 50px; height: 50px"
                        ></el-image>
                      </el-col>
                      <el-col :span="19" :offset="1">
                        <el-row style="padding: 4px; font-size: large; text-align: left">
                          <font color="#EE7947">{{ scope.row.title }}</font>
                        </el-row>
                        <el-row style="font-size: small; text-align: left">
                          <font color="#777777">订单号：{{ scope.row.orderid }}</font>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="下单用户" prop="user" width="200"></el-table-column>
                <el-table-column align="center" label="下单时间" prop="time" width="200"></el-table-column>
                <el-table-column align="center" label="数量" prop="quantity" width="100"></el-table-column>
                <el-table-column align="center" label="金额" prop="cost" width="100"></el-table-column>
                <el-table-column align="center" label="状态" prop="state" width="100"></el-table-column>
                <el-table-column align="left" label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="small"
                      plain
                      v-if="scope.row.state==='待发货'"
                      v-on:click="send(scope.row)"
                    >发货</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="height: 80px"></el-row>
            </el-row>
            <el-pagination
            :total="totalPage"
            @current-change="currentChange"
            background
            layout="prev, pager, next"
            :hide-on-single-page="true"
          ></el-pagination>
          </el-main>
        </el-card>
      </el-col>
    </el-container>
    <el-row style="height: 50px"></el-row>
    <el-footer>@JDI2021SE</el-footer>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Order',
  props: {
  },
  data () {
    return {
      id: Number,
      token: '',
      tableData: [],
      nowPage: 1
    }
  },
  mounted () {
    this.token = localStorage.getItem('merchantToken')
    axios.post('api/display_money/', {
      role: 'merchant',
      name: 'merchant',
      token: this.token
    }).then(res => {
      // console.log(res.data)
      this.income = res.data.data.toFixed(2)
    }).catch(error => {
      console.log(error.response.status)
    })
    axios.get('api/orderlist/').then(res => {
      // console.log(res.data)
      if (res.data.code === 200) {
        // console.log(res.data.data)
        const list = res.data.data
        list.forEach(order => {
          var d = new Date()
          d.setTime(order.date * 1000)
          let picture = 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
          if (order.pictures.length > 0) {
            picture = 'api' + order.pictures[0]
          }
          this.tableData.push({
            title: order.name,
            user: order.user,
            orderid: order.orderid,
            time: d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(2),
            quantity: order.count,
            cost: order.cost.toFixed(2),
            picture: picture,
            state: this.getState(order.state)
          })
        })
      }
    })
  },
  methods: {
    itemlist () {
      this.$router.push('/merchant')
    },
    draftlist () {
      this.$router.push('/merchantdraft')
    },
    getFirstPicture (goodid) {
      // axios.get('https://octs-backend-justdebugit.app.secoder.net/details/' + (goodid + '')).then(res => {
      //   this.firstPicture = 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
      //   if (res.data.code === 200) {
      //     const pictures = res.data.data.pictures
      //     if (pictures.length > 0) {
      //       this.firstPicture = 'https://octs-backend-justdebugit.app.secoder.net' + pictures[0]
      //     }
      //   }
      // })
      // return this.firstPicture
      return 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
    },
    getState (stateID) {
      let state
      switch (stateID) {
        case 0:
          state = '待付款'
          break
        case 1:
          state = '待发货'
          break
        case 2:
          state = '待收货'
          break
        case 3:
          state = '已收货'
          break
        case 4:
          state = '已取消'
          break
        default:
          state = '未知'
      }
      return state
    },
    send (orderinfo) {
      // console.log(orderinfo)
      axios.post('api/orderstate/', {
        // username: this.username,
        orderid: orderinfo.orderid,
        change: 2
      }).then(res => {
        //   if (res.data.code === 200) {
        //     this.alertDialog.text = '支付成功'
        //     this.alertDialog.dialogVisible = true
        //   }
        // }).catch(error => {
        //   console.log(error.response.status)
        //   this.alertDialog.text = error.response.data.data
        location.reload()
      })
      // this.alertDialog.dialogVisible = true
    },
    currentChange (val) {
      this.nowPage = val
    },
    waybackHome () {
      sessionStorage.clear()
      localStorage.removeItem('merchantToken')
      this.$router.push('/')
    }
  },
  computed: {
    nowTable: function () {
      if (this.nowPage * 10 >= this.tableData.length) {
        return this.tableData.slice((this.nowPage - 1) * 10)
      } else {
        return this.tableData.slice((this.nowPage - 1) * 10, this.nowPage * 10)
      }
    },
    totalPage: function () {
      return Math.ceil(this.tableData.length / 10) * 10
    }
  }
}
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #EE7947;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 60px;
}
.el-table {
  margin: 4%;
  width: 92%;
}
</style>
