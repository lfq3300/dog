var t = getApp(), i = {
    img_texts: [],
    old_cls: [],
    id: 0
};

Page({
    data: {
        swiper_text: ""
    },
    onLoad: function(t) {
        var a = this;
        i.id = t.id || 0, a._animation1 = wx.createAnimation({
            duration: 300,
            timingFunction: "linear"
        }), a._animation2 = wx.createAnimation({
            duration: 500,
            timingFunction: "linear"
        }), a.initPage(), a.icon_anim();
    },
    initPage: function(i) {
        var a = this;
        t.initCallback(function() {
            a.oldDetails();
        });
    },
    oldDetails: function() {
        var a = this;
        wx.request({
            url: t.globalData.__api_path + "old.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                id: i.id,
                act: "old_details"
            },
            success: function(t) {
                200 == t.data.code ? (i.img_texts = t.data.result.old_pic_desc, i.old_cls = t.data.result.old_cls, 
                a.setData({
                    result: t.data.result,
                    swiper_text: i.img_texts[0]
                })) : wx.showToast({
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
    swiper_start: function(t) {
        var i = this;
        i._animation1.opacity(0).step(), i.setData({
            swiper_anim: i._animation1.export()
        });
    },
    swiper_end: function(t) {
        var a = this, n = t.detail.current;
        a._animation1.opacity(1).step(), a.setData({
            swiper_anim: a._animation1.export(),
            swiper_text: i.img_texts[n]
        });
    },
    get_cls: function() {
        return i.old_cls;
    },
    icon_anim: function() {
        var t = this;
        t._animation2.scale(.95, .95).step(), t._animation2.scale(1, 1).step(), t.setData({
            homeicon_anim: t._animation2.export()
        }), t._timeout2 = setTimeout(function() {
            t.icon_anim();
        }, 1e3);
    },
    onShareAppMessage: function() {}
});