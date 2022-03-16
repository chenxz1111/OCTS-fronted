import { mount } from '@vue/test-utils'
import item from '@/components/item.vue'

describe('item.vue', () => {
  function $emit() {}
  const wrapper = mount(item, {
    mocks: {
      $emit
    }
  })
  it('has a button', () => {
    expect(wrapper.contains('el-button')).toBe(true)
  })

  it('click edit button', () => {
    const button = wrapper.findAll('el-button').at(0)
    button.trigger('click')
    expect(wrapper.vm.available).toBe(true)
    wrapper.vm.ddl = wrapper.vm.datetime + 1000000
    wrapper.vm.pp()
  })

  it('click upload button', () => {
    const button = wrapper.findAll('el-button').at(1)
    button.trigger('click')
    expect(wrapper.vm.available).toBe(true)
  })

  it('compute', () => {
    wrapper.vm.available = false
    expect(wrapper.vm.state).toBe('已下架')
  })

  it('changepic', () => {
    wrapper.vm.pictures = []
    expect(wrapper.vm.firstpicture).toBe('https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg')
  })
})
