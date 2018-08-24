define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var Vcode = require('U/vcode');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var userTopUp = new Vue({
        el: '#userTopUp',
        template: _g.getTemplate('user/userTopUp-main-V'),
        data: {
            account: '',
            money: '',
            idcode: '',
            code: '',
            hasPwd: false,
        },
        created: function() {
            
        },
        methods: {
            onTopUpTap: function() {
                if(this.account === '') {
                    makeCodeTap();
                    _g.toast('用户账号不能为空');
                    return
                }
                if(this.money === '' || this.money == 0) {
                    makeCodeTap();
                    _g.toast('充值金额不能为空或零');
                    return
                }
                if(this.idcode === '') {
                    makeCodeTap();
                    _g.toast('验证码不能为空');
                    return
                }
                if(this.idcode.toUpperCase() != this.code) {
                    makeCodeTap();
                    _g.toast('验证码不正确');
                    return
                }
                setTimeout(function() {
                    postTopUp();
                }, 200);
            },
            onCodeTap: function() {
                makeCodeTap();
            },
        },
    });
    function postTopUp() {
        makeCodeTap();
        if(userTopUp.hasPwd == true) {
            _g.openWin({
                header: {
                    data: {
                        title: '支付密码',
                    },
                },
                name: 'financeManage-payPassword',
                url: '../financeManage/payPassword.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {
                    style: 5
                }
            });
        } else {
            Http.ajax({
                data: {
                    loginname: _g.getLS('UserInfo').loginname,
                    agentid: _g.getLS('UserInfo').agentid,
                    staffid: _g.getLS('UserInfo').staffid,
                    token: _g.getLS('UserInfo').token,
                    account: userTopUp.account,
                    je: userTopUp.money
                },
                isSync: true,
                url: '/jiekou/agentht/user/chongzhi.aspx',
                success: function(ret) {
                    if(ret.zt == 1) {
                        setTimeout(function() {
                            api && api.openFrame({
                                name: 'popupbox-setUpSuccess',
                                url: '../popupbox/setUpSuccess.html',
                                rect: {
                                    x: 0,
                                    y: headerHeight,
                                    w: 'auto',
                                    h: windowHeight,
                                },
                            });
                        }, 500);
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
                        setTimeout(function() {
                            api && api.openFrame({
                                name: 'popupbox-setUpFail',
                                url: '../popupbox/setUpFail.html',
                                rect: {
                                    x: 0,
                                    y: headerHeight,
                                    w: 'auto',
                                    h: windowHeight,
                                },
                                pageParam: {
                                    message: ret.msg,
                                }
                            });
                        }, 500);
                    }
                },
                error: function(err) {}
            });
        }
    }
    function makeCodeTap() {
        userTopUp.code = Vcode.getVerificationCode();
    }
    function getHasPwd() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/agent/getAgent.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    if(ret.data.payflag == 1) {
                        userTopUp.hasPwd = true;
                    } else {
                        userTopUp.hasPwd = false;
                    }
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
                }
            },
            error: function(err) {},
        });
    }
    makeCodeTap();
    getHasPwd();

    api.addEventListener({
        name: 'user-userTopUp-success',
    }, function(ret, err) {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                account: userTopUp.account,
                je: userTopUp.money
            },
            isSync: true,
            url: '/jiekou/agentht/user/chongzhi.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        api && api.openFrame({
                            name: 'popupbox-setUpSuccess',
                            url: '../popupbox/setUpSuccess.html',
                            rect: {
                                x: 0,
                                y: headerHeight,
                                w: 'auto',
                                h: windowHeight,
                            },
                        });
                    }, 500);
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
                    setTimeout(function() {
                        api && api.openFrame({
                            name: 'popupbox-setUpFail',
                            url: '../popupbox/setUpFail.html',
                            rect: {
                                x: 0,
                                y: headerHeight,
                                w: 'auto',
                                h: windowHeight,
                            },
                        });
                    }, 500);
                }
            },
            error: function(err) {}
        });
    });

    module.exports = {};

});