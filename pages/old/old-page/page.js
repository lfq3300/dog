var t = getApp(), o = {
    photos: [],
    upload_photos: []
};

Page({
    data: {
        item_hidden: !0,
        picker_region: "地区信息",
        picker_region_array: [],
        picker_date: "选择日期"
    },
    onLoad: function(t) {
        o.upload_photos = [], o.photos = [], this.initPage(), this.setData({
            current_time: this.get_time()
        });
    },
    initPage: function() {
        var t = getCurrentPages();
        if (t.length > 1) {
            var o = t[t.length - 2];
            this.setData({
                item_cls: o.get_cls()
            });
        }
    },
    region_change: function(t) {
        var o = this, e = t.detail.value;
        o.setData({
            picker_region: e[0] + "-" + e[1] + "-" + e[2],
            picker_region_array: e
        });
    },
    region_cancel: function(t) {},
    date_change: function(t) {
        console.log(t);
        var o = this, e = t.detail.value;
        o.setData({
            picker_date: e
        });
    },
    date_cancel: function(t) {},
    bindImageTap: function() {
        var t = this;
        wx.chooseImage({
            count: 3,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                if (e.tempFilePaths.length + o.photos.length > 3) return wx.showToast({
                    title: "最多支持3张照片哦！",
                    icon: "none"
                }), !1;
                o.photos.push.apply(o.photos, e.tempFilePaths), t.setData({
                    photos: o.photos
                }), console.log(e), console.log(o.photos);
            }
        });
    },
    removeImage: function(t) {
        var e = this;
        wx.showModal({
            title: "提示",
            content: "您确定要删除一张图片吗",
            success: function(a) {
                a.confirm ? (o.photos.splice(t.target.dataset.id, 1), e.setData({
                    photos: o.photos
                }), console.log(o.photos)) : a.cancel && console.log("用户点击取消");
            }
        });
    },
    setImages: function(e, a) {
        if (o.photos.length <= 0) return a(), !1;
        var n = this;
        wx.uploadFile({
            url: t.globalData.__api_path + "uploadImage.php",
            filePath: o.photos[e],
            name: "file",
            success: function(t) {
                console.log(t), o.upload_photos.push(t.data);
            },
            fail: function() {},
            complete: function() {
                ++e == o.photos.length ? a() : n.setImages(e, a);
            }
        });
    },
    formBindsubmit: function(t) {
        var e = this, a = t.detail.value, n = {
            old_cls_name: a.old_cls_other || e.data.item_cls_name,
            old_name: a.old_name,
            old_mobile: a.old_mobile,
            old_region: e.data.picker_region,
            old_best_date: e.data.picker_date,
            old_address: a.old_address
        };
        return n.old_cls_name ? n.old_name ? n.old_mobile ? n.old_region && "地区信息" != n.old_region ? n.old_address ? n.old_best_date && "选择日期" != n.old_best_date ? (wx.showLoading({
            title: "上传图片",
            mask: !0
        }), void e.setImages(0, function() {
            n.old_pic = o.upload_photos.join(","), o.upload_photos = [], e.setInfo(n);
        })) : (wx.showToast({
            title: "请选择上门日期",
            icon: "none"
        }), !1) : (wx.showToast({
            title: "请输入街道门牌信息",
            icon: "none"
        }), !1) : (wx.showToast({
            title: "请选择地区信息",
            icon: "none"
        }), !1) : (wx.showToast({
            title: "请输入手机或固话",
            icon: "none"
        }), !1) : (wx.showToast({
            title: "请输入姓名",
            icon: "none"
        }), !1) : (wx.showToast({
            title: "请选择或输入一个分类",
            icon: "none"
        }), !1);
    },
    setInfo: function(o) {
        wx.showLoading({
            title: "正在保存",
            mask: !0
        }), o.uid = t.globalData.__uid, o.token = t.globalData.__token, o.act = "add", wx.request({
            url: t.globalData.__api_path + "old.php",
            data: o,
            success: function(t) {
                200 == t.data.code ? wx.showModal({
                    title: "提示",
                    content: "信息提交成功。",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "../old-success/success"
                        });
                    }
                }) : wx.showToast({
                    title: t.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), console.log(t);
            },
            fail: function(t) {
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
    onMore: function() {
        var t = this;
        t.setData({
            item_hidden: !t.data.item_hidden
        }), t.data.item_hidden;
    },
    inputWacth: function(t) {
        t.detail.value && this.setData({
            item_cls_name: ""
        });
    },
    cls_change: function(t) {
        this.setData({
            item_cls_name: t.currentTarget.dataset.name,
            item_cls_other: ""
        });
    },
    get_time: function() {
        var t = new Date(), o = t.getFullYear(), e = t.getMonth() + 1, a = t.getDate();
        return e < 10 && (e = "0" + e), a < 10 && (a = "0" + a), o + "-" + e + "-" + a;
    },
    onShareAppMessage: function() {}
});