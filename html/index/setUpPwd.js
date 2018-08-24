define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var setUpPwd = new Vue({
        el: '#setUpPwd',
        template: _g.getTemplate('index/setUpPwd-main-V'),
        data: {
            isOpen: false,
            selector: true,
            mobile: '',
            code: '',
            payPwd: '',
            payPwdAgain: '',
            selectR: false,
            showPwd: false,
        },
        created: function() {
        },
        methods: {
            onOpenTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '支付密码',
                        },
                    },
                    name: 'index-payPwd',
                    url: '../index/payPwd.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        style: 0,
                    }
                });
            },
            onChangePwdTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '支付密码',
                        },
                    },
                    name: 'index-myOldPayPwd',
                    url: '../index/myOldPayPwd.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        style: 1,
                        code: setUpPwd.code,
                        mobile: setUpPwd.mobile,
                    }
                });
            },
            onForgetPwdTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '支付密码',
                        },
                    },
                    name: 'index-inputCode',
                    url: '../index/inputCode.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        style: 2,
                    }
                });
            },
            onCloseTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '支付密码',
                        },
                    },
                    name: 'index-myOldPayPwd',
                    url: '../index/myOldPayPwd.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        style: 3,
                        code: setUpPwd.code,
                        mobile: setUpPwd.mobile,
                    }
                });
            }, 
        },
    });
    function havePsw() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/agent/getAgent.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    if(ret.data.payflag == 1) {
                        setUpPwd.isOpen = false;
                        // setUpPwd.showPwd = false;
                    } else {
                        setUpPwd.isOpen = true;
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
                } else {
                    setUpPwd.selectR = false;
                    setUpPwd.showPwd = true;
                }
            },
            error: function(err) {},
        });
    }
    function getMobile() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/agent/getAgent.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setUpPwd.mobile = ret.data.mobile;
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
                }
            },
            error: function(err) {},
        });
    }
    havePsw();
    getMobile();

    api.addEventListener({
        name: 'index-setUpPwd-closePwd',
    }, function(ret,err) {
        this.selectR = false;
        this.showPwd = true;
    });
    
    module.exports = {};

});