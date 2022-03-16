<template>
<div>
      <el-card :body-style="{ padding: '10px' }" style="height: 190px" shadow="hover">
  <el-container>
    <el-aside class='card_aside' width='170px'>
      <el-image
      style="width: 155px; height: 155px"
      :src=firstpicture
      fit="cover"></el-image>
    </el-aside>
    <el-main class='card_main'>
      <el-col :span="22">
<div style="font-size:23px">{{title}}</div>
<el-row style="height: 18px"></el-row>
<div style="color:rgb(255, 51, 0)"><b>现价:￥{{now_price}}</b></div>
<el-row style="height: 10px"></el-row>
<div style="font-size:14px;color:rgb(140, 140, 140)">原价:￥{{old_price}}</div>
<el-row style="height: 59px"></el-row>
</el-col>
<el-col :span="2">
<el-row style="height: 20px"></el-row>
  <el-row style="height: 120px">
  <el-button name="editbutton" type="primary" icon="el-icon-edit" @click="edit()" circle></el-button>
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
      default: () => 0
    },
    available: {
      type: Boolean,
      default: () => false
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
    }
  },
  data () {
    return {

    }
  },
  computed: {
    // state: function () {
    //   if (this.available) {
    //     return '可购买'
    //   } else {
    //     return '已下架'
    //   }
    // },
    // state_type: function () {
    //   if (this.available) {
    //     return 'success'
    //   } else {
    //     return 'danger'
    //   }
    // },
    // button_type: function () {
    //   if (this.available) {
    //     return 'danger'
    //   } else {
    //     return 'success'
    //   }
    // },
    // icon_type: function () {
    //   if (this.available) {
    //     return 'el-icon-sold-out'
    //   } else {
    //     return 'el-icon-sell'
    //   }
    // },
    firstpicture: function () {
      if (this.pictures.length > 0) {
        return 'api' + this.pictures[0]
      } else {
        return 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
      }
    }
  },
  methods: {
    edit () {
      this.$emit('showdialog')
    }
    // change_state () {
    //   this.$emit('statechange')
    // }
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
