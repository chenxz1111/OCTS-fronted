import { mount } from '@vue/test-utils'
import Customer from '@/views/Customer.vue'

describe('Customer.vue', () => {
  const wrapper = mount(Customer)
  it('has a menu', () => {
    expect(wrapper.contains('el-menu')).toBe(true)
  })
  it('click menu button', () => {
    const button = wrapper.findAll('el-menu-item').at(3)
    button.trigger('click')
  })
  it('has a main', () => {
    const button = wrapper.findAll('el-pagination').at(0)
    button.trigger('current-change')
  })
  it('methods', () => {
    wrapper.vm.backpg1()
    const sort = ['价格亲民', '销量火爆', '购买率高', '打折力度', '速来秒杀', '名称排序', '描述详细', '图片丰富', '库存富裕', '原始价格', '全部商品']
    for (let i = 0; i < sort.length; i++) {
      wrapper.vm.sort(sort[i])
    }
    const i = {id: 0, title: '', now_price: 0, liked: false, old_price: 0, introduction: '', sell: 0, store: 0, pictures: ['x']}
    // wrapper.vm.edit(i)
    // const l = {length: 0}
    // const d = ''
    // wrapper.vm.edit_confirm(l, d)
    wrapper.vm.stateChange(i)
    i.liked = true
    wrapper.vm.stateChange(i)
    wrapper.vm.onEnterSearch()
    // wrapper.vm.create_cancel()
    // wrapper.vm.create_confirm(d, d, d, d, d, l)
    // wrapper.vm.create_draft(d, d, d, d, d, l)
    wrapper.vm.select(1)
  })
})