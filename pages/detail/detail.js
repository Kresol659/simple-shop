// pages/detail/detail.js
import {
  preIP,
  localIP
} from '../../IP/index.js';
const {
  $Message
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preIP: preIP,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    itemDetails: [],
    star: 0,
    user: [],
    address: [],
    showModalStatus: false,
    count: 1,
    val1: '',
    val2: '',
    bottomSel: '',
    topSel: '',
    itemId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let user = JSON.parse(wx.getStorageSync('user'));
    this.setData({
      user: user,
      address: user[0].sendAddr.map(o => o.split('/')[2]),
      itemId: options.id
    })

    wx.request({
      url: localIP + '/items/find',
      data: {
        _id: options.id,
        submitType: 'findJoin',
        ref: ['shops']
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        let showStyle = [],
          showSize = [];
        res.data.itemImg = res.data.itemImg.map(o => {
          o = o.replace(/\\/g, '/')
          return o;
        })
        res.data.detailImg = res.data.detailImg.map(o => {
          o = o.replace(/\\/g, '/')
          return o;
        })
        let temp = res.data.parameter[0].split('&')[0].split('/');
        temp.length = 2;
        showStyle = temp;
        temp = res.data.parameter[0].split('&')[1].split('/').map(o => o.split(','));
        temp.length = 2;
        showSize = temp;
        this.setData({
          itemDetails: res.data,
          showStyle: showStyle,
          showSize: showSize
        })
      }.bind(this)
    })
  },
  //----------------- 收藏-----------------//
  collectShop(e) {
    console.log(e.currentTarget.dataset.id)
    let user = JSON.parse(wx.getStorageSync('user'))
    if (this.data.star) {
      for (let i in user[0].collectBaby) {
        if (e.currentTarget.dataset.id == user[0].collectBaby[i]) {
          user[0].collectBaby.splice(i, 1)
        }
      }
      wx.setStorageSync('user', JSON.stringify(user))
      this.setData({
        star: 0
      })
    } else {
      user[0].collectBaby.push(e.currentTarget.dataset.id);
      user[0].collectBaby = [...new Set(user[0].collectBaby)]
      wx.setStorageSync('user', JSON.stringify(user))
      this.setData({
        star: 1
      })
    }
    setTimeout(() => {
      wx.request({
        url: localIP + '/user/update', //仅为示例，并非真实的接口地址
        data: user[0],
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          console.log(res.data)
        }
      })
    }, 1000)

  },
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false                    
      })
    }.bind(this), 200)
  },
  countChange({
    detail
  }) {
    this.setData({
      count: detail.value
    })
  },
  changeColorf(e) {
    if (e.target.dataset.id) {
      this.setData({
        val1: e.target.dataset.id
      })
    }


  },
  changeColors(e) {
    if (e.target.dataset.id) {
      this.setData({
        val2: e.target.dataset.id
      })
    }

  },
  topChange({
    detail
  }) {
    this.setData({
      topSel: detail.value
    })
  },
  bottomChange({
    detail
  }) {
    this.setData({
      bottomSel: detail.value
    })
  },
  inCart() {
    if (this.data.topSel !== '' && this.data.bottomSel !== '') {
      let user = JSON.parse(wx.getStorageSync('user'));
      user[0].items.push(this.data.itemId);
      user[0].sel.push(this.data.topSel + '/' + this.data.bottomSel)
      user[0].countAddr.push(this.data.count)
      wx.request({
        url: localIP + '/user/update',
        data: user[0],
        header: {
          'content-type': 'application/json'
        },
        success() {
          $Message({
            content: '添加成功',
            type: 'success'
          });
        }
      })
      wx.setStorageSync('user', JSON.stringify(user));
      this.hideModal();
    } else {
      $Message({
        content: '请检查您的选项',
        type: 'warning'
      });
    }
  },
  buyNowIn() {
    if (this.data.topSel !== '' && this.data.bottomSel !== '' && this.data.count!==0) { 
      wx.setStorageSync('goBuy', { item: this.data.itemDetails, sel: this.data.topSel + '/' + this.data.bottomSel, count: this.data.count, total: parseInt(this.data.count * this.data.itemDetails.itemPrices)})
      wx.navigateTo({
        url: '../uporder/uporder?buyState=ok',
        })
    } else if (this.data.count === 0){
      $Message({
        content: '至少购买一个',
        type: 'warning'
      });}
 
  }
})