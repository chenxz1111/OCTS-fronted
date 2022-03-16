import { mount } from '@vue/test-utils'
import Order from '@/views/Order.vue'

describe('Order.vue', () => {
    const $route = { 
        query: { id: 2, buy_num: 3 }
    }
    const $router = { 
        push() {}
    }
    const wrapper = mount(Order,{
        mocks: {
            $route,
            $router
        }
    })
    it('click menu button', () => {
        wrapper.vm.pay()
        wrapper.vm.exit()
        wrapper.vm.tableData[0].quantity = 0
        wrapper.vm.placeOrder()
        wrapper.vm.tableData[0].quantity = 1
        wrapper.vm.placeOrder()
        wrapper.vm.payLater()
        wrapper.vm.toCustomer()
        wrapper.vm.toOrderList()
        wrapper.vm.toCommodity()
      })
})