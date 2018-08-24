define(function(require, exports, module) {
    var style = api && api.pageParam.style;
    var UserInfo = _g.getLS('UserInfo');
    var Vcode = require('U/vcode');
	var Http = require('U/http');
    var inputCode = new Vue({
        el: '#inputCode',
        template: _g.getTemplate('index/inputCode-main-V'),
        data: {
            mobile: '',
            code: '',
            codeText: '获取验证码',
        },
        created: function() {
            Vcode.init({
                onInit: this.onInit,
                onAction: this.onAction,
            });
        },
        methods: {
            onInit: function(nowText) {
                this.codeText = nowText;
            },
            onAction: function(nowText) {
                this.codeText = nowText;
            },
            onGetCodeTap: function() {
                if(Vcode.isAllow()) {
                    Vcode.start();
                    this.vcode = Vcode.getRandom(6);
                    Http.ajax({
                        data: {
                            mobile: inputCode.mobile
                        },
                        lock: false,
                        url: '/jiekou/agentht/staff/getCheckcode.aspx',
                        success: function(ret) {
                            if(ret.zt == 1) {
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
                                _g.toast(ret.msg);
                            }
                        },
                        error: function(err) {},
                    });
                } else {
                    _g.toast('请在倒计时结束再点击获取新的验证码!');
                }
            },
            onSumbitTap: function() {
                if(inputCode.code == '') {
                    _g.toast('请输入验证');
                    return
                }
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
                        style: 2,
                        code: inputCode.code,
                        mobile: inputCode.mobile,
                    }
                });
            }
        },
    });
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
                    inputCode.mobile = ret.data.mobile;
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
    getMobile();
    
    module.exports = {};

});