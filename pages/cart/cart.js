// pages/cart/cart.js
import {
  preIP,
  localIP
} from '../../IP/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: [],
    shopCart: [],
    preIP: preIP,
    checked: false,
    disabled: false,
    total: 0,
    allNot: false,
    showNot: [],
    allState: false,
    buyLength: 0,
    sel: [],
    options:{},
    showColor:false,
    selItem:[],
    sendId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.Init(options)
    this.setData({
      options: options,
      sendId: JSON.parse(wx.getStorageSync('user'))[0]._id,
    })
  },
  Init(options){
    if (!wx.getStorageSync('user')){
        wx.redirectTo({
          url: '../login/login',
        })
        return;
    }
    wx.request({
      url: localIP + '/user/find',
      data: {
        _id: this.data.sendId,
        submitType: "findJoin",
        ref: '["items"]'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        let showState =[];
        for (let i in res.data.items){
          showState[i]=false
        }
        let newData = res.data.items.map((o, index) => {
          o.itemImg = o.itemImg.map(k => {
            k = k.replace(/\\/g, '/');
            return k
          })
          o.count = parseInt(res.data.countAddr[index]);
          return o;
        })
        this.setData({
          shopCart: newData,
          showNot: showState,
          sel: res.data.sel
        })
      }.bind(this)
    })
  },
  onShow: function () {
    this.Init(this.data.options);
  },
  addCount({
    currentTarget
  }) {
    let i = currentTarget.dataset.index;
    let newCart = this.data.shopCart;
    // -----------是否为选中状态-----------//
    if (this.data.showNot[i]) {
      this.setData({
        total: this.data.total + parseInt(this.data.shopCart[i].itemPrices),
     
      })
    }
    newCart[i].count = newCart[i].count + 1;
    this.setData({
      shopCart: newCart
    })
  },
  decCount({
    currentTarget
  }) {
    let i = currentTarget.dataset.index;
    let newCart = this.data.shopCart;
    // -----------是否为选中状态-----------//
    if (this.data.showNot[i] && newCart[i].count > 0) {
      this.setData({
        total: this.data.total - parseInt(this.data.shopCart[i].itemPrices),
       
      })
    }
    newCart[i].count - 1 <= 1 ? newCart[i].count = 1 : newCart[i].count--;
    this.setData({
      shopCart: newCart
    })
  },
  selClick() {
    if (this.data.allNot) {
      this.setData({
        allNot: false,
        showNot: this.data.showNot.map(o => false),
        total: 0,
        buyLength: 0,
        showColor: false,
        selItem:[]
      })
    } else {
      let total = 0;
      for (let item of this.data.shopCart) {
        total += parseInt(item.itemPrices) * item.count
      }

      this.setData({
        allNot: true,
        showNot: this.data.showNot.map(o => true),
        total: total,
        buyLength: this.data.shopCart.length,
        showColor: true,
        selItem: this.data.shopCart.map((o, index)=>index),

      })
    }


  },
  // -------------选中商品--------------//
  chooseChange(e) {
        this.setData({
          selItem:e.detail.value
        })
    if (e.detail.value.length < this.data.shopCart.length) {
      this.setData({
        allState: false,
        buyLength: e.detail.value.length
       
      })
    } else if (e.detail.value.length === this.data.shopCart.length) {
      this.setData({
        allState: true,
        buyLength: e.detail.value.length,
        showColor: true
      })
    }
    if (e.detail.value.length !== 0) {
      let total = 0;
      let showState = this.data.showNot;
      for (let i in e.detail.value) {
        total += this.data.shopCart[e.detail.value[i]].itemPrices * this.data.shopCart[i].count;
        showState[e.detail.value[i]] = true;
      }
      this.setData({
        total: total,
        showNot: showState,
        buyLength: e.detail.value.length,
        showColor: true
      })
    } else {
      let showState = this.data.showNot.map(o => false);
      this.setData({
        total: 0,
        showNot: showState,
        buyLength: e.detail.value.length,
        showColor: false
      })
    }

  },
  buyNow(){
    let items=this.data.selItem.map((o, index) => { 
      return {
        item: this.data.shopCart[index], 
        count: this.data.shopCart[index].count,
        sel:this.data.sel[index],
        
    }
    });
    wx.setStorageSync('shopCart', JSON.stringify(items))
    wx.setStorageSync('total',this.data.total+'')
    let k=false;
    for (let state of this.data.showNot){
      if (state){
          k=true
      }      
    }
    if(k){
      let user = JSON.parse(wx.getStorageSync('user'));
      for (let i of this.data.selItem){
            user[0].items.splice(i, 1);
            user[0].sel.splice(i, 1);
            user[0].countAddr.splice(i, 1);
        }
      wx.setStorageSync('user', JSON.stringify(user))
      wx.request({
        url: localIP+'/user/update', //仅为示例，并非真实的接口地址
        data: user[0],
        header: {
          'content-type': 'application/json' // 默认值
        }
      })
          wx.navigateTo({
        url: '../uporder/uporder',
      })
    }else{
    return;
    }
  
  }
 
})