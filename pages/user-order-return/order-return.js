var o = getApp(), t = {
    photos: [],
    upload_photos: [],
    oid: 0
};

Page({
    data: {},
    onLoad: function(o) {
        t.upload_photos = [], t.photos = [], t.oid = o.order_id;
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
            success: function(s) {
                s.confirm ? (t.photos.splice(o.target.dataset.id, 1), e.setData({
                    photos: t.photos
                }), console.log(t.photos)) : s.cancel && console.log("用户点击取消");
            }
        });
    },
    formBindsubmit: function(o) {
        var e = this, s = o.detail.value;
        if (!s.comment_content) return wx.showToast({
            title: "请输入说明内容",
            icon: "none"
        }), !1;
        wx.showLoading({
            title: "上传图片",
            mask: !0
        }), e.setImages(0, function() {
            s.comment_pic = t.upload_photos.join(","), t.upload_photos = [], e.setInfo(s);
        });
    },
    setInfo: function(e) {
        wx.showLoading({
            title: "正在保存",
            mask: !0
        }), wx.request({
            url: o.globalData.__api_path + "user-after_sale.php",
            data: {
                uid: o.globalData.__uid,
                token: o.globalData.__token,
                act: "add_after_sale",
                order_id: t.oid,
                or_pic: e.comment_pic,
                or_type: e.comment_type,
                or_content: e.comment_content
            },
            success: function(o) {
                200 == o.data.code ? wx.showModal({
                    title: "提示",
                    content: "申请提交成功，点击确定返回上级页面。",
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && wx.redirectTo({
                            url: "/pages/user-after-sale/after-sale"
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
    setImages: function(e, s) {
        if (t.photos.length <= 0) return s(), !1;
        var a = this;
        wx.uploadFile({
            url: o.globalData.__api_path + "uploadImage.php",
            filePath: t.photos[e],
            name: "file",
            success: function(o) {
                console.log(o), t.upload_photos.push(o.data);
            },
            fail: function() {},
            complete: function() {
                ++e == t.photos.length ? s() : a.setImages(e, s);
            }
        });
    },
    onShareAppMessage: function() {}
});