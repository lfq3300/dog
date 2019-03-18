var t = getApp(), o = {
    activity: {
        id: 0
    },
    _timeout: null
};

Page({
    data: {
        end_h: "--",
        end_i: "--",
        end_s: "--"
    },
    onLoad: function(t) {
        o.activity.id = t.id, this.initPage();
    },
    initPage: function() {
        var n = this;
        if (o.activity.id <= 0) return !1;
        wx.request({
            url: t.globalData.__api_path + "activity.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "info",
                id: o.activity.id
            },
            success: function(t) {
                200 == t.data.code ? (n.setData({
                    result: t.data.result,
                    as_time: t.data.result.as_time
                }), o._timeout = setTimeout(function() {
                    n.countDown(t.data.result.as_time);
                }, 1e3)) : wx.showToast({
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
    countDown: function(t) {
        var n = this;
        if (t > 0) {
            var i = Math.floor(t / 86400), e = Math.floor(t / 3600) - 24 * i, a = Math.floor(t / 60) - 24 * i * 60 - 60 * e, u = Math.floor(t) - 24 * i * 60 * 60 - 60 * e * 60 - 60 * a;
            (e += 24 * i) <= 9 && (e = "0" + e), a <= 9 && (a = "0" + a), u <= 9 && (u = "0" + u), 
            n.setData({
                end_h: e,
                end_i: a,
                end_s: u
            }), t--, o._timeout = setTimeout(function() {
                n.countDown(t);
            }, 1e3), console.log("phptime:" + t);
        } else n.setData({
            as_time: -2,
            end_h: "00",
            end_i: "00",
            end_s: "00"
        }), console.log("结束");
    },
    onReady: function() {},
    onShow: function() {
        clearTimeout(o._timeout);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});