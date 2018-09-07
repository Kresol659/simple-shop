//index.js
//获取应用实例
const app = getApp()
import {
  preIP,
  localIP
} from '../../IP/index.js'
Page({
  data: {
    preIP: preIP,
    imgUrls: [
      '../../images/banner1.jpg',
      '../../images/banner2.jpg',
      '../../images/banner3.jpg',
      '../../images/banner4.jpg',
      '../../images/banner5.jpg',
    ],
    serimgs: [{
        src: '../../images/001.png',
        name: '生鲜'
      },
      {
        src: '../../images/002.png',
        name: '全球购'
      },
      {
        src: '../../images/003.png',
        name: '赚钱'
      },
      {
        src: '../../images/004.png',
        name: '物流直达'
      },
      {
        src: '../../images/005.png',
        name: '充值'
      },
      {
        src: '../../images/006.png',
        name: '9.9包邮'
      },
      {
        src: '../../images/007.png',
        name: '领券'
      },
      {
        src: '../../images/008.png',
        name: '品牌'
      },
      {
        src: '../../images/009.png',
        name: '超市'
      },
      {
        src: '../../images/010.png',
        name: '服装'
      }
    ],
    thirImg: ['../../images/driver.png', '../../images/driver1.png', '../../images/driver3.jpg'],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    goods: [],
    topStyle: 'search_top',
    searchKuang:'search_box'
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onLoad: function(options) {
    wx.request({
      url: localIP + '/items/find',
      data: {
        submitType: 'findJoin',
        ref: ['shops']
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        let newData = res.data.map(o => {
          o.itemImg = o.itemImg.map(o => o.replace(/\\/g, '/'))
          return o;
        })
        this.setData({
          goods: newData
        })
      }.bind(this)
    })
  },
  scroll: function(e) {
    if (e.detail.scrollTop > 100) {
      this.setData({
        topStyle:'search_top_change',
        searchKuang: 'search_box_change'
      })
    }else{
      this.setData({
        topStyle: 'search_top',
        searchKuang: 'search_box'
      })
    }
  },
  goDetails(e){
   wx.navigateTo({
     url: '../detail/detail?id=' + e.currentTarget.dataset.id,
   })
  }
})