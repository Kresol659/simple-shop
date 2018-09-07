// pages/order/order.js
import {preIP,locaIP} from '../../IP/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preIP: preIP,
    current: 't0',
    duration: 1000,
    currentData:'0',
    items:[],
    buyNo:[],
    buyOk:[],
    answer:[],
    value1:false,
    value2: false,
    value3: false,
    visible2:false,
    currentTarget:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let items = JSON.parse(wx.getStorageSync('orderCart')); 
    let buyNo = items.filter((o,index) => {
      if (o.isBuy === 'no'){
          o.index=index;
      }
      return o.isBuy === 'no'
    })  
    let buyOk = items.filter((o, index) => {
      if (o.isBuy === 'yes') {
        o.index = index;
      }
      return o.isBuy === 'yes'
    })  
    let answer = items.filter((o, index) => {
      if (o.isBuy === 'answer') {
        o.index = index;
      }
      return o.isBuy === 'answer'
    })  
    console.log(items)
    this.setData({
      items: items,
      buyNo: buyNo,
      buyOk: buyOk,
      answer: answer,
    })
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key,
      currentData: detail.key.replace('t','')
    });
  },
  bindchange(e){
    console.log(e.detail.current)
    const that = this;
    that.setData({
      current: 't'+e.detail.current
    })
  },
  toPay({currentTarget}){
    wx.navigateTo({
      url: '../uppay/uppay?buy=order&index=' + currentTarget.dataset.index + '&total2=' + currentTarget.dataset.price * currentTarget.dataset.count,
    })
  },
  toAnswer({ currentTarget }){
    this.setData({
      visible2:true,
      currentTarget: currentTarget
    })
  },
  buyTrue(){
    let currentTarget = this.data.currentTarget;
    console.log(currentTarget)
    let orderCart = JSON.parse(wx.getStorageSync('orderCart'));
    orderCart[currentTarget.dataset.index].isBuy = 'answer'
    wx.setStorageSync('orderCart', JSON.stringify(orderCart))
    this.setData({
      visible2: false
    })
    this.onLoad();
  },
  buyFalse(){
    this.setData({
      visible2: false
    })
  }


})