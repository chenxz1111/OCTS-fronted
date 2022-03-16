import { mount } from '@vue/test-utils'
import rateDialog from '@/components/rateDialog.vue'

describe('rateDialog.vue', () => {
  const wrapper = mount(rateDialog)
  it('has a dialog', () => {
    expect(wrapper.contains('el-dialog')).toBe(true)
  })
  it('click confirm button', () => {
    const button = wrapper.findAll('el-button').at(0)
    button.trigger('click')
  })
  it('click cancel button', () => {
    const button = wrapper.findAll('el-button').at(1)
    button.trigger('click')
  })
})