var t = getApp();

Page({
    data: {},
    onLoad: function(a) {
        t.globalData.__const && this.setData({
            about: t.globalData.__const[1]
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});