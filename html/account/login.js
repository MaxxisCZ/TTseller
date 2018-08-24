define(function(require, exports, module) {
    var systemType = api.systemType; 
    var systemVersion = api.systemVersion;
    api.removeLaunchView();
    var Http = require('U/http');

    var login = new Vue({
        el: '#login',
        template: _g.getTemplate('account/login-V'),
        data: {
            account: '',
            password: '',
            version: '当前版本1.2.1',
            versionShow: true,
            loginHeight: '',
        },
        methods: {
            onLoginTap: function() {
                if (this.account === '') {
                    _g.toast('账号不能为空');
                    return;
                }
                if (this.password === '') {
                    _g.toast('密码不能为空');
                    return;
                }
                this.postLogin();
            },
            onRegistTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '申请加盟'
                        }
                    },
                    name: 'account-regist',
                    url: '../account/regist.html',
                    softInputMode: 'resize',
                    pageparam: {

                    }
                });
            },
            onForgetTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '忘记密码'
                        }
                    },
                    name: 'account-forget',
                    url: '../account/forget.html',
                    pageparam: {

                    }
                });
            },
            postLogin: function() {
                Http.ajax({
                    data: {
                        loginname: this.account,
                        password: this.password,
                        appVer: '1.2.1@'+ systemType + ':' + systemVersion,
                    },
                    isSync: true,
                    url: '/jiekou/agentht/staff/staffLogin.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            var UserInfo = ret.data;
                            //缓存用户资料
                            _g.setLS('UserInfo', UserInfo);
                            setTimeout(function() {
                                api && api.openWin({
                                    name: 'main-index-win',
                                    url: '../main/index.html',
                                    bounces: false,
                                    slidBackEnabled: false,
                                    pageParam: { key: 'value' },
                                    animation: { type: 'none' }
                                });
                                setTimeout(function() {
                                    api && api.closeWin();
                                }, 1000);
                            }, 0);
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {

                    }
                });
            }
        }
    });

    login.loginHeight = api.winHeight;
    window.onresize = function() {
        var a = $(window).height();
        if (login.loginHeight > a) {
            login.versionShow = false;
        } else {
            login.versionShow = true;
        }
    }
    // 监听安卓返回按钮事件
    api && api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        api.closeWidget();
    });
    module.exports = {};
});
