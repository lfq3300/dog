var t = getApp();

Page({
    data: {},
    onLoad: function(t) {
        this.initPage();
    },
    initPage: function() {
        var a = this;
        wx.request({
            url: t.globalData.__api_path + "user-after_sale.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "after_sale"
            },
            success: function(t) {
                200 == t.data.code ? a.setData({
                    result_data: t.data.result
                }) : wx.showToast({
                    title: t.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), console.log(t);
            },
            fail: function(t) {
                wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 2e3,
                    icon: "none"
                });
            },
            complete: function() {}
        });
    },
    order_del: function(a) {
        var o = this;
        wx.showModal({
            title: "提示",
            content: "您确定要删除吗？",
            showCancel: !0,
            success: function(e) {
                e.confirm ? wx.request({
                    url: t.globalData.__api_path + "user-after_sale.php",
                    data: {
                        uid: t.globalData.__uid,
                        token: t.globalData.__token,
                        act: "after_sale_del",
                        or_id: a.currentTarget.dataset.order_id
                    },
                    success: function(t) {
                        200 == t.data.code ? o.initPage() : wx.showToast({
                            title: t.data.msg,
                            duration: 2e3,
                            icon: "none"
                        }), console.log(t);
                    },
                    fail: function(t) {
                        wx.showToast({
                            title: "数据加载失败，请刷新",
                            duration: 2e3,
                            icon: "none"
                        });
                    },
                    complete: function() {}
                }) : e.cancel && console.log("用户点击取消");
            }
        });
    },
    onPullDownRefresh: function() {
        this.initPage();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});