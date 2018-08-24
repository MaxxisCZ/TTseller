define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var isCheck = UserInfo.checkflag == 1 ? true : false;
    var infor = new Vue({
        el: '#infor',
        template: _g.getTemplate('me/index-infor-V'),
        data: {
            detail: {
                avatar: '',
                name: '',
                phone: '',
                number: '',
                agentName: ''
            }
        },

        methods: {
            onAvatarTap: function() {
                _g.openPicActionSheet({
                    allowEdit: true,
                    suc: function(ret) {
                        postAvatar(ret.data);
                    }
                });
            },
        }
    });

    function getData() {
        if(_g.getLS('UserInfo')) {
            Http.ajax({
                data: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    token: UserInfo.token
                },
                isSync: true,
                lock: false,
                url: '/jiekou/agentht/staff/getStaff.aspx',

                success: function(ret) {
                    if (ret.zt == 1) {
                        infor.detail = infoListVue(ret.data);
                        var data = ret.data;
                        var UserInfo = _g.getLS('UserInfo');
                        var newUserInfo = $.extend(true, UserInfo, data);
                        _g.setLS('UserInfo', newUserInfo);
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
                            _g.closeWins(['main-index-win','index-system-win'])
                        }, 1000)
                    } else {
                        _g.toast(ret.msg);
                    }
                },
                error: function(err) {},
            });
        }
    }

    function infoListVue(result) {
        return {
            name: result.name || '',
            sex: result.sex || '',
            place: result.place || '',
            birth: result.birth || '',
            phone: result.mobile || '',
            number: result.agentnum || '',
            email: result.email || '',
            addr: result.addr || '',
            loginName: result.loginname || '',
            staffid: result.staffid || '',
            agentid: result.agentid || '',
            avatar: result.head || '',
            agentName: result.agentname || '',
            position: result.position || ''
        }
    }
    getData();

    function postAvatar(path) {
        _g.showProgress();
        api.ajax({
            url: CONFIG.HOST + '/jiekou/agentht/staff/edithead.aspx',
            method: 'post',
            data: {
                values: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    token: UserInfo.token,
                },
                files: {
                    img_tx: path
                }
            }
        }, function(ret, err) {
            if (ret.zt = 1) {
                var UserInfo = _g.getLS('UserInfo');
                UserInfo.head = ret.tx;
                _g.setLS('UserInfo', UserInfo);
                infor.detail.avatar = ret.tx;
            } else {
                api.alert({
                    msg: JSON.stringify(err)
                });
            }
            _g.hideProgress();
        });
    }

    var selectList = new Vue({
        el: '#selectList',
        template: _g.getTemplate('me/index-list-V'),
        data: {
            hiddenMoney: false,
            isCheck: isCheck,
            list: [{
                title: '协议信息',
                tag: 'is-agreement',
                isCheck: 1,
            }, {
                title: '保证金：0.00元',
                tag: 'is-deposit',
                isCheck: 1,
            }, {
                title: '退出登录',
                tag: 'is-signOut',
                isCheck: 1,
            }],
            checkflagList: [{
                title: '协议信息',
                tag: 'is-agreement',
                isCheck: 1,
            }, {
                title: '保证金：0.00元',
                tag: 'is-deposit',
                isCheck: 1,
            }, {
                title: '总资产：',
                showMoney: 0,
                money: 0,
                text: '点击查看资产明细',
                tag: 'is-money',
                isCheck: UserInfo.checkflag,
            }, {
                title: '加盟商资料编辑',
                tag: 'is-editInfo',
                isCheck: UserInfo.checkflag,
            }, {
                title: '个人资料编辑',
                tag: 'is-changeInfo',
                isCheck: UserInfo.checkflag,
            }, {
                title: '我的二维码',
                tag: 'is-qrcode',
                isCheck: UserInfo.checkflag,
            }, {
                title: '咨询帮助',
                tag: 'is-help',
                isCheck: UserInfo.checkflag,
            }, {
                title: '设置',
                tag: 'is-setting',
                isCheck: UserInfo.checkflag,
            },]
        },
        methods: {
            onItemTap: function(index) {
                if(isCheck) {
                    this.switchTag(this.checkflagList[index].tag);
                } else {
                    this.switchTag(this.list[index].tag);
                }
            },
            onShowMoneyTap: function() {
                if(this.hiddenMoney == false) {
                    this.hiddenMoney = true;
                } else {
                    this.hiddenMoney = false;
                }
                setVisible();
            },
            switchTag: function(tag) {
                switch (tag) {
                    case 'is-money':
                        this.openMoney(event);
                        break;
                    case 'is-deposit':
                        this.openDeposit();
                        break;
                    case 'is-agreement':
                        this.openAgreement();
                        break;
                    case 'is-editInfo':
                        this.openEditInfo();
                        break;
                    case 'is-changeInfo':
                        this.checkUserInfo();
                        break;
                    case 'is-qrcode':
                        this.openQrcode();
                        break;
                    case 'is-help':
                        this.openHelp();
                        break;
                    case 'is-setting':
                        this.openSetting();
                        break;
                    case 'is-signOut':
                        this.signOut();
                        break;
                }
            },
            openMoney: function(event) {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的资产',
                        },
                        template: 'common/header-date-V',
                    },
                    name: 'me-money',
                    url: '../me/money.html',
                    pageParam: {

                    }
                });
            },
            openDeposit: function() {
                // _g.openWin({
                //     header: {
                //         data: {
                //             title: '我要充值',
                //         },
                //     },
                //     name: 'me-deposit',
                //     url: '../me/deposit.html',
                //     pageParam: {

                //     }
                // });
                _g.openWin({
                    header: {
                        data: {
                            title: '保证金充值',
                        },
                    },
                    name: 'financeManage-recharge',
                    url: '../financeManage/recharge.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        deposit: true,
                    }
                });
            },
            openAgreement: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '协议信息',
                        },
                        template: 'common/header-attention-V',
                    },
                    name: 'me-agreement',
                    url: '../me/agreement.html',
                    bounces: false,
                    softInputMode: 'resize',
                    slidBackEnabled: false,
                    pageParam: {

                    }
                });
            },
            openEditInfo: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '加盟商资料编辑',
                        }
                    },
                    name: 'me-editInfo',
                    url: '../me/editInfo.html',
                    pageParam: {

                    }
                });
            },
            openQrcode: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的二维码',
                            rightText: '保存',
                        },
                        // template: '/common/header-base-V',
                    },
                    name: 'me-qrcode',
                    url: '../me/qrcode.html',
                    pageParam: {

                    }
                });
            },
            openHelp: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '咨询帮助',
                        }
                    },
                    name: 'index-help',
                    url: '../index/help.html',
                    pageParam: {

                    }
                });
            },
            openSetting: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '设置',
                        }
                    },
                    name: 'index-system',
                    url: '../index/system.html',
                    pageParam: {

                    }
                });
            },
            signOut: function() {
                api.confirm({
                    title: '注意',
                    msg: '确定退出登录？',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if(ret.buttonIndex == 2) {
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
                            _g.closeWins(['main-index-win','index-system-win'])
                        }, 1000)
                    }
                });
            },
            checkUserInfo: function() {
                if (!_g.getLS('UserInfo')) {
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
                        _g.closeWins(['main-index-win','index-system-win'])
                    }, 1000)
                } else {
                    _g.openWin({
                        header: {
                            data: {
                                title: '个人资料编辑',
                            }
                        },
                        name: 'me-info',
                        url: '../me/info.html',
                        pageParam: {

                        }
                    });
                }
            }
        }
    });
    // 设置余额是否可见
    function setVisible() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/agent/setVisible.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    getMoneyData();
                }
            },
            error: function(err) {},
        });
    }
    function getMoneyData() {
        if(_g.getLS('UserInfo')) {
            Http.ajax({
                data: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    token: UserInfo.token,
                },
                lock: false,
                url: '/jiekou/agentht/agent/getBalance.aspx',
                success: function(ret) {
                    if(ret.zt == 1) {
                        selectList.checkflagList[2].money = ret.data.balance;
                        if(ret.data.isvisible == 0) {
                            selectList.checkflagList[2].showMoney = ret.data.balance + ' 元';
                            selectList.hiddenMoney = false;
                        } else {
                            selectList.checkflagList[2].showMoney = ret.data.balance;
                            selectList.hiddenMoney = true;
                        }
                        selectList.checkflagList[1].title = '保证金：' + ret.data.realdeposit + ' 元';
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
                            _g.closeWins(['main-index-win','index-system-win'])
                        }, 1000)
                    } else {
                        _g.toast(ret.msg);
                    }
                },
                error: function(err) {},
            });
        }
    }
    getMoneyData();

    api.addEventListener({
        name: 'me-info-update'
    }, function(ret, err) {
        infor.detail.name = ret.value.name;
        infor.detail.phone = ret.value.phone;
    });
    api.addEventListener({
        name: 'me-index-setVisible'
    }, function(ret, err) {
        getMoneyData();
    });
    api.addEventListener({
        name: 'me-index-getNewMoney'
    }, function(ret, err) {
        getMoneyData();
    });
    _g.setPullDownRefresh(function() {
        // page = 0;
        // next = true;
        infor.detail = [];
        getData();
        getMoneyData();
    });

    module.exports = {};
});
