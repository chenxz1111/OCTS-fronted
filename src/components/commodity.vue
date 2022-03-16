<template>
  <div>
    <el-card :body-style="{ padding: '10px' }" shadow="hover" style="height: 220px">
      <el-container>
        <el-aside class="card_aside" width="170px">
          <el-image
            fit="cover"
            :src=firstpicture
            style="width: 155px; height: 155px"
          ></el-image>
        </el-aside>
        <el-main class="card_main" style="height:220px">
          <el-col :span="22">
            <div style="font-size:23px">
              {{title}}
              <el-tag :type="state_type" effect="plain" size="small">{{state}}</el-tag>
              {{ }}
              <el-tag :type="liked_type" effect="plain" size="small">{{liked_state}}</el-tag>
            </div>
            <el-rate v-model="averageRating" disabled show-score text-color="#ff9900" style="margin-top:5px"> </el-rate>
            <el-row style="height: 8px"></el-row>
            <div style="color:#04B404"><b><i v-if="this.datestr!=''" class="el-icon-present"></i>{{this.datestr}} </b></div>
            <el-row style="height: 8px"></el-row>
            <div style="color:rgb(255, 51, 0)">
              <b>现价:￥{{now_price}}</b>
            </div>
            <el-row style="height: 10px"></el-row>
            <div
              style="font-size:14px;color:rgb(140, 140, 140);text-decoration:line-through"
            >原价:￥{{old_price}}</div>
            <el-row style="height: 10px"></el-row>
            <div style="font-size:14px;color:rgb(140, 140, 140)">描述信息:{{introduction}}</div>
            <el-row style="height: 30px"></el-row>
            <el-row v-if="this.datestr==''" style="height: 10px"></el-row>
            <div style="font-size:10px;color:rgb(140, 140, 140)">销量: {{sell}} 库存: {{store}}</div>
          </el-col>
          <el-col :span="2">
            <el-row style="height: 20px"></el-row>
            <el-row style="height: 60px">
            <el-button @click="commodity()" circle icon="el-icon-shopping-cart-full" type="primary"></el-button>
            </el-row>
            <el-row style="height: 60px">
            <el-button @click="change_state()" circle :icon=icon_type :type=button_type></el-button>
            </el-row>
          </el-col>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'item',
  props: {
    id: {
      type: Number,
      default: -1
    },
    title: {
      type: String,
      default: () => ' '
    },
    now_price: {
      type: Number,
      default: () => 0
    },
    old_price: {
      type: Number,
      default: () => 199.99
    },
    introduction: {
      type: String,
      default: () => '这是一幅山水画卷图'
    },
    sell: {
      type: Number,
      default: () => 9999
    },
    store: {
      type: Number,
      default: () => 9999
    },
    pictures: {
      type: Array,
      default: () => ['https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg']
    },
    customer_name: {
      type: String,
      default: () => ''
    },
    liked: {
      type: Boolean,
      default: () => false
    },
    averageRating: {
      type: Number,
      default: () => 3.7
    },
    ppprice: {
      type: Number,
      default: () => 1.99 //  -----------------------> temp
    },
    ddl: {
      type: Number,
      default: () => 1620446657000 //  -----------------------> temp
    }
  },
  data () {
    return {
      timer: '',
      datetime: ''
    }
  },
  computed: {
    state: function () {
      if (this.store > 0) {
        return '可购买'
      } else {
        return '已售罄'
      }
    },
    liked_state: function () {
      if (this.liked) {
        return '已收藏'
      } else {
        return '未收藏'
      }
    },
    button_type: function () {
      if (this.liked) {
        return 'warning'
      } else {
        return ' '
      }
    },
    icon_type: function () {
      if (this.liked) {
        return 'el-icon-star-on'
      } else {
        return 'el-icon-star-off'
      }
    },
    state_type: function () {
      if (this.store > 0) {
        return 'success'
      } else {
        return 'danger'
      }
    },
    liked_type: function () {
      if (this.liked) {
        return 'warning'
      } else {
        return 'danger'
      }
    },
    firstpicture: function () {
      if (this.pictures.length > 0) {
        return 'api' + this.pictures[0]
      } else {
        return 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
      }
    },
    datestr: function () {
      var rightTime = this.ddl - this.datetime
      if (rightTime > 0) {
        var dd = Math.floor(rightTime / 1000 / 60 / 60 / 24)
        var hh = Math.floor((rightTime / 1000 / 60 / 60) % 24)
        var mm = Math.floor((rightTime / 1000 / 60) % 60)
        var ss = Math.floor((rightTime / 1000) % 60)
        var djstr = dd * 24 + hh + ':' + mm + ':' + ss
        return '￥' + this.ppprice + ' (' + djstr + ')'
      } else {
        return ''
      }
    }
  },
  created () {
    this.datetime = new Date().getTime()
  },
  mounted () {
    this.timer = setInterval(() => {
      this.datetime = new Date().getTime()
    }, 1000)
  },
  methods: {
    commodity () {
      this.$router.push({ path: '/commodity', query: { id: this.id } })
    },
    change_state () {
      this.$emit('statechange')
    }
  }
}
</script>

<style scoped>
.card_aside {
  background-color: rgb(255, 255, 255);
  color: #333;
  text-align: center;
  line-height: 315px;
  height: 500px;
}
.card_main {
  background-color: rgb(255, 255, 255);
  color: #333;
  text-align: left;
  height: 200px;
  line-height: 10px;
}
</style>
