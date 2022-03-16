<template>
  <div>
    <el-menu active-text-color="#EE7947" class="el-menu-demo" default-active="1" mode="horizontal">
      <el-col :offset="0" :span="3">
        <el-image
          :fit="'fill'"
          :src="require('../assets/logo.png')"
          @click="$router.push('/')"
          style="margin: 2px"
        />
      </el-col>
      <!-- <el-submenu index="2"> -->
      <div style="float:left; margin:20px; font-size:14px; user-select: none" v-if="isLogin">您好：{{username}}</div>
      <div style="float:left; margin:20px; font-size:14px; user-select: none" @click="exit()" v-if="!isLogin">您好，请登录</div>
      <el-menu-item @click="$router.push('/')" index="2-1">商品列表</el-menu-item>
      <el-menu-item index="1">我的订单</el-menu-item>
      <el-menu-item @click="$router.push('/customerliked')" index="2-2" v-if="isLogin">我的收藏</el-menu-item>
      <el-menu-item index="5" style="float:right" @click="exit()"><font color=#EE7947><strong>
        <span v-if="isLogin">退出登录</span>
        <span v-if="!isLogin">登录 / 注册</span>
        </strong></font></el-menu-item>
      <div style="float:right; margin:15px" v-if="isLogin">
        <el-tag type="warning" effect="dark">余额：￥{{money_display}}</el-tag>
      </div>
      <!-- </el-submenu> -->
    </el-menu>
    <el-row style="height: 50px"></el-row>
    <el-container>
      <el-main>
        <el-col :offset="1" :span="22">
          <el-card>
            <el-row>
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
                      <el-col :offset="1" :span="19">
                        <el-row style="padding: 4px; font-size: large; text-align: left">
                          <font color="#EE7947">{{ scope.row.title }}</font>
                        </el-row>
                        <el-row style="font-size: x-small; text-align: left">
                          <font color="#777777">订单号：{{ scope.row.orderid }}</font>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="下单时间" prop="time" width="200"></el-table-column>
                <el-table-column align="center" label="数量" prop="quantity" width="100"></el-table-column>
                <el-table-column align="center" label="金额" prop="cost" width="100"></el-table-column>
                <el-table-column align="center" label="状态" prop="state" width="100"></el-table-column>
                <el-table-column align="center" label="操作" width="80">
                  <template slot="header">
                    操作
                    <el-tooltip class="item" effect="dark" placement="top">
                      <i class="el-icon-question" />
                      <div slot="content" style="text-align:center">
                        确认收货前可无条件取消订单
                        <br />收货后暂时无法取消
                      </div>
                    </el-tooltip>
                  </template>
                  <template slot-scope="scope">
                    <el-row>
                      <el-button
                        size="small"
                        type="text"
                        v-if="scope.row.state==='待付款'"
                        v-on:click="pay(scope.row)"
                      >支付</el-button>
                    </el-row>
                    <el-row>
                      <el-button
                        size="small"
                        type="text"
                        v-if="scope.row.state==='待收货'"
                        v-on:click="received(scope.row)"
                      >确认收货</el-button>
                    </el-row>
                    <el-row>
                      <el-button
                        size="small"
                        type="text"
                        v-if="scope.row.state!=='已取消'&&scope.row.state!=='已收货'"
                        v-on:click="confirmCancel(scope.row)"
                      >取消订单</el-button>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
              <el-row style="height: 80px"></el-row>
            </el-row>
            <el-pagination
              :hide-on-single-page="true"
              :total="totalPage"
              @current-change="currentChange"
              background
              layout="prev, pager, next"
            ></el-pagination>
          </el-card>
        </el-col>
      </el-main>
    </el-container>
    <el-row style="height: 50px"></el-row>
    <el-container>
      <el-footer>@JDI2021SE</el-footer>
    </el-container>
    <el-dialog :visible.sync="alertDialog.dialogVisible" style="text-align: center" width="40%">
      <el-row style="height: 20px"></el-row>
      <font size="4">{{alertDialog.text}}</font>
      <el-row style="height: 100px"></el-row>
      <div v-if="alertDialog.type==='cancel'">
        <el-row>
          <el-col :offset="5" :span="5">
            <el-button @click="cancel()" type="primary">确认取消</el-button>
          </el-col>
          <el-col :offset="4" :span="5">
            <el-button @click="alertDialog.dialogVisible = false">我再想想</el-button>
          </el-col>
        </el-row>
        <el-row style="height: 100px"></el-row>
      </div>
    </el-dialog>
    <rateDialog
      v-bind:dialogVisible="this.rateDialogVisible"
      v-bind:orderid="this.passorderid"
    />
  </div>
</template>

