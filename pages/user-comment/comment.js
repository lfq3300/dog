var o = getApp(), t = {
    photos: [],
    upload_photos: [],
    oid: 0,
    gid: 0
};

Page({
    data: {},
    onLoad: function(o) {
        t.upload_photos = [], t.photos = [], t.oid = o.order_id, t.gid = o.goods_id, this.initPage();
    },
    initPage: function() {
        var e = this;
        wx.request({
            url: o.globalData.__api_path + "user-order.php",
            data: {
                uid: o.globalData.__uid,
                token: o.globalData.__token,
                act: "order_goods_details",
                order_id: t.oid,
                goods_id: t.gid
            },
            success: function(o) {
                200 == o.data.code ? e.setData({
                    result_data: o.data.result
                }) : wx.showModal({
                    title: "提示",
                    content: o.data.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && wx.redirectTo({
                            url: "/pages/user-order/order"
                        });
                    }
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
    bindImageTap: function() {
        var o = this;
        wx.chooseImage({
            count: 3,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                if (e.tempFilePaths.length + t.photos.length > 3) return wx.showToast({
                    title: "最多支持3张照片哦！",
                    icon: "none"
                }), !1;
                t.photos.push.apply(t.photos, e.tempFilePaths), o.setData({
                    photos: t.photos
                }), console.log(e), console.log(t.photos);
            }
        });
    },
    removeImage: function(o) {
        var e = this;
        wx.showModal({
            title: "提示",
            content: "您确定要删除一张图片吗",
            success: function(a) {
                a.confirm ? (t.photos.splice(o.target.dataset.id, 1), e.setData({
                    photos: t.photos
                }), console.log(t.photos)) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    formBindsubmit: function(o) {
        var e = this, a = o.detail.value;
        if (!a.comment_content) return wx.showToast({
            title: "请输入评论内容",
            icon: "none"
        }), !1;
        wx.showLoading({
            title: "上传图片",
            mask: !0
        }), e.setImages(0, function() {
            a.comment_pic = t.upload_photos.join(","), t.upload_photos = [], e.setInfo(a);
        });
    },
    setInfo: function(e) {
        wx.showLoading({
            title: "正在保存",
            mask: !0
        }), wx.request({
            url: o.globalData.__api_path + "user-order.php",
            data: {
                uid: o.globalData.__uid,
                token: o.globalData.__token,
                act: "add_comment",
                order_id: t.oid,
                goods_id: t.gid,
                comment_pic: e.comment_pic,
                comment_content: e.comment_content
            },
            success: function(o) {
                200 == o.data.code ? wx.showModal({
                    title: "提示",
                    content: "信息提交成功，点击确定返回上级页面。",
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && wx.redirectTo({
                            url: "/pages/user-order/order"
                        });
                    }
                }) : wx.showModal({
                    title: "提示",
                    content: o.data.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && wx.redirectTo({
                            url: "/pages/user-order/order"
                        });
                    }
                }), console.log(o);
            },
            fail: function(o) {
                wx.showToast({
                    title: "保存失败，请重试",
                    duration: 2e3,
                    icon: "none"
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    setImages: function(e, a) {
        if (t.photos.length <= 0) return a(), !1;
        var n = this;
        wx.uploadFile({
            url: o.globalData.__api_path + "uploadImage.php",
            filePath: t.photos[e],
            name: "file",
            success: function(o) {
                console.log(o), t.upload_photos.push(o.data);
            },
            fail: function() {},
            complete: function() {
                ++e == t.photos.length ? a() : n.setImages(e, a);
            }
        });
    },
    onShareAppMessage: function() {}
});