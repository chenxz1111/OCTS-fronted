import { mount } from '@vue/test-utils'
import OrderList from '@/views/OrderList.vue'

describe('OrderList.vue', () => {
  const wrapper = mount(OrderList)
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

  it('click button', () => {
    const button = wrapper.findAll('el-button').at(0)
    button.trigger('click')
  })
  it('click button', () => {
    const button = wrapper.findAll('el-button').at(1)
    button.trigger('click')
  })
  // it('click button', () => {
  //   const button = wrapper.findAll('el-button').at(2)
  //   button.trigger('click')
  // })
  // it('click button', () => {
  //   const button = wrapper.findAll('el-button').at(3)
  //   button.trigger('click')
  // })

  it('methods', () => {
    for (let i = 0; i <= 5; i++) {
      wrapper.vm.computeState(i)
    }
  })
  it('methods', () => {
    const tmp = { orderid: 1, cost: 0}
    wrapper.vm.pay(tmp)
  })
  it('methods', () => {
    const tmp = { orderid: 1, cost: 0}
    wrapper.vm.received(tmp)
  })
  it('methods', () => {
    const tmp = { orderid: 1, cost: 0}
    wrapper.vm.confirmCancel(tmp)
    wrapper.vm.cancel()
  })
})