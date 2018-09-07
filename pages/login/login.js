// pages/login/login.js
import {preIP,localIP} from '../../IP/index.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      phone:'',
      upwd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  loginBtn(){
    wx.request({
      url: localIP+'/user/find', //仅为示例，并非真实的接口地址
      data: {
        uphone: this.data.phone,
        upwd: this.data.upwd,
        findType:'exact'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if(res.data.length===1){
          $Message({
            content: '登录成功',
            type: 'success'
          });
          wx.setStorage({
            key: 'user',
            data: JSON.stringify(res.data),
            success: function (res) {
              console.log('异步保存成功')
            }
          })
          wx.switchTab({
            url: '../index/index'
          });
        }else{
          $Message({
            content: '登录失败 , 检查用户名和密码',
            type: 'error'
          });
        }
      }.bind(this)
    })
  },
  getVal(e){
    if (e.currentTarget.id==='phone'){
        this.setData({
          phone:e.detail.detail.value
        })
    } else if (e.currentTarget.id === 'upwd'){
      this.setData({
        upwd: e.detail.detail.value
      })

    }
  }
})