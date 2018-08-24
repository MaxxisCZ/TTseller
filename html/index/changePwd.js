define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var changePwd = new Vue({
        el: '#changePwd',
        template: _g.getTemplate('index/changePwd-main-V'),
        data: {
            mobile: '',
            code: '',
            oldPwd: '',
            newPwd: '',
            surePwd: '',
        },
        created: function() {
        },
        methods: {
            onGetCodeTap: function() {
                Http.ajax({
                    data: {
                        mobile: this.mobile
                    },
                    url: '/jiekou/agentht/staff/getCheckcode.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            return;
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
            },
            onSumbitTap: function() {
                if(this.code == '') {
                    _g.toast('验证码不能为空');
                    return
                }
                if(this.oldPwd == '') {
                    _g.toast('旧密码不能为空');
                    return
                }
                var pwdReg = /^[0-9]{6}$/;
                if(!pwdReg.test(this.payPwd)) {
                    _g.toast('请输入6个数字的密码');
                    return
                }
                if(this.newPwd != this.surePwd) {
                    _g.toast('支付密码和确认密码不一致');
                    return
                }
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        mobile: this.mobile,
                        yzm: this.code,
                        oldpay: this.oldPwd,
                        newpay: this.newPwd,
                    },
                    url: '/jiekou/agentht/settings/setPayPwd.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            setTimeout(function(){
                                api && api.closeWin();
                            },1000);
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
                mobile: this.mobile,
            },
            url: '/jiekou/agentht/staff/getStaff.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    changePwd.mobile = ret.data.mobile;
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