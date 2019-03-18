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
                act: "label"
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
    formBindsubmit: function(t) {
        var a = t.detail.value.keyword;
        if (!a) return wx.showToast({
            title: "请输入关键字",
            duration: 1e3,
            icon: "none"
        }), !1;
        this.setData({
            key: a
        }), this.search_goods(a);
    },
    search_goods: function(a) {
        var o = this;
        wx.showLoading({
            title: "请稍后",
            mask: !0
        }), wx.request({
            url: t.globalData.__api_path + "index.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "search",
                key: a,
                page: 1
            },
            success: function(t) {
                wx.hideLoading(), 200 == t.data.code ? o.setData({
                    result_goods: t.data.result.goods
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
        }), App.zhuge.track("搜索", {
            "平台": "小程序",
            "关键词": a
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});