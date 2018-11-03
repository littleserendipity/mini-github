const github = require('../../api/github.js')
const moment = require('../../lib/moment.js')
const utils = require('../../utils/util.js')

Page({
  data: {
    filter: 'CREATED',
    pulls: [],
    scrollTop: 0,
    lastRefresh: moment().unix(),
    isSignedIn: utils.isSignedIn()
  },
  
  onShow: function () {
    this.setData({
      isSignedIn: utils.isSignedIn()
    })
    var lastMoment = moment(this.data.lastRefresh)
    if (this.data.scrollTop === 0 && moment().diff(lastMoment, 'minutes') >= 5) {
      wx.startPullDownRefresh({})
    }
  },
  
  onPullDownRefresh: function () {
    this.reloadData()
  },

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
    })
  },

  reloadData: function () {
    github.getPulls(this.data.filter, data => {
      console.log(data)
      wx.stopPullDownRefresh()
      this.setData({
        pulls: data,
        lastRefresh: moment()
      })
    }, error => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: error.message,
        icon: 'none'
      })
    })
  },

  changeFilter: function (event) {
    switch (event.detail.index) {
      case 0:
        this.setData({ filter: 'CREATED' })
        break
      case 1:
        this.setData({ filter: 'ASSIGNED' })
        break
      case 2:
        this.setData({ filter: 'MENTIONED' })
        break
      case 3:
        this.setData({ filter: 'REVIEW' })
        break
      case 4:
        this.setData({ filter: 'CLOSED' })
        break
    }
    wx.startPullDownRefresh({})
  }
})