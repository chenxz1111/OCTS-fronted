import { mount } from '@vue/test-utils'
import createDialog from '@/components/createDialog.vue'

describe('editDialog.vue', () => {
  const wrapper = mount(createDialog)
  it('has a dialog', () => {
    expect(wrapper.contains('el-dialog')).toBe(true)
  })
  it('click confirm button', () => {
    const button = wrapper.findAll('el-button').at(0)
    button.trigger('click')
    wrapper.vm.old_price = 1
    button.trigger('click')
    wrapper.vm.now_price = 1
    button.trigger('click')
    wrapper.vm.store = 1
    button.trigger('click')
  })
  it('click save button', () => {
    const button = wrapper.findAll('el-button').at(1)
    button.trigger('click')
  })
  it('click cancel button', () => {
    const button = wrapper.findAll('el-button').at(2)
    button.trigger('click')
    wrapper.vm.handleChange()
    wrapper.vm.handleRemove()
  })
})