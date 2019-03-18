var o = getApp(), e = {
    order: {
        address: null,
        select_coupon: null,
        order_info: null,
        cart_id: 0,
        cart_quantity: 1
    },
    source: "",
    is_activity: 0
};

Page({
    data: {
        is_coupon_show: !1,
        is_address_show: !1,
        coupon_anim: {},
        coupon_anim_bg: {},
        submit_style: ""
    },
    onLoad: function(o) {
        e.source = o.source || "", e.order.cart_id = o.cart_id || 0, e.order.cart_quantity = o.quantity || 1, 
        this.initPage();
    },
    initPage: function() {
        e.order.select_coupon = null, e.order.order_info = null, e.order.address && this.setData({
            address: e.order.address
        }), this.initCart(), this.getCoupon();
    },
    getCoupon: function() {
        var e = this;
        wx.request({
            url: o.globalData.__api_path + "cart-order.php",
            data: {
                uid: o.globalData.__uid,
                token: o.globalData.__token,
                act: "coupon"
            },
            success: function(o) {
                200 == o.data.code ? e.setData({
                    result_coupon: o.data.result
                }) : wx.showToast({
                    title: o.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), console.log(o);
            },
            fail: function(o) {
                wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 2e3,
                    icon: "none"
                });
            },
            complete: function() {}
        });
    },
    setCoupon: function(t) {
        var r = this, a = t.currentTarget.dataset.id;
        wx.request({
            url: o.globalData.__api_path + "cart-order.php",
            data: {
                uid: o.globalData.__uid,
                token: o.globalData.__token,
                act: "use-coupon",
                uc_id: a,
                cart_id: e.order.cart_id,
                cart_quantity: e.order.cart_quantity
            },
            success: function(o) {
                200 == o.data.code ? (r.setData({
                    select_coupon: o.data.result
                }), e.order.select_coupon = o.data.result, e.order.select_coupon.uc_id = a, r.coupon_hide(), 
                e.order.order_info.coupon_price = o.data.result.coupon_rule[1], e.order.order_info.order_new_price = e.order.order_info.order_price - o.data.result.coupon_rule[1], 
                e.order.order_info.order_new_price < 0 && (e.order.order_info.order_new_price = 0), 
                r.setData({
                    order_info: e.order.order_info
                })) : wx.showToast({
                    title: o.data.msg,
                    duration: 1e3,
                    icon: "none"
                }), console.log(o);
            },
            fail: function(o) {
                wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 1e3,
                    icon: "none"
                });
            },
            complete: function() {}
        });
    },
    inputWacth: function(o) {
        o.detail.value ? this.setData({
            submit_style: "submit_red"
        }) : this.setData({
            submit_style: ""
        });
    },
    hide_msg: function() {
        this.setData({
            is_address_show: !1
        });
    },
    open_setting: function() {
        wx.openSetting({
            success: function(o) {
                console.log(o.authSetting["scope.address"]);
            }
        }), this.hide_msg();
    },
    selectAddress: function() {
        var o = this;
        wx.chooseAddress({
            success: function(t) {
                e.order.address = t, o.setData({
                    address: e.order.address
                }), console.log(t);
            },
            fail: function(e) {
                "chooseAddress:fail auth deny" == e.errMsg && o.setData({
                    is_address_show: !0
                }), console.log(e);
            }
        });
    },
    initCart: function() {
        var t = this;
        wx.request({
            url: o.globalData.__api_path + "cart-order.php",
            data: {
                uid: o.globalData.__uid,
                token: o.globalData.__token,
                act: "order_cart",
                cart_id: e.order.cart_id,
                cart_quantity: e.order.cart_quantity
            },
            success: function(o) {
                200 == o.data.code ? (e.order.order_info = o.data.order, e.order.order_info.coupon_price = 0, 
                e.order.order_info.order_new_price = e.order.order_info.order_price, t.setData({
                    order_info: e.order.order_info
                }), App.zhuge.track("进入订单页面", {
                    "平台": "小程序",
                    "商品个数": o.data.order.total_quantity,
                    "总价": o.data.order.total_price
                }), o.data.order.select_coupon.uc_id && t.setCoupon({
                    currentTarget: {
                        dataset: {
                            id: o.data.order.select_coupon.uc_id
                        }
                    }
                })) : wx.showToast({
                    title: o.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), console.log(o);
            },
            fail: function(o) {
                wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 2e3,
                    icon: "none"
                });
            },
            complete: function() {}
        });
    },
    coupon_show: function() {
        var o = this;
        o.setData({
            is_coupon_show: !0
        }), o.animation = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
        }), o.animation.bottom("0rpx").step(), o.setData({
            coupon_anim: o.animation.export()
        }), o.animation.opacity(1).step(), o.setData({
            coupon_anim_bg: o.animation.export()
        });
    },
    coupon_hide: function() {
        var o = this;
        o.animation = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
        }), o.animation.bottom("-580rpx").step(), o.setData({
            coupon_anim: o.animation.export()
        }), o.animation.opacity(0).step(), o.setData({
            coupon_anim_bg: o.animation.export()
        }), setTimeout(function() {
            o.setData({
                is_coupon_show: !1
            });
        }, 500);
    },
    submit_order: function() {
        var t = 0;
        if (!e.order.address) return wx.showToast({
            title: "请选择地址",
            icon: "none",
            duration: 1e3
        }), !1;
        e.order.select_coupon && (t = e.order.select_coupon.uc_id), App.zhuge.track("订单页面-点击提交订单", {
            "平台": "小程序",
            "商品金额": e.order.order_info.total_price,
            "优惠金额": e.order.order_info.discount_price + e.order.order_info.coupon_price,
            "应付金额": e.order.order_info.order_price,
            "收货人姓名": e.order.address.userName,
            "收货省市": e.order.address.provinceName + "-" + e.order.address.cityName + "-" + e.order.address.countyName
        }), wx.showLoading({
            title: "请稍后",
            mask: !0
        }), wx.request({
            url: o.globalData.__api_path + "cart-order.php",
            data: {
                uid: o.globalData.__uid,
                token: o.globalData.__token,
                act: "order_submit",
                cart_id: e.order.cart_id,
                cart_quantity: e.order.cart_quantity,
                order_coupon: t,
                order_user_name: e.order.address.userName,
                order_user_code: e.order.address.postalCode,
                order_user_address: e.order.address.detailInfo,
                order_user_mobile: e.order.address.telNumber,
                order_user_region: e.order.address.provinceName + "-" + e.order.address.cityName + "-" + e.order.address.countyName
            },
            success: function(o) {
                200 == o.data.code ? (e.is_activity = o.data.other.is_activity, wx.requestPayment({
                    timeStamp: o.data.result.timeStamp,
                    nonceStr: o.data.result.nonceStr,
                    package: o.data.result.package,
                    signType: o.data.result.signType,
                    paySign: o.data.result.paySign,
                    success: function(e) {
                        console.log(e), App.zhuge.track("支付成功", {
                            "平台": "小程序",
                            "订单编号": o.data.order.order_no,
                            "下单日期": o.data.order.order_time,
                            "支付方式": "微信",
                            "收货人姓名": o.data.order.order_user_name,
                            "收货省市": o.data.order.order_user_region,
                            "应付金额": o.data.order.order_total_price
                        });
                    },
                    fail: function(e) {
                        console.log(e), App.zhuge.track("支付失败", {
                            "平台": "小程序",
                            "订单编号": o.data.order.order_no,
                            "下单日期": o.data.order.order_time,
                            "支付方式": "微信",
                            "收货人姓名": o.data.order.order_user_name,
                            "收货省市": o.data.order.order_user_region,
                            "应付金额": o.data.order.order_total_price,
                            "失败原因": "用户取消"
                        });
                    },
                    complete: function(t) {
                        wx.showLoading({
                            title: "正在处理订单...",
                            mask: !0
                        }), setTimeout(function() {
                            wx.hideLoading(), 1 == e.is_activity && "old" == e.source ? wx.redirectTo({
                                url: "../old/old-activity/activity"
                            }) : wx.redirectTo({
                                url: "../user-order/order"
                            });
                        }, 2e3), console.log(e, o);
                    }
                }), wx.hideLoading()) : wx.showToast({
                    title: o.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), console.log(o);
            },
            fail: function(o) {
                wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 2e3,
                    icon: "none"
                });
            },
            complete: function() {}
        });
    },
    submit_code: function(e) {
        var t = this;
        if (!e.detail.value.code) return wx.showToast({
            title: "兑换码不能为空",
            duration: 2e3,
            icon: "none"
        }), !1;
        wx.showLoading({
            title: "请稍后",
            mask: !0
        }), wx.request({
            url: o.globalData.__api_path + "coupon.php",
            data: {
                uid: o.globalData.__uid,
                token: o.globalData.__token,
                act: "receive-code",
                code: e.detail.value.code
            },
            success: function(o) {
                wx.hideLoading(), 200 == o.data.code ? wx.showModal({
                    title: "提示",
                    content: "兑换成功！",
                    showCancel: !1,
                    success: function(o) {
                        t.getCoupon();
                    }
                }) : wx.showToast({
                    title: o.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), console.log(o);
            },
            fail: function(o) {
                wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 2e3,
                    icon: "none"
                });
            },
            complete: function() {}
        }), console.log(e);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});