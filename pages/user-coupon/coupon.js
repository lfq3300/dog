var t = getApp(), a = {
    tabs: [],
    ls_array: []
};

Page({
    data: {
        submit_style: ""
    },
    onLoad: function(t) {
        this.initPage();
    },
    initPage: function() {
        var o = this;
        wx.request({
            url: t.globalData.__api_path + "user.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "user-coupon"
            },
            success: function(t) {
                200 == t.data.code ? (a.tabs = [ {
                    tab: "待使用(" + t.data.result.res_1.length + ")",
                    cls: "tab-select",
                    code: "tab1",
                    conpon_cls: ""
                }, {
                    tab: "已使用(" + t.data.result.res_2.length + ")",
                    cls: "",
                    code: "tab2",
                    conpon_cls: "coupon_ysx"
                }, {
                    tab: "已失效(" + t.data.result.res_3.length + ")",
                    cls: "",
                    code: "tab3",
                    conpon_cls: "coupon_ysx"
                } ], a.ls_array = [ t.data.result.res_1, t.data.result.res_2, t.data.result.res_3 ], 
                o.setData({
                    tabs: a.tabs,
                    tab_coupons: a.ls_array[0],
                    tab_coupons_style: ""
                })) : wx.showToast({
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
    onCouponTab: function(t) {
        for (var o = "", e = 0; e < a.tabs.length; e++) e == t.currentTarget.dataset.id ? (a.tabs[e].cls = "tab-select", 
        o = a.tabs[e].conpon_cls) : a.tabs[e].cls = "";
        this.setData({
            tabs: a.tabs,
            tab_coupons: a.ls_array[t.currentTarget.dataset.id],
            tab_coupons_style: o
        });
    },
    submit_code: function(a) {
        var o = this;
        if (!a.detail.value.code) return wx.showToast({
            title: "兑换码不能为空",
            duration: 2e3,
            icon: "none"
        }), !1;
        wx.showLoading({
            title: "请稍后",
            mask: !0
        }), wx.request({
            url: t.globalData.__api_path + "coupon.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "receive-code",
                code: a.detail.value.code
            },
            success: function(t) {
                wx.hideLoading(), 200 == t.data.code ? wx.showModal({
                    title: "提示",
                    content: "兑换成功！",
                    showCancel: !1,
                    success: function(t) {
                        o.initPage();
                    }
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
        }), console.log(a);
    },
    goto_goods: function(t) {
        t.currentTarget.dataset.path && wx.navigateTo({
            url: t.currentTarget.dataset.path
        });
    },
    inputWacth: function(t) {
        t.detail.value ? this.setData({
            submit_style: "submit_red"
        }) : this.setData({
            submit_style: ""
        });
    },
    onShow: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});