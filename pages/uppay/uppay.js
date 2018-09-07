// pages/uppay/uppay.js
const {
  $Toast
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payment_mode: 1, //默认支付方式 微信支付
    isFocus: false, //控制input 聚焦
    balance: 0, //余额
    actual_fee: 20, //待支付
    wallets_password_flag: false, //密码输入遮罩,
    wallets_password: '', //密码
    pwd: '',
    options: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      actual_fee: options.total2||options.total,
      balance: JSON.parse(wx.getStorageSync('user'))[0].balance,
      options: options
    })
  },
  wx_pay() { //转换为微信支付
    this.setData({
      payment_mode: 1
    })
  },
  offline_pay() { //转换为转账支付
    this.setData({
      payment_mode: 0
    })
  },
  wallet_pay() {

    this.setData({ //转换为钱包支付
      payment_mode: 2
    })
  },
  set_wallets_password(e) { //获取钱包密码
    this.setData({
      wallets_password: e.detail.value
    });
    console.log(e.detail.value)
    if (this.data.wallets_password.length == 6) { //密码长度6位时，自动验证钱包支付结果    
      wallet_pay(this, wx);
    }
  },
  set_Focus() { //聚焦input
    console.log('isFocus', this.data.isFocus)
    this.setData({
      isFocus: true
    })
  },
  set_notFocus() { //失去焦点
    this.setData({
      isFocus: false
    })
  },
  close_wallets_password() { //关闭钱包输入密码遮罩
    this.setData({
      isFocus: false, //失去焦点
      wallets_password_flag: false,
    })
  },
  pay() { //去支付
    pay(this)
  }

})

/*-----------------------------------------------*/
/*支付*/
function pay(_this) {
  let apikey = _this.data.apikey;
  let id = _this.data.id;
  let payment_mode = _this.data.payment_mode
  if (payment_mode == 1) {
    //  微信支付
    // 微信自带密码输入框
    console.log('微信支付')
  } else if (payment_mode == 0) {
    //  转账支付 后续跳转至传转账单照片
    console.log('转账支付')
  } else if (payment_mode == 2) {
    // 钱包支付 输入密码
    console.log('钱包支付')
    _this.setData({
      wallets_password_flag: true,
      isFocus: true
    })
  }


}
// 钱包支付
function wallet_pay(_this, wx) {
  let state = false;
  let user = JSON.parse(wx.getStorageSync('user'))
  if (user[0].payword === _this.data.wallets_password) {
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    setTimeout(() => {
      $Toast({
        content: '支付成功',
        type: 'success'
      });
    }, 1000)
    if (_this.data.options.buy) {
      let orderCart = JSON.parse(wx.getStorageSync('orderCart'));
      orderCart[_this.data.options.index].isBuy='yes';
      wx.setStorageSync('orderCart', JSON.stringify(orderCart))
    } else {
      let balance = _this.data.balance - _this.data.actual_fee;
      user[0].balance = balance;
      let payCart = JSON.parse(wx.getStorageSync('payCart'));
      for (let item of payCart) {
        item.isBuy = 'yes'
      }
      wx.setStorageSync('user', JSON.stringify(user));
      wx.setStorageSync('payCart', JSON.stringify(payCart));
    }
    setTimeout(() => {
      wx.redirectTo({
        url: '../order/order',
      })
    }, 2000)
  } else {
    $Toast({
      content: '加载中',
      type: 'loading'
    });
    setTimeout(() => {
      $Toast({
        content: '支付失败',
        type: 'error'
      });
      _this.setData({
        isFocus: true,
        wallets_password: '',
        pwd: ''
      })
    }, 1000)

  }
  /*
  1.支付成功
  2.支付失败：提示；清空密码；自动聚焦isFocus:true，拉起键盘再次输入
  */
}