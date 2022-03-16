<template>
<div>
<el-dialog
  title="抢购活动"
  :visible.sync="dialogVisible"
  width="60%"
  :showClose="false"
  >
  <el-form>
    <el-form-item label="活动特价">
        <el-input style="width:280px" v-model="ppprice">
          {{ ppprice }}
        </el-input>
    </el-form-item>
     <el-form-item label="截止时间">
      <el-date-picker style="width:280px" type="datetime" value-format="timestamp" v-model="date" placeholder="选择日期"  ></el-date-picker>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="confirm()">设定</el-button>
    <el-button @click="cancel()">取消</el-button>
  </el-form-item>
</el-form>

</el-dialog>
</div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    id: {
      type: Number,
      default: () => -1
    },
    available: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      ppprice: '',
      date: ''
    }
  },
  methods: {
    confirm () {
      if (this.available) {
        if (this.ppprice > 0) {
          if (this.date > new Date().getTime()) {
            this.$parent.pp_confirm(this.id, this.ppprice, this.date)
            this.ppprice = ''
            this.date = ''
          } else {
            alert('请输入当前时间之后的截止时间')
          }
        } else {
          alert('活动特价必须输入不小于零的数字')
        }
      } else {
        alert('请先上架商品')
      }
    },
    cancel () {
      this.$parent.pp_cancel()
      this.ppprice = ''
      this.date = ''
    }
  }
}
</script>

<style>
.el-upload-list__item {
  transition: none !important;
}
</style>
