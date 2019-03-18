var s = getApp();

Page({
    data: {
        is_address_show: !1
    },
    onLoad: function(n) {
        this.setData({
            userinfo: s.globalData.__userInfo
        }), App.zhuge.track("进入我的页面", {
            "平台": "小程序"
        });
    },
    bindGetUserInfo: function(n) {
        s.getUser(), this.setData({
            userinfo: n.detail.userInfo
        });
    },
    hide_msg: function() {
        this.setData({
            is_address_show: !1
        });
    },
    open_setting: function() {
        wx.openSetting({
            success: function(s) {
                console.log(s.authSetting["scope.address"]);
            }
        }), this.hide_msg();
    },
    selectAddress: function() {
        var s = this;
        wx.chooseAddress({
            success: function(s) {
                console.log(s);
            },
            fail: function(n) {
                "chooseAddress:fail auth deny" == n.errMsg && s.setData({
                    is_address_show: !0
                }), console.log(n);
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});