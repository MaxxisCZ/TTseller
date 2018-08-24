define(function(require, exports, module) {
	var Http = require('U/http');
    var Vcode = require('U/vcode');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var resetPsw = new Vue({
        el: '#resetPsw',
        template: _g.getTemplate('user/resetPsw-main-V'),
        data: {
            account: '',
            password: '',
            idcode: '',
            code: '',
        },
        created: function() {
            
        },
        methods: {
            onResetTap: function() {
                if(this.account === '') {
                    makeCodeTap();
                    _g.toast('用户账号不能为空');
                    return
                }
                if(this.password === '') {
                    makeCodeTap();
                    _g.toast('新密码不能为空');
                    return
                }
                if (this.password != '') {
                    makeCodeTap();
                    var reg = /^[A-Za-z0-9]{6,16}$/;
                    isok = reg.test(this.password);
                }
                if (!isok) {
                    makeCodeTap();
                    _g.toast('请输入6~16位数字/字母组合的密码');
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
                    postResetPsw();
                }, 200);
            },
            onCodeTap: function() {
                makeCodeTap();
            },
        },
    });
    function postResetPsw() {
        makeCodeTap();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                account: this.account,
                password: this.password
            },
            isSync: true,
            url: '/jiekou/agentht/user/resetUserPwd.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    api && api.openFrame({
                        name: 'popupbox-resetSuccess',
                        url: '../popupbox/resetSuccess.html',
                        rect: {
                            x: 0,
                            y: headerHeight,
                            w: 'auto',
                            h: windowHeight,
                        },
                    });
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
                    api && api.openFrame({
                        name: 'popupbox-resetFail',
                        url: '../popupbox/resetFail.html',
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
                }
            },
            error: function(err) {}
        });
    }
    makeCodeTap = function() {
        resetPsw.code = Vcode.getVerificationCode();
    }
    makeCodeTap();

    module.exports = {};

});