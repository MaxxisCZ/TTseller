define(function(require, exports, module) {
	var Http = require('U/http');
    var Vcode = require('U/vcode');
    var downUserMoney = new Vue({
        el: '#downUserMoney',
        template: _g.getTemplate('user/downUserMoney-main-V'),
        data: {
            account: '',
            money: '',
            idcode: '',
            code: '',
        },
        created: function() {
            
        },
        methods: {
            onSaveTap: function() {
                if(this.account === '') {
                    _g.toast('用户账号不能为空');
                    return
                }
                if(this.money === '' || this.money == 0) {
                    _g.toast('扣除金额不能为空或零');
                    return
                }
                if(this.idcode === '') {
                    _g.toast('验证码不能为空');
                    return
                }
                if(this.idcode.toUpperCase() != this.code) {
                    _g.toast('验证码不正确');
                    return
                }
                this.postTopUp();
            },
            onCodeTap: function() {
                makeCodeTap();
            },
            postTopUp: function() {
                Http.ajax({
                    data: {
                        loginname: _g.getLS('UserInfo').loginname,
                        agentid: _g.getLS('UserInfo').agentid,
                        staffid: _g.getLS('UserInfo').staffid,
                        token: _g.getLS('UserInfo').token,
                        account: this.account,
                        je: this.money
                    },
                    isSync: true,
                    url: '/jiekou/agentht/user/minusMoney.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            api && api.closeWin();
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
        },
    });
    makeCodeTap = function() {
        downUserMoney.code = Vcode.getVerificationCode();
    },
    makeCodeTap();

    module.exports = {};

});