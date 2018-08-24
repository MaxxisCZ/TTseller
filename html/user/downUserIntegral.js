define(function(require, exports, module) {
	var Http = require('U/http');
    var Vcode = require('U/vcode');
    var downUserIntegral = new Vue({
        el: '#downUserIntegral',
        template: _g.getTemplate('user/downUserIntegral-main-V'),
        data: {
            account: '',
            point: '',
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
                if(this.point === '' || this.point == 0) {
                    _g.toast('扣除积分不能为空或零');
                    return
                }
                if(this.idcode === '') {
                    _g.toast('验证码不能为空');
                    return
                }
                if(this.idcode.toUpperCase() != this.code) {
                    _g.toast('验证码不匹配');
                    return
                }
                this.postTopUp();
            },
            onCodeTap: function() {
                makeCodeTap();
            },
            postdownIntegral: function() {
                Http.ajax({
                    data: {
                        loginname: _g.getLS('UserInfo').loginname,
                        agentid: _g.getLS('UserInfo').agentid,
                        staffid: _g.getLS('UserInfo').staffid,
                        token: _g.getLS('UserInfo').token,
                        account: this.account,
                        point: this.point
                    },
                    isSync: true,
                    url: '/jiekou/agentht/user/minusPoint.aspx',
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
                            _g.closeWin(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            }
        },
    });
    makeCodeTap = function() {
        downUserIntegral.code = Vcode.getVerificationCode();
    },
    makeCodeTap();

    module.exports = {};

});