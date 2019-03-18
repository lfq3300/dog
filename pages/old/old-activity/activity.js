var t = getApp(), e = {
    photo: "",
    sex: 1,
    save_url: "",
    boy: [],
    girl: [],
    index: 0,
    is_dm: !0
};

Page({
    data: {
        scene: "sc1",
        btn: "b1",
        tpl: "../../../assets/images/old/mb-1.jpg"
    },
    onLoad: function(t) {
        this.initPage();
    },
    initPage: function() {
        var a = this;
        t.initCallback(function() {
            wx.request({
                url: t.globalData.__api_path + "old.php",
                data: {
                    uid: t.globalData.__uid,
                    token: t.globalData.__token,
                    act: "mergeface_init"
                },
                success: function(t) {
                    200 == t.data.code ? (a.setData({
                        result: t.data.result
                    }), e.boy = t.data.result.label_boy, e.girl = t.data.result.label_girl, a.init_danmu()) : wx.showToast({
                        title: t.data.msg,
                        duration: 2e3,
                        icon: "none"
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
        });
    },
    bind_canyu: function() {
        this.setData({
            scene: "sc2"
        });
    },
    bind_bucanyu: function() {
        wx.switchTab({
            url: "../../index/index"
        });
    },
    bind_photo: function(t) {
        this.setData({
            tpl: "../../../assets/images/old/mb-" + t.currentTarget.dataset.sex + ".jpg"
        }), e.sex = t.currentTarget.dataset.sex;
    },
    bind_upload: function() {
        var a = this;
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(n) {
                e.photo = n.tempFilePaths[0], wx.showLoading({
                    title: "请稍后",
                    mask: !0
                }), wx.uploadFile({
                    url: t.globalData.__api_path + "old.php?act=mergeface&sex=" + e.sex + "&uid=1&token=even.zhang",
                    filePath: e.photo,
                    name: "file",
                    success: function(t) {
                        var n = JSON.parse(t.data);
                        200 == n.code ? (a.setData({
                            tpl: n.result.url,
                            btn: "b2"
                        }), e.save_url = n.result.save_url) : wx.showToast({
                            title: n.msg,
                            duration: 2e3,
                            icon: "none"
                        }), console.log(n);
                    },
                    fail: function() {},
                    complete: function() {
                        wx.hideLoading();
                    }
                });
            }
        });
    },
    bind_save: function() {
        wx.showLoading({
            title: "请稍后",
            mask: !0
        }), wx.downloadFile({
            url: e.save_url,
            success: function(t) {
                wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function(t) {
                        wx.showModal({
                            title: "提示",
                            content: "保存成功，可以在手机相册中查看！",
                            showCancel: !1,
                            success: function(t) {
                                t.confirm ? wx.switchTab({
                                    url: "../../index/index"
                                }) : t.cancel && console.log("用户点击取消");
                            }
                        }), console.log(t);
                    },
                    fail: function(t) {
                        console.log(t);
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                });
            },
            fail: function() {
                console.log("fail");
            }
        });
    },
    bind_reply: function() {
        this.setData({
            btn: "b1",
            tpl: "../../../assets/images/old/mb-" + e.sex + ".jpg"
        }), e.photo = "";
    },
    formBindsubmit: function(a) {
        var n = this, i = a.detail.value.danmu;
        if (!e.is_dm) return wx.showToast({
            title: "每分钟只能发送一条弹幕",
            duration: 2e3,
            icon: "none"
        }), !1;
        i ? wx.request({
            url: t.globalData.__api_path + "old.php",
            data: {
                uid: t.globalData.__uid,
                token: t.globalData.__token,
                sex: e.sex,
                dm_text: i,
                act: "danmu_save"
            },
            success: function(t) {
                200 == t.data.code ? (e.boy.push(i), e.girl.push(i), wx.showToast({
                    title: "发送成功",
                    duration: 1e3
                }), n.setData({
                    danmu_value: ""
                }), e.is_dm = !1, setTimeout(function() {
                    e.is_dm = !0;
                }, 6e4)) : wx.showToast({
                    title: t.data.msg,
                    duration: 2e3,
                    icon: "none"
                }), console.log(t);
            },
            fail: function(t) {
                wx.showToast({
                    title: "数据加载失败，请刷新",
                    duration: 2e3
                });
            },
            complete: function() {}
        }) : wx.showToast({
            title: "内容不能为空",
            duration: 2e3,
            icon: "none"
        });
    },
    init_danmu: function() {
        var t = this, e = 3e3 * Math.random() + 3e3, a = 3e3 * Math.random() + 3e3, n = 3e3 * Math.random() + 3e3, i = 3e3 * Math.random() + 3e3, o = 3e3 * Math.random() + 3e3;
        t.light_anim_loop({
            dm_anim1: t.light_anim(e),
            label_text1: t.get_text()
        }, {
            dm_anim1: t.end_anim()
        }, 0, e), t.light_anim_loop({
            dm_anim2: t.light_anim(a),
            label_text2: t.get_text()
        }, {
            dm_anim2: t.end_anim()
        }, 500, a), t.light_anim_loop({
            dm_anim3: t.light_anim(n),
            label_text3: t.get_text()
        }, {
            dm_anim3: t.end_anim()
        }, 300, n), t.light_anim_loop({
            dm_anim4: t.light_anim(i),
            label_text4: t.get_text()
        }, {
            dm_anim4: t.end_anim()
        }, 800, i), t.light_anim_loop({
            dm_anim5: t.light_anim(o),
            label_text5: t.get_text()
        }, {
            dm_anim5: t.end_anim()
        }, 600, o), console.log("init_danmu");
    },
    light_anim: function(t) {
        var e = wx.createAnimation({
            timingFunction: "linear"
        });
        return e.translateX(-375).step({
            duration: t
        }), e.export();
    },
    end_anim: function() {
        var t = wx.createAnimation({
            timingFunction: "linear"
        });
        return t.translateX(375).step({
            duration: 0
        }), t.export();
    },
    light_anim_loop: function(t, e, a, n) {
        var i = this, o = 3e3 * Math.random() + 3e3;
        setTimeout(function() {
            t.label_text1 && (t.label_text1 = i.get_text()), t.label_text2 && (t.label_text2 = i.get_text()), 
            t.label_text3 && (t.label_text3 = i.get_text()), t.label_text4 && (t.label_text4 = i.get_text()), 
            t.label_text5 && (t.label_text5 = i.get_text()), t.dm_anim1 && (t.dm_anim1 = i.light_anim(o)), 
            t.dm_anim2 && (t.dm_anim2 = i.light_anim(o)), t.dm_anim3 && (t.dm_anim3 = i.light_anim(o)), 
            t.dm_anim4 && (t.dm_anim4 = i.light_anim(o)), t.dm_anim5 && (t.dm_anim5 = i.light_anim(o)), 
            i.setData(e), i.setData(t), i.light_anim_loop(t, e, o, o);
        }, a);
    },
    get_text: function() {
        var t = [];
        return t = 1 == e.sex ? e.boy : e.girl, e.index >= t.length && (e.index = 0), e.index++, 
        t[e.index - 1];
    },
    onShareAppMessage: function() {}
});