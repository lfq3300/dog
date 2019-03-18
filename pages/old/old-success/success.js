var t = getApp();

Page({
    data: {},
    onLoad: function(t) {
        this.initPage();
    },
    initPage: function() {
        this.load_coupon();
    },
    load_coupon: function() {
        var a = this;
        wx.request({
            url: t.globalData.__api_path + "old.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "get_coupon"
            },
            success: function(t) {
                200 == t.data.code ? a.setData({
                    tab_coupons: t.data.result
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
    goto_path: function(t) {
        t.currentTarget.dataset.path && wx.navigateTo({
            url: t.currentTarget.dataset.path
        }), console.log(t.currentTarget.dataset.path);
    },
    onShareAppMessage: function() {}
});