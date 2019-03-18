var t = getApp();

Page({
    data: {},
    onLoad: function(t) {
        this.initPage();
    },
    initPage: function() {
        var a = this;
        wx.request({
            url: t.globalData.__api_path + "index.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "coupon_all"
            },
            success: function(t) {
                200 == t.data.code ? a.setData({
                    result_coupon: t.data.result
                }) : wx.showToast({
                    title: t.data.msg,
                    duration: 2e3
                }), console.log(t);
            },
            fail: function(t) {
                wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 2e3
                });
            },
            complete: function() {}
        });
    },
    receive_coupon: function(a) {
        wx.request({
            url: t.globalData.__api_path + "coupon.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "receive",
                id: a.currentTarget.dataset.id
            },
            success: function(t) {
                200 == t.data.code ? wx.showModal({
                    title: "提示",
                    content: "优惠券已成功领取！",
                    showCancel: !1,
                    success: function(t) {}
                }) : wx.showToast({
                    title: t.data.msg,
                    duration: 1e3,
                    mask: !0
                }), console.log(t);
            },
            fail: function(t) {
                wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 2e3
                });
            },
            complete: function() {}
        }), console.log(a.currentTarget.dataset.id);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});