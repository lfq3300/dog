var t = getApp(), a = {
    page: 1,
    isMove: !0,
    cache_data: []
};

Page({
    data: {
        is_popup_ad: t.globalData.__popup_ad
    },
    onLoad: function() {
        this.initPage(), App.zhuge.track("进入首页", {
            "平台": "小程序"
        });
    },
    initPage: function() {
        t.initCallback(function() {
            this.getAd(), this.getGoods(), this.getCoupon(), this.getConst();
        }.bind(this));
    },
    getConst: function() {
        wx.request({
            url: t.globalData.__api_path + "index.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "const"
            },
            success: function(a) {
                200 == a.data.code ? t.globalData.__const = a.data.result : wx.showToast({
                    title: a.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), console.log(a);
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
    getAd: function() {
        var a = this;
        wx.showLoading({
            title: "加载首页",
            mask: !0
        }), wx.request({
            url: t.globalData.__api_path + "index.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "ad"
            },
            success: function(t) {
                200 == t.data.code ? a.setData({
                    ads: t.data.ads
                }) : wx.showToast({
                    title: t.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), wx.hideLoading(), console.log(t);
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
    getGoods: function() {
        var o = this;
        wx.request({
            url: t.globalData.__api_path + "index.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "recommend",
                page: a.page
            },
            success: function(t) {
                200 == t.data.code ? o.setData({
                    goods_recommend: t.data.result.goods
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
    getCoupon: function() {
        var a = this;
        wx.request({
            url: t.globalData.__api_path + "index.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "coupon"
            },
            success: function(t) {
                200 == t.data.code ? a.setData({
                    goods_coupon: t.data.result
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
    onClickBanner: function(t) {
        t.target.dataset.path && (wx.navigateTo({
            url: t.target.dataset.path
        }), App.zhuge.track("首页-点击banner", {
            "平台": "小程序",
            "banner名称": t.target.dataset.ad_name
        }));
    },
    bind_zhuge: function(t) {
        App.zhuge.track("首页-点击今日热卖", {
            "平台": "小程序",
            "热卖商品名称": t.target.dataset.zhuge
        });
    },
    bind_zhuge_baokuan: function(t) {
        App.zhuge.track("首页-点击爆款推荐", {
            "平台": "小程序",
            "爆款商品名称": t.target.dataset.zhuge
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
        }), App.zhuge.track("首页-点击优惠券", {
            "平台": "小程序"
        }), console.log(a.currentTarget.dataset.id);
    },
    popup_close: function() {
        var a = this;
        t.globalData.__popup_ad = !1, a.setData({
            is_popup_ad: !1
        });
    },
    bindGetUserInfo: function(a) {
        var o = this;
        t.getUser(), o.popup_close(), a.currentTarget.dataset.path && wx.navigateTo({
            url: a.currentTarget.dataset.path
        });
    },
    onPullDownRefresh: function() {
        this.initPage(), wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {
        return {
            title: "小狗电器官方商城",
            path: "/pages/index/index"
        };
    }
});