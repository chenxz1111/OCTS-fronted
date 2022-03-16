import { mount } from '@vue/test-utils'
import StartPage from '@/views/StartPage.vue'

describe('StagePage.vue', () => {
  const $refs = {
    loginForm : {
      resetFields() {}
    }
  }
  const wrapper = mount(StartPage,{
    mocks: {
        $refs
    }
  })
  it('has a menu', () => {
    expect(wrapper.contains('el-menu')).toBe(true)
  })
  it('click menu button1', () => {
    const button = wrapper.findAll('el-menu-item').at(0)
    button.trigger('click')
  })
  it('click menu button2', () => {
    const button = wrapper.findAll('el-menu-item').at(1)
    button.trigger('click')
  })

  // it('identity', () => {
  //   const input = wrapper.findAll('el-input').at(0)
  //   input.trigger('keyup.enter.native')
  // })
  it('click button', () => {
    const button = wrapper.findAll('el-button').at(0)
    button.trigger('click')
  })
  it('methods', () => {
    wrapper.vm.alertClose()
    wrapper.vm.signup()
    wrapper.vm.login()
    wrapper.vm.merchantLogin()
    wrapper.vm.customer_name.default()
    wrapper.vm.money.default()
    wrapper.vm.userToken.default()
    wrapper.vm.merchantToken.default()
    function f () {}
    wrapper.vm.usernameValidator('', '', f)
    wrapper.vm.loginForm.password = wrapper.vm.loginForm.confirmPassword + 1
    wrapper.vm.confirmPasswordValidator('', '', f)
    //wrapper.vm.merchant()
  })
})