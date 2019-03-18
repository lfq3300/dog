var a = getApp();

Page({
    data: {},
    onLoad: function(t) {
        a.globalData.__const && this.setData({
            company_img: a.globalData.__const[3]
        });
    },
    onShareAppMessage: function() {}
});