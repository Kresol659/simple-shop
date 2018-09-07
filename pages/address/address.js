// pages/address/address.js
import { preIP, localIP } from '../../IP/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailAddr:[
      { name: '刘吴江', phone: '18380200121', addr:'四川省成都市郫县嘤嘤嘤'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: localIP+ '/user/find',
      data: {uname:'liuwujiang'},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let newData = this.data.detailAddr;
        for (let item of res.data[0].sendAddr){
          newData.push({
            name: item.split('/')[0],
            phone: item.split('/')[1],
            addr: item.split('/')[2]
          })
        }
        this.setData({
          detailAddr: newData
        })
      }.bind(this)
    })
  },
  addAddr(){
    wx.navigateTo({
      url: '../newAddress/newAddress',
    })
  }
})