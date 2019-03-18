var o = getApp(), t = {
    goods: {
        id: 0,
        photos: []
    }
};

Page({
    data: {},
    onLoad: function(o) {
        t.goods.id = o.id, this.initPage();
    },
    initPage: function() {
        var a = this;
        wx.request({
            url: o.globalData.__api_path + "goods.php",
            data: {
                uid: o.globalData.__uid,
                token: o.globalData.__token,
                act: "comment",
                id: t.goods.id
            },
            success: function(o) {
                200 == o.data.code ? (a.setData({
                    result_data: o.data.result
                }), t.goods.photos = o.data.result) : wx.showToast({
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
    imageplus: function(o) {
        var a = o.currentTarget.dataset;
        wx.previewImage({
            current: a.url,
            urls: t.goods.photos[a.id].comment_pic_array
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});