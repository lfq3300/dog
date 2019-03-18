require("utils/zhuge-wx.min.js");

var n = {
    debug: !1,
    pv: !0
};

App.zhuge.load("aee18546270a4d7583dcdccf4ec4201d", n), App({
    onLaunch: function() {},
    initCallback: function(n) {
        var e = this;
        e.isLogin(function() {
            n(), e.getUser();
        });
    },
    isLogin: function(n) {
        var e = this;
        if (e.globalData.__uid && e.globalData.__token) return n(), !1;
        wx.showLoading({
            title: "正在登录",
            mask: !0
        }), wx.login({
            success: function(t) {
                wx.request({
                    url: e.globalData.__api_path + "login.php",
                    data: {
                        act: "login",
                        code: t.code
                    },
                    success: function(t) {
                        e.globalData.__uid = t.data.uid, e.globalData.__token = t.data.token, n(), App.zhuge.identify("user", {
                            uid: t.data.uid
                        });
                    },
                    fail: function(t) {
                        wx.showModal({
                            title: "提示",
                            content: "登录失败 [" + t.errMsg + "] 点击确定后重新登录！",
                            showCancel: !1,
                            success: function(t) {
                                e.isLogin(n);
                            }
                        });
                    },
                    complete: function(n) {
                        wx.hideLoading();
                    }
                });
            }
        });
    },
    getUser: function() {
        var n = this;
        if (n.globalData.__userInfo) return !1;
        wx.getSetting({
            success: function(e) {
                e.authSetting["scope.userInfo"] && wx.getUserInfo({
                    success: function(e) {
                        n.globalData.__userInfo = e.userInfo, wx.request({
                            url: n.globalData.__api_path + "login.php",
                            method: "GET",
                            data: {
                                act: "userinfo",
                                uid: n.globalData.__uid,
                                token: n.globalData.__token,
                                user_headimg: e.userInfo.avatarUrl,
                                user_city: e.userInfo.city,
                                user_country: e.userInfo.country,
                                user_gender: e.userInfo.gender,
                                user_language: e.userInfo.language,
                                user_nickname: e.userInfo.nickName,
                                user_province: e.userInfo.province
                            },
                            success: function(n) {
                                console.log(n);
                            },
                            fail: function(n) {},
                            complete: function() {}
                        });
                    },
                    complete: function(n) {}
                });
            }
        });
    },
    globalData: {
        __uid: null,
        __token: null,
        __userInfo: null,
        __api_path: "https://wx.xgdq.com/api/",
        __const: null,
        __popup_ad: !0
    }
});