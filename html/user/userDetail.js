define(function(require, exports, module) {
    var userid = api && api.pageParam.userid;
    var UserInfo = _g.getLS('UserInfo');
    var Http = require('U/http');
    var userDetail = new Vue({
        el: '#userDetail',
        template: _g.getTemplate('user/userDetail-main-V'),
        data: {

            isEdit: 1,
            content: '',
            edit: '编辑用户资料',
            detail: {
                avatar: '',
                account: '',
                userid: '',
                referee: '',
                nickname: '',
                selected: 0,
                birthday: '',
                place: '',
                registerTime: '',
                balance: '0',
                sumconsume: '0',
                points: '',
                test: '',
                education: '',
                name: '',
            },
            options: [{
                text: '男',
                value: 1,
            }, {
                text: '女',
                value: 2,
            }, {
                text: '--',
                value: 0,
            }]
        },
        created: function() {
            // this.detail = [];
        },
        methods: {
            picker: function() {
                if(this.isEdit == 0) {
                    api.openPicker({
                        type: 'date',
                        // date: '2014-05-01 12:30',
                        title: '选择时间'
                    }, function(ret, err) {
                        if (ret) {
                            // managerDetail.oneDetail.time = ret.year+'/'+ret.month+'/'+ret.day;
                            userDetail.detail.birthday = ret.year+'/'+ret.month+'/'+ret.day;
                        } else {
                            alert(JSON.stringify(err));
                        }
                    });
                } else {
                    return
                }
            },
            onAvatarTap: function() {
                _g.openPicActionSheet({
                    allowEdit: true,
                    suc: function(ret) {
                        postAvatar(ret.data);
                    }
                });
            },
            onEditUserInfoTap: function() {
                if(this.isEdit == 0) {
                    this.isEdit = 1;
                    this.edit = '编辑用户资料';
                } else {
                    this.isEdit = 0;
                    this.edit = '取消编辑';
                }
            },
            onSaveDataTap: function() {
                if(this.nickname == '') {
                    _g.toast('请输入昵称');
                    return;
                }
                if(userDetail.detail.selected == 1 || userDetail.detail.selected == 2) {
                    if(this.birthday == '') {
                        _g.toast('请输入生日');
                        return;
                    }
                    Http.ajax({
                        data: {
                            loginname: UserInfo.loginname,
                            agentid: UserInfo.agentid,
                            staffid: UserInfo.staffid,
                            token: UserInfo.token,
                            userid: userid,
                            name: userDetail.detail.name,
                            nickname: userDetail.detail.nickname,
                            sex: userDetail.detail.selected,
                            birthday: userDetail.detail.birthday,
                            head: userDetail.detail.avatar,
                            account: userDetail.detail.account,
                            education: userDetail.detail.education,
                            place: userDetail.detail.place,
                        },
                        isSync: true,
                        url: '/jiekou/agentht/user/saveUserDetail.aspx',
                        success: function(ret) {
                            if (ret.zt == 1) {
                                this.isEdit = 1;
                                this.edit = '编辑用户资料';
                                _g.toast(ret.msg);
                                getUserData();
                            } else if(ret.zt == -1) {
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
                                _g.toast(ret.msg);
                            }
                        },
                        error: function(err) {}
                    });
                } else {
                    _g.toast('请选择一种性别');
                }
            },
            onSaveVisitTap: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        userid: userid,
                        content: userDetail.content,
                    },
                    url: '/jiekou/agentht/user/addVisit.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            var data = ret.data;
                            getUserData();
                            userDetail.content = '';
                            _g.toast(ret.msg);
                        } else if(ret.zt == -1) {
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
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {},
                });
            }
        },
    });
    var postAvatar = function(path) {
        _g.showProgress();
        api.ajax({
            url: CONFIG.HOST + '/jiekou/agentht/activity/editImage.aspx',
            method: 'post',
            data: {
                values: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    token: UserInfo.token,
                    param: 1,
                },
                files: {
                    img_tx: path
                }
            }
        }, function(ret, err) {
            if (ret.zt = 1) {
                var UserInfo = _g.getLS('UserInfo');
                _g.setLS('UserInfo', UserInfo);
                userDetail.detail.avatar = ret.tx;
            } else if(ret.zt == -1) {
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
                _g.toast(ret.msg);
            }
            _g.hideProgress();
        });
    }
    var getUserData = function() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                userid: userid,
            },
            url: '/jiekou/agentht/user/getUserDetail.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var data = ret.data;
                    userDetail.detail = getuserDetail(data);
                } else if(ret.zt == -1) {
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
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    var getuserDetail = function(result) {
        var data = result ? result : '';
        return {
            avatar: data.head || '',
            userid: userid,
            account: data.account || '',
            nickname: data.nickname || '',
            referee: data.referee || '',
            selected: data.sex || '',
            birthday: data.birthday || '',
            registerTime: data.zcsj || '',
            balance: data.balance || '',
            sumconsume: data.ljxfe || '',
            points: data.points || '',
            place: data.place || '',
            education: data.education || '',
            name: data.name || '',
        }
    }

    var judgeSex = function(result) {
        if (result == 1) {
            return ('男');
        } else if (result == 2) {
            return ('女');
        } else {
            return ('--');
        }
    }

    getUserData();
    api.addEventListener({
        name: 'userDetail-menu',
    }, function(ret, err) {
        if (!window.isMenuOpen) {
            _g.openMenuFrame({

                list: ['优惠券记录', '回访记录', '充值记录', '签到记录', '积分记录', '推荐好友', '消费记录', '地址管理', '订单']
            });
        } else {
            api.sendEvent({
                name: 'global-menu-onBtnTap',
            });
        }
    });
    api.addEventListener({
        name: api.winName + '-menu-onItemTap',
    },function(ret,err){
        if(ret.value.index == 0){
            _g.openWin({
                header:{
                    data:{
                        title: '优惠券记录'
                    },
                },
                name: 'user-couponNote',
                url: '../user/couponNote.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {
                    userid: userid,
                    mobile: userDetail.detail.account
                }
            });
        } else if(ret.value.index == 1){
            _g.openWin({
                header:{
                    data:{
                        title: '回访记录'
                    },
                },
                name: 'user-visitHistory',
                url: '../user/visitHistory.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {
                    userid: userid,
                    mobile: userDetail.detail.account
                }
            });
        } else if(ret.value.index == 2){
            _g.openWin({
                header:{
                    data:{
                        title: '充值记录'
                    },
                },
                name: 'user-recharge',
                url: '../user/recharge.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {
                    userid: userid,
                    mobile: userDetail.detail.account
                }
            });
        } else if(ret.value.index == 3){
            _g.openWin({
                header:{
                    data:{
                        title: '签到记录'
                    },
                },
                name: 'user-sign',
                url: '../user/sign.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {
                    userid: userid,
                    mobile: userDetail.detail.account
                }
            });
        } else if(ret.value.index == 4){
            _g.openWin({
                header:{
                    data:{
                        title: '积分记录'
                    },
                },
                name: 'user-integral',
                url: '../user/integral.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {
                    userid: userid,
                    mobile: userDetail.detail.account
                }
            });
        } else if(ret.value.index == 5){
            _g.openWin({
                header:{
                    data:{
                        title: '推荐好友'
                    },
                },
                name: 'user-shareFriend',
                url: '../user/shareFriend.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {
                    userid: userid,
                    mobile: userDetail.detail.account
                }
            });
        } else if(ret.value.index == 6){
            _g.openWin({
                header:{
                    data:{
                        title: '消费记录'
                    },
                },
                name: 'user-purchaseHistory',
                url: '../user/purchaseHistory.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {
                    userid: userid,
                    mobile: userDetail.detail.account
                }
            });
        } else if(ret.value.index == 7){
            _g.openWin({
                header:{
                    data:{
                        title: '用户收货地址',
                        // userid: userid,
                    },
                    template: '../html/common/header-add-V',
                },
                name: 'orderManage-myAddress',
                url: '../orderManage/myAddress.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {
                    userid: userid,
                    mobile: userDetail.detail.account
                }
            });
        } else if(ret.value.index == 8){
            _g.openWin({
                header:{
                    data:{
                        title: '用户订单'
                    },
                },
                name: 'user-userOrder',
                url: '../user/userOrder.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {
                    userid: userid,
                    mobile: userDetail.detail.account
                }
            });
        }
    });
    module.exports = {};

});
