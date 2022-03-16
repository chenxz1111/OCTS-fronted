import { mount } from '@vue/test-utils'
import item from '@/components/draft.vue'

describe('draft.vue', () => {
  const wrapper = mount(item)
  it('has a button', () => {
    expect(wrapper.contains('el-button')).toBe(true)
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
  it('changepic', () => {
    wrapper.vm.pictures = []
    expect(wrapper.vm.firstpicture).toBe('https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg')
  })
})