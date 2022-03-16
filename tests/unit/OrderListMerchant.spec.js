import { mount } from '@vue/test-utils'
import OrderListMerchant from '@/views/OrderListMerchant.vue'

describe('OrderList.vue', () => {
  const wrapper = mount(OrderListMerchant)
  it('has a menu', () => {
    expect(wrapper.contains('el-menu')).toBe(true)
  })
  it('click menu button', () => {
    const button = wrapper.findAll('el-menu-item').at(0)
    button.trigger('click')
  })
  it('click menu button', () => {
    const button = wrapper.findAll('el-menu-item').at(2)
    button.trigger('click')
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
    for (let i = 0; i <= 5; i++) {
      wrapper.vm.getState(i)
    }
  })
  it('methods', () => {
    const tmp = { orderid: 1, cost: 0}
    wrapper.vm.send(tmp)
  })
  it('methods', () => {
    wrapper.vm.getFirstPicture()
  })
})