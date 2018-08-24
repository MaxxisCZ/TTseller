define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var closePwd = new Vue({
        el: '#closePwd',
        template: _g.getTemplate('index/closePwd-main-V'),
        data: {
            mobile: '',
            code: '',
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
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        mobile: this.mobile,
                        yzm: this.code,
                    },
                    url: '/jiekou/agentht/settings/editPayPwd.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            api && api.sendEvent({
                                name: 'index-system-isPwd',
                                extra: {
                                    isPwd: 0
                                }
                            });
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
                    closePwd.mobile = ret.data.mobile;
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