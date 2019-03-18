var t = getApp(), a = {
    tabs: [ {
        tab: "全部",
        cls: "tab-select",
        code: "order_all"
    }, {
        tab: "待付款",
        cls: "",
        code: "no_pay"
    }, {
        tab: "待发货",
        cls: "",
        code: "no_express"
    }, {
        tab: "待收货",
        cls: "",
        code: "no_sh"
    }, {
        tab: "待评价",
        cls: "",
        code: "no_pj"
    } ],
    tab_cur: "order_all"
};

Page({
    data: {
        tabs: a.tabs
    },
    onLoad: function(t) {
        t.act && (a.tab_cur = t.act);
        for (var o = 0; o < a.tabs.length; o++) a.tab_cur == a.tabs[o].code ? a.tabs[o].cls = "tab-select" : a.tabs[o].cls = "";
        this.setData({
            tabs: a.tabs
        });
    },
    onShow: function() {
        this.initPage(a.tab_cur);
    },
    onOrderTab: function(t) {
        a.tab_cur = a.tabs[t.currentTarget.dataset.id].code;
        for (var o = 0; o < a.tabs.length; o++) o == t.currentTarget.dataset.id ? a.tabs[o].cls = "tab-select" : a.tabs[o].cls = "";
        this.setData({
            tabs: a.tabs
        }), this.initPage(a.tabs[t.currentTarget.dataset.id].code);
    },
    initPage: function(a) {
        var o = this;
        wx.showLoading({
            title: "请稍后",
            mask: !0
        }), wx.request({
            url: t.globalData.__api_path + "user-order.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: a
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
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    order_pay: function(o) {
        var e = this;
        wx.showLoading({
            title: "请稍后",
            mask: !0
        }), wx.request({
            url: t.globalData.__api_path + "cart-order.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "order_pay",
                order_id: o.currentTarget.dataset.order_id
            },
            success: function(t) {
                200 == t.data.code ? wx.requestPayment({
                    timeStamp: t.data.result.timeStamp,
                    nonceStr: t.data.result.nonceStr,
                    package: t.data.result.package,
                    signType: t.data.result.signType,
                    paySign: t.data.result.paySign,
                    success: function(t) {
                        wx.showToast({
                            title: "订单支付成功",
                            icon: "success",
                            duration: 2e3
                        }), console.log(t);
                    },
                    fail: function(t) {
                        console.log(t);
                    },
                    complete: function(t) {
                        e.initPage(a.tab_cur);
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
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    order_cancel: function(o) {
        var e = this;
        wx.showModal({
            title: "提示",
            content: "您确定要取消订单吗？",
            showCancel: !0,
            success: function(n) {
                n.confirm ? (wx.showLoading({
                    title: "请稍后",
                    mask: !0
                }), wx.request({
                    url: t.globalData.__api_path + "user-order.php",
                    data: {
                        uid: t.globalData.__uid,
                        token: t.globalData.__token,
                        act: "order_cancel",
                        order_id: o.currentTarget.dataset.order_id
                    },
                    success: function(t) {
                        200 == t.data.code ? (wx.showToast({
                            title: "订单已取消",
                            icon: "success",
                            duration: 2e3
                        }), e.initPage(a.tab_cur)) : wx.showToast({
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
                    complete: function() {
                        wx.hideLoading();
                    }
                })) : n.cancel && console.log("用户点击取消");
            }
        });
    },
    order_confirm: function(o) {
        var e = this;
        wx.showModal({
            title: "提示",
            content: "您确定已经收到货物了吗？",
            showCancel: !0,
            success: function(n) {
                n.confirm ? (wx.showLoading({
                    title: "请稍后",
                    mask: !0
                }), wx.request({
                    url: t.globalData.__api_path + "user-order.php",
                    data: {
                        uid: t.globalData.__uid,
                        token: t.globalData.__token,
                        act: "order_confirm",
                        order_id: o.currentTarget.dataset.order_id
                    },
                    success: function(t) {
                        200 == t.data.code ? e.initPage(a.tab_cur) : wx.showToast({
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
                    complete: function() {
                        wx.hideLoading();
                    }
                })) : n.cancel && console.log("用户点击取消");
            }
        });
    },
    order_del: function(o) {
        var e = this;
        wx.showModal({
            title: "提示",
            content: "您确定要删除订单吗？",
            showCancel: !0,
            success: function(n) {
                n.confirm ? (wx.showLoading({
                    title: "请稍后",
                    mask: !0
                }), wx.request({
                    url: t.globalData.__api_path + "user-order.php",
                    data: {
                        uid: t.globalData.__uid,
                        token: t.globalData.__token,
                        act: "order_del",
                        order_id: o.currentTarget.dataset.order_id
                    },
                    success: function(t) {
                        wx.hideLoading(), 200 == t.data.code ? (wx.showToast({
                            title: "订单已删除",
                            icon: "success",
                            duration: 2e3
                        }), e.initPage(a.tab_cur)) : wx.showToast({
                            title: t.data.msg,
                            duration: 2e3,
                            icon: "none"
                        }), console.log(t);
                    },
                    fail: function(t) {
                        wx.showToast({
                            title: "数据加载失败，请刷新",
                            duration: 2e3
                        });
                    },
                    complete: function() {}
                })) : n.cancel && console.log("用户点击取消");
            }
        });
    },
    order_return: function(t) {
        wx.navigateTo({
            url: "/pages/user-order-return/order-return?order_id=" + t.target.dataset.order_id
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});