import { mount } from '@vue/test-utils'
import MerchantDraft from '@/views/MerchantDraft.vue'

describe('MerhcantDraft.vue', () => {
  const wrapper = mount(MerchantDraft)
  it('has a menu', () => {
    expect(wrapper.contains('el-menu')).toBe(true)
  })
  it('click menu button', () => {
    const button = wrapper.findAll('el-menu-item').at(0)
    button.trigger('click')
  })
  it('click menu button', () => {
    const button = wrapper.findAll('el-menu-item').at(1)
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
    const i = {id: 0, title: '', now_price: 0, available: false, old_price: 0, introduction: '', sell: 0, store: 0, pictures: ['x']}
    wrapper.vm.edit(i)
    const l = {length: 0}
    const d = ''
    wrapper.vm.edit_confirm(l, d)
    wrapper.vm.draft_confirm(l, d)
    wrapper.vm.edit_cancel()
    wrapper.vm.create_draft(d, d, d, d, d, l)
  })
})