<script>
import axios from 'axios'
import rateDialog from '@/components/rateDialog'
export default {
  name: 'Order',
  props: {
  },
  components: {
    rateDialog
  },
  data () {
    return {
      id: Number,
      username: '',
      token: '',
      income: 0,
      tableData: [],
      nowPage: 1,
      money: Number,
      isLogin: Boolean,
      alertDialog: {
        type: '',
        text: '',
        dialogVisible: false
      },
      orderinfo_focus: {},
      rateDialogVisible: false,
      passorderid: Number
      // for UI display
      // {
      //   title: '特级苹果',
      //   orderID: 12259997,
      //   time: '2021-04-07',
      //   quantity: '3',
      //   cost: '27.06'
      // },
      // {
      //   title: '清华园的花粉',
      //   orderID: 12259258,
      //   time: '2021-04-03',
      //   quantity: '99',
      //   cost: '29.70'
      // }
    }
  },
  mounted () {
    this.username = localStorage.getItem('name')
    this.token = localStorage.getItem('userToken')
    // this.money = parseFloat(localStorage.getItem('money'))
    axios.post('api/is_login/', {
      user: 'user',
      token: this.token
    }).then(res => {
      if (res.data.data === 'success') this.isLogin = true
    }).catch(error => {
      console.log(error.response)
      this.isLogin = false
    })
    axios.post('api/display_money/', {
      role: 'user',
      name: this.username,
      token: this.token
    }).then(res => {
      // console.log(res.data)
      this.money = res.data.data
    }).catch(error => {
      console.log(error.response.status)
    })
    axios.post('api/userorder/', {
      username: this.username,
      token: this.token
    }).then(res => {
      if (res.data.code === 200) {
        const list = res.data.data
        list.forEach(order => {
          var d = new Date()
          d.setTime(order.date * 1000)
          // console.log(order)
          let picture = 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
          if (order.pictures.length > 0) {
            picture = 'api' + order.pictures[0]
          }
          this.tableData.push({
            title: order.name,
            orderid: order.orderid,
            time: d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(2),
            quantity: order.count,
            cost: order.cost.toFixed(2),
            goodid: order.goodid,
            picture: picture,
            state: this.computeState(order.state)
          })
        })
      }
    })
  },
  methods: {
    computeState (stateID) {
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
    pay (orderinfo) {
      console.log(orderinfo)
      this.alertDialog.type = 'pay'
      axios.post('api/pay/', {
        username: this.username,
        token: this.token,
        orderid: orderinfo.orderid,
        cost: orderinfo.cost - 0
      }).then(res => {
        if (res.data.code === 200) {
          this.alertDialog.text = '支付成功'
          this.alertDialog.dialogVisible = true
        }
        location.reload()
      }).catch(error => {
        this.alertDialog.text = error.response.data.data
        if (error.response.data.data === 'message is invalid') this.alertDialog.text = '非法请求'
        if (error.response.data.data === 'user doesn\'t login') this.alertDialog.text = '请您先登录'
        if (error.response.data.data === 'user or good doesn\'t exist') this.alertDialog.text = '用户或商品不存在'
        if (error.response.data.data === 'good doesn\'t exist') this.alertDialog.text = '商品已下架'
        if (error.response.data.data === 'money is not enough') this.alertDialog.text = '余额不足'
        if (error.response.data.data === 'your order has been paid') this.alertDialog.text = '订单已支付'
        this.alertDialog.dialogVisible = true
      })
      // this.alertDialog.dialogVisible = true
    },
    received (orderinfo) {
      console.log(orderinfo)
      axios.post('api/orderstate/', {
        username: this.username,
        token: this.token,
        orderid: orderinfo.orderid,
        change: 3
      }).then(res => {
        //   if (res.data.code === 200) {
        //     this.alertDialog.text = '支付成功'
        //     this.alertDialog.dialogVisible = true
        //   }
        // }).catch(error => {
        //   console.log(error.response.status)
        //   this.alertDialog.text = error.response.data.data
        // location.reload()
        this.passorderid = orderinfo.orderid
        this.rateDialogVisible = true
      })
      // this.alertDialog.dialogVisible = true
    },
    confirmCancel (orderinfo) {
      this.orderinfo_focus = orderinfo
      this.alertDialog.type = 'cancel'
      this.alertDialog.text = '你真的要取消订单吗？'
      this.alertDialog.dialogVisible = true
    },
    cancel () {
      axios.post('api/cancel_order/', {
        token: this.token,
        orderid: this.orderinfo_focus.orderid,
        change: 4
      }).then(res => {
        location.reload()
      })
    },
    currentChange (val) {
      this.nowPage = val
    },
    exit () {
      sessionStorage.clear()
      localStorage.removeItem('name')
      localStorage.removeItem('userToken')
      this.$router.push('/')
    },
    comment_confirm (ra, or, co) {
      var formdata = new FormData()
      formdata.append('username', this.username)
      formdata.append('token', this.token)
      formdata.append('orderid', or)
      formdata.append('rating', ra)
      formdata.append('comment', co)
      axios.post('api/comment/', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res)
      })
      this.rateDialogVisible = false
      location.reload()
    },
    comment_cancel () {
      this.rateDialogVisible = false
      location.reload()
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
    },
    money_display () {
      return parseFloat(this.money).toFixed(2)
    }
  }
}
</script>

<style scoped>
.el-header,
.el-main {
  height: 560px;
}
.el-footer {
  background-color: #ee7947;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 60px;
}
.el-table {
  margin: 4%;
  width: 92%;
}
</style>
