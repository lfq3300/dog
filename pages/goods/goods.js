var t = getApp(), o = {
    goods: {
        id: 0,
        quantity: 1,
        stock: 20
    },
    _timeout: null
};

Page({
    data: {
        isDiscount: !1,
        isGoods_tab: "details",
        is_coupon_show: !1,
        coupon_anim: {},
        coupon_anim_bg: {},
        goods_quantity: 1,
        end_h: "--",
        end_i: "--",
        end_s: "--"
    },
    onLoad: function(t) {
        o.goods.quantity = 1, o.goods.id = t.id, this.initPage();
    },
    onShow: function() {
        clearTimeout(o._timeout);
    },
    initPage: function() {
        t.initCallback(function() {
            this.goodsDetails(), this.getCoupon(), this.getPromotion();
        }.bind(this));
    },
    goodsDetails: function() {
        var a = this;
        wx.showLoading({
            title: "加载商品",
            mask: !0
        }), wx.request({
            url: t.globalData.__api_path + "goods.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "goods_details",
                id: o.goods.id
            },
            success: function(t) {
                200 == t.data.code ? (a.setData({
                    result_data: t.data.result,
                    as_time: t.data.result.as_time
                }), o.goods.stock = t.data.result.goods_stock, o._timeout = setTimeout(function() {
                    a.countDown(t.data.result.as_time);
                }, 1e3), App.zhuge.track("进入商品详情页面", {
                    "平台": "小程序",
                    "商品型号": t.data.result.goods_shop,
                    "商品名称": t.data.result.goods_name,
                    "商品价格": t.data.result.goods_price
                }), wx.hideLoading()) : wx.showToast({
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
    getCoupon: function() {
        var a = this;
        wx.request({
            url: t.globalData.__api_path + "goods.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "coupon",
                id: o.goods.id
            },
            success: function(t) {
                200 == t.data.code ? a.setData({
                    result_coupon: t.data.result
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
    receive_coupon: function(o) {
        wx.request({
            url: t.globalData.__api_path + "coupon.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "receive",
                id: o.currentTarget.dataset.id
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
                    mask: !0,
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
        }), console.log(o.currentTarget.dataset.id);
    },
    getPromotion: function() {
        var a = this;
        wx.request({
            url: t.globalData.__api_path + "goods.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "promotion",
                id: o.goods.id
            },
            success: function(t) {
                200 == t.data.code ? a.setData({
                    result_promotion: t.data.result
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
    quantity_reduce: function() {
        if (o.goods.quantity <= 1) return wx.showToast({
            title: "不能少于1",
            mask: !0
        }), !1;
        o.goods.quantity--, this.setData({
            goods_quantity: o.goods.quantity
        });
    },
    quantity_plus: function() {
        if (o.goods.quantity >= o.goods.stock) return wx.showToast({
            title: "不能超过" + o.goods.stock + "件",
            mask: !0
        }), !1;
        o.goods.quantity++, this.setData({
            goods_quantity: o.goods.quantity
        });
    },
    quantity_input: function(t) {
        if (t.detail.value <= 0 || t.detail.value >= o.goods.stock) return wx.showToast({
            title: "不符合规范",
            duration: 1500,
            mask: !0
        }), this.setData({
            goods_quantity: o.goods.quantity
        }), !1;
        o.goods.quantity = t.detail.value, this.setData({
            goods_quantity: t.detail.value
        });
    },
    goods_cart: function() {
        var t = this;
        this.add_cart(), App.zhuge.track("商品详情页-加入购物车", {
            "平台": "小程序",
            "商品型号": t.data.result_data.goods_shop,
            "商品名称": t.data.result_data.goods_name,
            "商品价格": t.data.result_data.goods_price
        });
    },
    goods_buy: function() {
        var t = this;
        wx.navigateTo({
            url: "../cart-order/order?cart_id=" + o.goods.id + "&quantity=" + o.goods.quantity
        }), App.zhuge.track("商品详情页-点击立即购买", {
            "平台": "小程序",
            "商品型号": t.data.result_data.goods_shop,
            "商品名称": t.data.result_data.goods_name,
            "商品价格": t.data.result_data.goods_price
        });
    },
    add_cart: function(a) {
        wx.showLoading({
            title: "请稍后",
            mask: !0
        }), wx.request({
            url: t.globalData.__api_path + "goods.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "add_cart",
                id: o.goods.id,
                quantity: o.goods.quantity
            },
            success: function(t) {
                200 == t.data.code ? (wx.showToast({
                    title: "添加成功！",
                    icon: "success"
                }), "function" == typeof a && a()) : wx.showToast({
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
    viewDiscount: function() {
        var t = this;
        t.setData({
            isDiscount: !t.data.isDiscount
        });
    },
    tabDisplay: function(t) {
        this.setData({
            isGoods_tab: t.currentTarget.dataset.id
        });
    },
    coupon_show: function() {
        var t = this;
        t.setData({
            is_coupon_show: !0
        }), t.animation = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
        }), t.animation.bottom("0rpx").step(), t.setData({
            coupon_anim: t.animation.export()
        }), t.animation.opacity(1).step(), t.setData({
            coupon_anim_bg: t.animation.export()
        });
    },
    coupon_hide: function() {
        var t = this;
        t.animation = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
        }), t.animation.bottom("-580rpx").step(), t.setData({
            coupon_anim: t.animation.export()
        }), t.animation.opacity(0).step(), t.setData({
            coupon_anim_bg: t.animation.export()
        }), setTimeout(function() {
            t.setData({
                is_coupon_show: !1
            });
        }, 500);
    },
    bind_zhuge_service: function() {
        App.zhuge.track("点击联系客服", {
            "平台": "小程序"
        });
    },
    countDown: function(t) {
        var a = this;
        if (t > 0) {
            var i = Math.floor(t / 86400), n = Math.floor(t / 3600) - 24 * i, e = Math.floor(t / 60) - 24 * i * 60 - 60 * n, s = Math.floor(t) - 24 * i * 60 * 60 - 60 * n * 60 - 60 * e;
            (n += 24 * i) <= 9 && (n = "0" + n), e <= 9 && (e = "0" + e), s <= 9 && (s = "0" + s), 
            a.setData({
                end_h: n,
                end_i: e,
                end_s: s
            }), t--, o._timeout = setTimeout(function() {
                a.countDown(t);
            }, 1e3), console.log("phptime:" + t);
        } else a.setData({
            as_time: -2,
            end_h: "00",
            end_i: "00",
            end_s: "00"
        }), console.log("结束");
    },
    onPullDownRefresh: function() {
        clearTimeout(o._timeout), this.initPage(), wx.stopPullDownRefresh();
    },
    onShareAppMessage: function() {}
});