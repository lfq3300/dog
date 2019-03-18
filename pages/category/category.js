var t = getApp(), a = {
    goods: {
        cid: 0
    }
};

Page({
    data: {
        cur_id: 0
    },
    onLoad: function(t) {
        t.id && (a.goods.cid = t.id), this.initPage();
    },
    initPage: function() {
        this.initCategory(), this.initGoods();
    },
    initGoods: function() {
        var o = this;
        wx.request({
            url: t.globalData.__api_path + "category.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "get_goods",
                id: a.goods.cid
            },
            success: function(t) {
                200 == t.data.code ? o.setData({
                    result_data_goods: t.data.result
                }) : wx.showToast({
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
    initCategory: function() {
        var a = this;
        wx.request({
            url: t.globalData.__api_path + "category.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                act: "get_category"
            },
            success: function(t) {
                200 == t.data.code ? a.setData({
                    result_data_category: t.data.result
                }) : wx.showToast({
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
    onCat_goods: function(t) {
        var o = t.currentTarget.dataset.id;
        a.goods.cid = o, this.setData({
            cur_id: o,
            result_data_goods: []
        }), this.initGoods(), App.zhuge.track("进入商品列表页面", {
            "平台": "小程序",
            "商品类别": t.currentTarget.dataset.name
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});