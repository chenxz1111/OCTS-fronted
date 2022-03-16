<template>
<div>
<el-dialog
  title="来对商品评价一下吧~"
  :visible.sync="dialogVisible"
  width="40%"
  :showClose="false"
  >
  <el-form label-position="left" >
    <el-form-item label="">
      <el-rate
        v-model="rating"
        :colors="colors">
      </el-rate>
    </el-form-item>
    <el-form-item label="评价">
        <el-input type="textarea" style="width:280px" v-model="comment">
          {{ comment }}
        </el-input>
      </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="confirm()">确定</el-button>
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
    orderid: {
      type: Number,
      default: () => -1
    },
    comment: {
      type: String,
      default: () => '这个商品也太赞了吧！'
    }
  },
  data () {
    return {
      rating: 5,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  },
  methods: {
    confirm () {
      const c = this.comment
      const r = this.rating
      const o = this.orderid
      this.comment = '这个商品也太赞了吧！'
      this.rating = 5
      this.$parent.comment_confirm(r, o, c)
    },
    cancel () {
      this.comment = '这个商品也太赞了吧！'
      this.rating = 5
      this.$parent.comment_cancel()
    }
  }
}
</script>

<style>
.el-upload-list__item {
  transition: none !important;
}
</style>
