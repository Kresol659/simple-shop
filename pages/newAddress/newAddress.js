// pages/newAddress/newAddress.js
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uname:'',
    phone:'',
    address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getVal(e){
    if (e.currentTarget.dataset.name==='uname'){
      this.setData({
        uname:e.detail.detail.value
      })
    } else if (e.currentTarget.dataset.name === 'phone'){
      this.setData({
        phone: e.detail.detail.value
      })
    } else if (e.currentTarget.dataset.name === 'address'){
      this.setData({
        address: e.detail.detail.value
      })
    }
 
  },
  //添加地址
  addTo(){
    if(this.data.uname===''){
      $Message({
        content: '请填入收货人',
        type: 'warning',
        duration: 1.5
      });
    } else if (this.data.phone === ''){
      $Message({
        content: '手机号不能为空',
        type: 'warning',
        duration: 1.5
      });
    } else if (this.data.phone < 11 || this.data.phone > 11){
      $Message({
        content: '请输入11位手机号',
        type: 'warning',
        duration: 1.5
      });
    } else if (this.data.address === ''){
      $Message({
        content: '收货地址不为空',
        type: 'warning',
        duration: 1.5
      });
    }else{
      //添加数据
    }
  }

  
})