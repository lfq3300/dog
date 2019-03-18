var t = getApp();

Page({
    data: {
        item_anim: {},
        check_all: !1
    },
    config: {
        item_toggle: [],
        touch_start: {
            x: 0,
            y: 0,
            id: 0
        },
        is_check_all: !1
    },
    onLoad: function(t) {},
    onShow: function() {
        this.initPage();
    },
    initPage: function() {
        var a = this;
        wx.showLoading({
            title: "加载购物车",
            mask: !0
        }), wx.request({
            url: t.globalData.__api_path + "cart.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "get_cart"
            },
            success: function(t) {
                200 == t.data.code ? (a.setData({
                    result_data: t.data.cart,
                    check_all: t.data.cart.isAll
                }), a.config.is_check_all = t.data.cart.isAll, App.zhuge.track("进入购物车页面", {
                    "平台": "小程序",
                    "商品个数": t.data.cart.select_quantity,
                    "总价": t.data.cart.total_price
                }), wx.hideLoading()) : wx.showToast({
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
    radioChange: function(t) {
        this.setCart("is_cheched", t.currentTarget.dataset.cart_id);
    },
    allChange: function(t) {
        var a = this.config.is_check_all ? "cancel_all" : "select_all";
        this.config.is_check_all = !this.config.is_check_all, this.setCart(a);
    },
    quantity_reduce: function(t) {
        this.setCart("reduce", t.currentTarget.dataset.cart_id);
    },
    quantity_plus: function(t) {
        this.setCart("plus", t.currentTarget.dataset.cart_id);
    },
    quantity_input: function(t) {
        this.setCart("input", t.currentTarget.dataset.cart_id, t.detail.value);
    },
    setCart: function(a, i, e) {
        var o = this, n = {
            uid: t.globalData.__uid,
            token: t.globalData.__token,
            act: a
        };
        i && (n.cart_id = i), e && (n.quantity = e), wx.showLoading({
            title: "请稍后",
            mask: !0
        }), wx.request({
            url: t.globalData.__api_path + "cart.php",
            data: n,
            success: function(t) {
                200 == t.data.code ? wx.hideLoading() : wx.showToast({
                    title: t.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), t.data.cart && (o.setData({
                    result_data: t.data.cart,
                    check_all: t.data.cart.isAll
                }), o.config.is_check_all = t.data.cart.isAll), console.log(t);
            },
            fail: function(t) {
                wx.hideLoading(), wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 2e3,
                    icon: "none"
                });
            },
            complete: function() {}
        });
    },
    to_category: function() {
        wx.switchTab({
            url: "../category/category"
        });
    },
    item_isRemove: function(t) {
        var a = this, i = [ 0 ];
        a.animation = wx.createAnimation({
            duration: 400,
            timingFunction: "ease-out"
        }), a.config.item_toggle[t] ? (a.config.item_toggle[t] = !1, a.animation.translateX(0).step()) : (a.config.item_toggle[t] = !0, 
        a.animation.translateX(-75).step()), i[t] = a.animation.export(), a.setData({
            item_anim: i
        });
    },
    bind_isRemove: function(t) {
        this.item_isRemove(t.target.dataset.id);
    },
    itemStart: function(t) {
        this.config.touch_start.x = t.touches[0].clientX, this.config.touch_start.id = t.currentTarget.dataset.id;
    },
    itemEnd: function(t) {
        this.config.touch_start.x - t.changedTouches[0].clientX > 50 ? this.config.item_toggle[this.config.touch_start.id] || this.item_isRemove(this.config.touch_start.id) : this.config.touch_start.x - t.changedTouches[0].clientX < -50 && this.config.item_toggle[this.config.touch_start.id] && this.item_isRemove(this.config.touch_start.id);
    },
    goods_del: function(a) {
        var i = a.target.dataset.id, e = this;
        wx.showModal({
            title: "提示",
            content: "您确定要删除商品吗？",
            showCancel: !0,
            success: function(a) {
                a.confirm ? wx.request({
                    url: t.globalData.__api_path + "cart.php",
                    data: {
                        uid: t.globalData.__uid,
                        token: t.globalData.__token,
                        act: "cart_del",
                        cart_id: i
                    },
                    success: function(t) {
                        200 == t.data.code ? (wx.showToast({
                            title: "删除成功！",
                            icon: "success"
                        }), e.item_isRemove(i), e.initPage()) : wx.showToast({
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
                }) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    bindGetUserInfo: function(a) {
        var i = this;
        wx.showLoading({
            title: "正在处理",
            mask: !0
        }), t.getUser(), wx.request({
            url: t.globalData.__api_path + "cart.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "check_cart"
            },
            success: function(t) {
                wx.hideLoading(), 200 == t.data.code ? (wx.navigateTo({
                    url: "../cart-order/order"
                }), App.zhuge.track("购物车页面-点击去结算", {
                    "平台": "小程序",
                    "商品个数": i.data.result_data.select_quantity,
                    "总价": i.data.result_data.total_price
                })) : wx.showToast({
                    title: t.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), console.log(t);
            },
            fail: function(t) {
                wx.hideLoading(), wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 2e3,
                    icon: "none"
                });
            },
            complete: function() {}
        });
    },
    onPullDownRefresh: function() {
        this.initPage(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});