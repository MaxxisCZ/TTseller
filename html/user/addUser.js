define(function(require, exports, module) {
	var Http = require('U/http');
    var Vcode = require('U/vcode');
    var addUser = new Vue({
        el: '#addUser',
        template: _g.getTemplate('user/addUser-main-V'),
        data: {
            account: '',
            password: '',
            idcode: '',
            code: '',
        },
        created: function() {
            
        },
        methods: {
            onSaveTap: function() {
                if(this.account == '') {
                    makeCodeTap();
                    _g.toast('用户账号不能为空');
                    return
                }
                if(this.password == '') {
                    makeCodeTap();
                    _g.toast('密码不能为空');
                    return
                }
                if(this.idcode == '') {
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
                    postaddUser();
                }, 200);
            },
            onCodeTap: function() {
                makeCodeTap();
            },
        },
    });
    function postaddUser() {
        makeCodeTap();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                account: this.account,
                password: this.password,
            },
            isSync: true,
            url: '/jiekou/agentht/user/addUser.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        api && api.sendEvent({
                            name: 'user-addUser-refresh',
                            extra: {

                            }
                        });
                        setTimeout(function() {
                            api && api.closeWin();
                        }, 500);
                    }, 0);
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
    }
    makeCodeTap = function() {
        addUser.code = Vcode.getVerificationCode();
    },
    makeCodeTap();
    
    module.exports = {};

});