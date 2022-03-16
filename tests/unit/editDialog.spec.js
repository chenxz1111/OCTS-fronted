import { mount } from '@vue/test-utils'
import editDialog from '@/components/editDialog.vue'

describe('editDialog.vue', () => {
  function $message() {}
  const wrapper = mount(editDialog,{
    mocks: {
       $message
    }
})
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
    wrapper.vm.draft_status = false
  })
  it('click save button', () => {
    wrapper.vm.draft_status = true
    const button = wrapper.findAll('el-button').at(1)
    button.trigger('click')
  })
  it('click cancel button', () => {
    const button = wrapper.findAll('el-button').at(2)
    button.trigger('click')
  })
  // it('handle upload', () => {
  //   const upload = wrapper.find('el-upload')
  //   //const file = new File()
  //   upload.trigger('on-change')
  // })
  // it('handle delete', () => {
  //   const upload = wrapper.findAll('el-upload').at(0)
  //   upload.trigger('on-remove')
  // })
  it('handle upload', () => {
    wrapper.vm.handleChange()
  })
  it('handle remove', () => {
    const file = { url: '' }
    wrapper.vm.handleRemove(file)
  })
  it('watch', () => {
    wrapper.vm.title = "title"
    wrapper.vm.introduction = "in"
  })
})