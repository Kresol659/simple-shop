// pages/my/my.js
import {preIP} from '../../IP/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
    current: 'homepage',
    preIP: preIP,
    friendLink: [{
        url: '../../images/zfb.png',
        name: '支付宝'
      },
      {
        url: '../../images/wx.png',
        name: '微信'
      },
      {
        url: '../../images/jd.png',
        name: '京东'
      },
      {
        url: '../../images/mt.png',
        name: '美团'
      },
      {
        url: '../../images/ali.png',
        name: '阿里云'
      },
      {
        url: '../../images/pdd.png',
        name: '拼多多'
      },
      {
        url: '../../images/wph.png',
        name: '唯品会'
      },
      {
        url: '../../images/jm.png',
        name: '聚美优品'
      }
    ],
    user: [],
    show:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.thisInit();
  },
  onShow:function(e){
    this.thisInit();
  },
  thisInit(){
    let user = wx.getStorageSync('user');
    if (user) {
      this.setData({
        user: JSON.parse(user),
        show: true
      })
    } else {
      this.setData({
        show: false
      })
    }
  },
  goPage: function({
    detail
  }) {
    switch (detail.key) {
      case '01':
        break;
      case '02':
        break;
      case '03':
        break;
      case '04':
        break;
      case '05':
        wx.navigateTo({
          url: '../order/order'
        })
        break;
    }
  },
  //---------- 收货地址------------//
  goAddress() {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  goLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  getUser() {
    wx.getStorage('user')
  },
  goMyInfo(){
    
    wx.navigateTo({
      url: '../myInfo/myInfo',
    })
  }

})