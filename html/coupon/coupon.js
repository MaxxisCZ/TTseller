define(function(require, exports, module) {

    var Http = require('U/http');
    var func = require('U/func');
    var UserInfo = _g.getLS("UserInfo");
    var next = true;
    var pageIndex = 0;
    var coupon = new Vue({
        el: '#content',
        template: _g.getTemplate('coupon/coupon-body-V'),
        data: {
            type: 'A',
            isNetwork: false,
            isList: true,
            isEdit: false,
            index: -1,
            list: [{
                couponID: '123456',
                couponWorkTime: '2016/08/11 0:00:00',
                couponStaffID: '',
                reason: '每日优惠券_管理员发送',
                faceValue: '10',
                describe: '',
                couponType: '',
                couponLimit: '100',
            }],
            recordList: [{
                couponID: '123456', //券ID
                couponUserID: '',
                couponAgentID: '',
                couponGetDate: '2016/08/11 0:00:00',
                couponLostDate: '2016/08/15 0:00:00',
                isCouponWork: '',
                couponStaffID: '', //员工ID
                reason: '每日优惠券_管理员发送',
                faceValue: '10',
                describe: '',
                couponType: '2',
                couponLimit: '100',
            }],
        },
        created: function() {
            this.list = [];
            this.recordList = [];
        },
        methods: {
            onCouponList: function(type) {
                this.isEdit = false;
                if(type == coupon.type) {
                    return
                }
                setTimeout(function() {
                    pageIndex = 0;
                    if (type == 'A') {
                        // coupon.list = [];
                        getListData();
                        coupon.isList = true;
                        coupon.type = 'A';
                    } else if (type == 'B') {
                        // coupon.recordList = [];
                        getRecordData();
                        coupon.isList = false;
                        coupon.type = 'B';
                    }
                    api.sendEvent({
                        name: api.winName + '-updateHeaderData',
                        extra: {
                            isEdit: false,
                        }
                    });
                    this.isEdit = false;
                }, 100);
            },
            onDeleteListTap: function(index) {
                api.confirm({
                    title: '注意',
                    msg: '确定删除该优惠券？',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if(ret.buttonIndex == 2) {
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                quanid: coupon.list[index].couponID,
                                token: UserInfo.token,
                            },
                            url: '/jiekou/agentht/quan/deleteQuan.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    setTimeout(function() {
                                        next = true;
                                        pageIndex = 0;
                                        // coupon.list = [];
                                        getListData();
                                    }, 0);
                                    _g.toast(ret.msg);
                                } else if(ret.zt == -1) {
                                    _g.hideProgress();
                                    _g.rmLS('UserInfo');
                                    api && api.openWin({
                                        name: 'account-login-win',
                                        url: '../account/login.html',
                                        pageParam: {
                                            from: 'root'
                                        },
                                        bounces: false,
                                        slidBackEnabled: false,
                                        animation: {
                                            type: 'none'
                                        }
                                    });
                                    setTimeout(function() {
                                        _g.closeWins(['main-index-win'])
                                    }, 1000)
                                } else {
                                    getListData();
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {},
                        });
                    }
                });
            },
            onDeleteRecordTap: function(index) {
                api.confirm({
                    title: '注意',
                    msg: '确定删除该记录？',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if(ret.buttonIndex == 2) {
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                quanid: coupon.recordList[index].couponID,
                                token: UserInfo.token,
                            },
                            url: '/jiekou/agentht/quan/deleteUserQuan.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    setTimeout(function() {
                                        next = true;
                                        pageIndex = 0;
                                        // coupon.recordList = [];
                                        getRecordData();
                                    }, 0);
                                    _g.toast(ret.msg);
                                } else if(ret.zt == -1) {
                                    _g.hideProgress();
                                    _g.rmLS('UserInfo');
                                    api && api.openWin({
                                        name: 'account-login-win',
                                        url: '../account/login.html',
                                        pageParam: {
                                            from: 'root'
                                        },
                                        bounces: false,
                                        slidBackEnabled: false,
                                        animation: {
                                            type: 'none'
                                        }
                                    });
                                    setTimeout(function() {
                                        _g.closeWins(['main-index-win'])
                                    }, 1000)
                                } else {
                                    getRecordData();
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {},
                        });
                    }
                });
            },
            onListDetailTap: function(index) {
                _g.openWin({
                    header: {
                        data: {
                            title: '编辑优惠券',
                        },
                    },
                    name: 'coupon-editCoupon',
                    url: '../coupon/editCoupon.html',
                    bounces: false,
                    softInputMode: 'resize',
                    slidBackEnabled: false,
                    pageParam: {
                        couponID: this.list[index].couponID,
                    }
                });
            }

        }
    });

    function getListData() {
        coupon.index = 0;
        pageIndex++;
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                userid: UserInfo.userid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: 30,
            },
            // isSync: true,
            url: '/jiekou/agentht/quan/getQuan.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        var list = getListValue(ret.data);
                        if(pageIndex == 1) {
                            coupon.list = list;
                        } else {
                            coupon.list = coupon.list.concat(list);
                        }
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 500);
                    }, 0);
                } else if(ret.zt == -1) {
                    _g.hideProgress();
                    _g.rmLS('UserInfo');
                    api && api.openWin({
                        name: 'account-login-win',
                        url: '../account/login.html',
                        pageParam: {
                            from: 'root'
                        },
                        bounces: false,
                        slidBackEnabled: false,
                        animation: {
                            type: 'none'
                        }
                    });
                    setTimeout(function() {
                        _g.closeWins(['main-index-win'])
                    }, 1000)
                } else {
                    if(pageIndex == 1) {
                        coupon.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    function getListValue(result) {
        var object = result.quans || {};
        var amount = result.quansl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                couponID: object['quan_' + i + '_id'] || '',
                couponWorkTime: object['quan_' + i + '_yxsc'] || '',
                couponStaffID: object['quan_' + i + '_staffid'] || '',
                reason: object['quan_' + i + '_reason'] || '',
                faceValue: object['quan_' + i + '_mz'] || '',
                describe: object['quan_' + i + '_describe'] || '',
                couponType: couponKind(object['quan_' + i + '_kind']) || '',
                couponLimit: object['quan_' + i + '_limit'] || ''
            });
        }
        return list;
    }

    function getRecordData() {
        coupon.index = 1;
        pageIndex++;
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                userid: UserInfo.userid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: 30,
            },
            // isSync: true,
            url: '/jiekou/agentht/quan/getQuanjl.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        var recordList = getRecordValue(ret.data);
                        if(pageIndex == 1) {
                            coupon.recordList = recordList;
                        } else {
                            coupon.recordList = coupon.recordList.concat(recordList);
                        }
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 500);
                    }, 0);
                } else if(ret.zt == -1) {
                    _g.hideProgress();
                    _g.rmLS('UserInfo');
                    api && api.openWin({
                        name: 'account-login-win',
                        url: '../account/login.html',
                        pageParam: {
                            from: 'root'
                        },
                        bounces: false,
                        slidBackEnabled: false,
                        animation: {
                            type: 'none'
                        }
                    });
                    setTimeout(function() {
                        _g.closeWins(['main-index-win'])
                    }, 1000)
                } else {
                    if(pageIndex == 1) {
                        coupon.recordList = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    function changeValue(result) {
        switch (result) {
            case "0":
                return "有效";
                break;

            case "1":
                return "无效";
                break;
        }
    }
    function couponKind(param) {
        if(param == 1) {
            return "每日固定发放";
        } else if (param == 2) {
            return "用户主动领取";
        } else if (param == 3) {
            return "抽奖奖项";
        }
    }

    function getRecordValue(result) {
        var object = result.quanjls || {};
        var amount = result.quanjlsl || 0;
        var recordList = [];
        for (var i = 1; i <= amount; i++) {
            recordList.push({
                couponID: object['quanjl_' + i + '_id'] || '',
                couponUserID: object['quanjl_' + i + '_userid'] || '',
                couponAgentID: object['quanjl_' + i + '_agentid'] || '',
                couponGetDate: object['quanjl_' + i + '_getdate'] || '',
                couponLostDate: object['quanjl_' + i + '_lostdate'] || '',
                isCouponWork: changeValue(object['quanjl_' + i + '_yx']),
                couponStaffID: object['quanjl_' + i + '_staffid'] || '',
                reason: object['quanjl_' + i + '_reason'] || '',
                faceValue: object['quanjl_' + i + '_mz'] || 0,
                describe: object['quanjl_' + i + '_describe'] || '',
                couponType: object['quanjl_' + i + '_kind'] || '',
                couponLimit: object['quanjl_' + i + '_limit'] || ''
            });
        }
        return recordList;
    }
    //刷新优惠券列表
    api && api.addEventListener({
        name: 'updateCouponList',
    }, function() {
        pageIndex = 0;
        // coupon.list = [];
        getListData();
    });
    //刷新优惠券记录列表
    api && api.addEventListener({
        name: 'coupon-coupon-updateCouponRewardList',
    }, function() {
        pageIndex = 0;
        // coupon.recordList = [];
        getRecordData();
    });
    api && api.addEventListener({
        name: 'coupon-coupon-onTapRightBtn',
    }, function() {
        if (coupon.isEdit == false) {
            coupon.isEdit = true;
            api.sendEvent({
                name: api.winName + '-updateHeaderData',
                extra: {
                    isEdit: true,
                }
            })
        } else {
            coupon.isEdit = false;
        }
    });
    api.addEventListener({
        name: 'coupon-coupon-addCoupon',
    }, function() {
        if (coupon.isList == 1) {
            _g.openWin({
                header: {
                    data: {
                        // isEdit: true,
                        title: '添加优惠券'
                    },
                },
                name: 'coupon-addCoupon',
                url: '../coupon/addCoupon.html?mod=dev',
                bounces: false,
                softInputMode: 'resize',
                slidBackEnabled: false,
            });
        } else {
            _g.openWin({
                header: {
                    data: {
                        // isEdit: true,
                        title: '发送优惠券'
                    },
                },
                name: 'coupon-sendCoupon',
                url: '../coupon/sendCoupon.html?mod=dev',
                bounces: false,
                softInputMode: 'resize',
                slidBackEnabled: false,
            });
        }
    });
    getListData();
    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            pageIndex = 0;
            // coupon.list = [];
            // coupon.recordList = [];
            if (coupon.index == 0) {
                getListData();
            } else if (coupon.index == 1) {
                getRecordData();
            }
        }, 0);
    });
    api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0
        }
    }, function(ret, err) {
        window.isNoMore = false;
        if (coupon.index == 0) {
            getListData();
        } else if (coupon.index == 1) {
            getRecordData();
        }
    });
    module.exports = {};

});
