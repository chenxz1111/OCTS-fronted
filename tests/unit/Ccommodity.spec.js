import { mount } from '@vue/test-utils'
import Commodity from '@/views/Commodity.vue'


describe('Commodity.vue', () => {
    function $notify() {}
    const $route = { 
        query: {}
    }
    const $router = { 
        push() {}
    }
    const wrapper = mount(Commodity,{
        mocks: {
            $route,
            $router,
            $notify
        }
    })
    it('click menu button', () => {
        wrapper.vm.mainpage()
        wrapper.vm.store = 1
        wrapper.vm.money = 5.552
        wrapper.vm.orderpage()
        wrapper.vm.likedpage()
        wrapper.vm.exit()
        wrapper.vm.handleChange('')
        wrapper.vm.makeOrder()
        wrapper.vm.star(1)
        wrapper.vm.open('')
        wrapper.vm.isLogin = true
        wrapper.vm.makeOrder()
        wrapper.vm.poll()
        wrapper.vm.comment_status = '打开'
        wrapper.vm.poll()
      })
})