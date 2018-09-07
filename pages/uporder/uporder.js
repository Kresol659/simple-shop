// pages/uporder/uporder.js
import {
  preIP,
  localIP
} from '../../IP/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noshow:false,
    visible: false,
    preIP: preIP,
    items: [],
    user: [],
    total: 0,
    address: [],
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!wx.getStorageSync('orderCart')){
      wx.setStorageSync('orderCart', '[]')
    }
    //------------判断是直接购买还是购物车购买------------//
    if (options.buyState === 'ok') {
      this.setData({
        items: [wx.getStorageSync('goBuy')],
        total: wx.getStorageSync('goBuy').total,
      
      })
    }else{
      let shopCart = JSON.parse(wx.getStorageSync('shopCart'));
      this.setData({
        items: shopCart,
        total: wx.getStorageSync('total'),
        
      })
    }
    let user = JSON.parse(wx.getStorageSync('user'));
    this.setData({
      user: user,
      address: user[0].sendAddr.map(o=>o.split('/'))
    })
  },
  openModal() {
    this.setData({
      visible: true
    });
  },
  closeModal(){
    this.setData({
      visible: false
    });
  },
  // ----------选择收货地址----------//
  selAddr(){

  },
  radioChange({detail}){
    this.setData({
      index: parseInt(detail.value),
      visible: false
    })
  },
  toPay(){
    let items =this.data.items;
    items.map(o=>{
      o.isBuy ='no';
      o.addr = this.data.address[this.data.index]
      return o
    })
    wx.setStorageSync('payCart', JSON.stringify(items))//存储当前购买的商品
    let orderCart = JSON.parse(wx.getStorageSync('orderCart'));
    orderCart = [...orderCart,...items];
    wx.setStorageSync('orderCart', JSON.stringify(orderCart)) //重新构造订单状态
    wx.setStorageSync('addr', JSON.stringify(this.data.items))
    console.log(items)
    wx.redirectTo({
      url: '../uppay/uppay?total='+this.data.total,
    })
  }
})