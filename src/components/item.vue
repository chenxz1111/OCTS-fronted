<template>
<div>
      <el-card :body-style="{ padding: '10px' }" style="height: 190px" shadow="hover" >
  <el-container>
    <el-aside class='card_aside' width='170px'>
      <el-image
      style="width: 155px; height: 155px"
      :src=firstpicture
      fit="cover"></el-image>
    </el-aside>
    <el-main class='card_main'>
      <el-col :span="22">
<div style="font-size:23px">{{title}}   <el-tag :type=state_type size="small" effect="plain" >{{state}}</el-tag></div>
<el-row v-if="this.datestr!=''" style="height: 8px"></el-row>
<div style="color:#04B404"><b><i v-if="this.datestr!=''" class="el-icon-present"></i>{{this.datestr}} </b></div>
<el-row style="height: 10px"></el-row>
<div style="color:rgb(255, 51, 0)"><b>现价:￥{{now_price}}</b></div>
<el-row style="height: 10px"></el-row>
<div style="font-size:14px;color:rgb(140, 140, 140)">原价:￥{{old_price}}</div>
<el-row style="height: 40px"></el-row>
<el-row v-if="this.datestr==''" style="height: 25px"></el-row>
<div style="font-size:10px;color:rgb(140, 140, 140)">销量: {{sell}}</div>
</el-col>
<el-col :span="2">
<el-row style="height: 1px"></el-row>
  <el-row style="height: 50px">
  <el-button name="editbutton" type="primary" icon="el-icon-edit" @click="edit()" circle></el-button>
  </el-row>
  <el-row style="height: 50px">
  <el-button :type=button_type :icon=icon_type @click="change_state()" circle></el-button>
  </el-row>
  <el-button type="warning" icon="el-icon-present"  circle @click="pp()"></el-button>
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
      default: () => '山水画卷图'
    },
    now_price: {
      type: Number,
      default: () => 99.99
    },
    old_price: {
      type: Number,
      default: () => 199.99
    },
    sell: {
      type: Number,
      default: () => 9999
    },
    available: {
      type: Boolean,
      default: () => true
    },
    store: {
      type: Number,
      default: () => 9999
    },
    introduction: {
      type: String,
      default: () => '山水画卷图就是一幅画。'
    },
    pictures: {
      type: Array,
      default: () => ['https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg']
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
      if (this.available) {
        return '可购买'
      } else {
        return '已下架'
      }
    },
    state_type: function () {
      if (this.available) {
        return 'success'
      } else {
        return 'danger'
      }
    },
    button_type: function () {
      if (this.available) {
        return 'danger'
      } else {
        return 'success'
      }
    },
    icon_type: function () {
      if (this.available) {
        return 'el-icon-sold-out'
      } else {
        return 'el-icon-sell'
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
    edit () {
      this.$emit('showdialog')
    },
    change_state () {
      this.$emit('statechange')
    },
    pp () {
      this.$emit('showpp')
    }
  }
}
</script>

<style>
.card_aside{
  background-color: rgb(255, 255, 255);
  color: #333;
  text-align: center;
  line-height: 315px;
  height: 500px;
}
.card_main{
  background-color: rgb(255, 255, 255);
  color: #333;
  text-align: left;
  height: 200px;
  line-height: 10px;
}
</style>
