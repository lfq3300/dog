var t = getApp();

Page({
    data: {},
    onLoad: function(t) {
        this.initPage();
    },
    initPage: function() {
        var a = this;
        wx.request({
            url: t.globalData.__api_path + "old.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "get_goods"
            },
            success: function(t) {
                200 == t.data.code ? a.setData({
                    result: t.data.result
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
    onShareAppMessage: function() {}
});