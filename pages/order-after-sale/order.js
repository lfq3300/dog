var t = getApp(), a = {
    or_id: 0
};

Page({
    data: {},
    onLoad: function(t) {
        a.or_id = t.id, this.initPage();
    },
    initPage: function() {
        var o = this;
        wx.request({
            url: t.globalData.__api_path + "user-after_sale.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "after_sale_details",
                or_id: a.or_id
            },
            success: function(t) {
                200 == t.data.code ? o.setData({
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
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});