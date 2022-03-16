import { mount } from '@vue/test-utils'
import item from '@/components/commodity.vue'

describe('commodity.vue', () => {
  const wrapper = mount(item)
  it('has a button', () => {
    expect(wrapper.contains('el-button')).toBe(true)
  })

  it('click buy button', () => {
    const button = wrapper.findAll('el-button').at(0)
    button.trigger('click')
  })
  it('click liked button', () => {
    const button = wrapper.findAll('el-button').at(1)
    button.trigger('click')
  })

  it('changepic', () => {
    wrapper.vm.pictures = []
    expect(wrapper.vm.firstpicture).toBe('https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg')
  })

  it('methods', () => {
    wrapper.vm.store = 0
    wrapper.vm.liked = true
    wrapper.vm.ddl = wrapper.vm.datetime + 1000000
  })
})
