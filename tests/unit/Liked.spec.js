import { mount } from '@vue/test-utils'
import Liked from '@/views/Liked.vue'

describe('Liked.vue', () => {
  const wrapper = mount(Liked)
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
    const i = {id: 0, liked: false}
    wrapper.vm.stateChange(i)
    i.liked = true
    wrapper.vm.stateChange(i)
  })
})