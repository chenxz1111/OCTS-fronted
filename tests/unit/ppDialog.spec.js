import { mount } from '@vue/test-utils'
import ppDialog from '@/components/ppDialog.vue'

describe('ppDialog.vue', () => {
  const wrapper = mount(ppDialog)
  it('has a dialog', () => {
    expect(wrapper.contains('el-dialog')).toBe(true)
  })
  it('click confirm button', () => {
    wrapper.vm.available = true
    wrapper.vm.ppprice = 1
    wrapper.vm.confirm()
    // expect(wrapper.vm.ppprice).toBe('')
    // expect(wrapper.vm.date).toBe('')
    wrapper.vm.available = true
    wrapper.vm.ppprice = 0
    wrapper.vm.confirm()
    wrapper.vm.available = false
    wrapper.vm.confirm()
  })
  it('click cancel button', () => {
    const button = wrapper.findAll('el-button').at(1)
    button.trigger('click')
  })
})