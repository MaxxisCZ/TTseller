define(function(require, exports, module) {
    // var loginname = _g.getLS('UserInfo').loginname;
    var UserInfo = _g.getLS('UserInfo');
    var Vcode = require('U/vcode');
	var Http = require('U/http');
    var changePsw = new Vue({
        el: '#changePsw',
        template: _g.getTemplate('index/changePsw-main-V'),
        data: {
            phone: '',
            code: '',
            newPswOne: '',
            newPswTwo: '',
            isFinish: false,
            codeText: ''
        },
        created: function() {
            Vcode.init({
                onInit: this.onInit,
                onAction: this.onAction
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
                var phoneReg = /^1[0-9]{10}$/;
                if(this.phone === '') {
                    _g.toast('手机号码不能为空');
                    return;
                }
                if (!phoneReg.test(this.phone)) {
                    _g.toast('手机号码不规范');
                    return;
                }
                getCode(this.phone);
            },
            onPhoneInput: function() {
                if(this.phone && this.code && this.newPswOne && this.newPswTwo) {
                    this.isFinish = true;
                } else {
                    this.isFinish = false;
                }
            },
            onCodeInput: function() {
                if(this.phone && this.code && this.newPswOne && this.newPswTwo) {
                    this.isFinish = true;
                } else {
                    this.isFinish = false;
                }
            },
            onNewPswOneInput: function() {
                if(this.phone && this.code && this.newPswOne && this.newPswTwo) {
                    this.isFinish = true;
                } else {
                    this.isFinish = false;
                }
            },
            onNewPswTwoInput: function() {
                if(this.phone && this.code && this.newPswOne && this.newPswTwo) {
                    this.isFinish = true;
                } else {
                    this.isFinish = false;
                }
            },
            onFinishTap: function() {
                var phoneReg = /^1[0-9]{10}$/;
                var codeReg = /^[0-9]{6}$/;
                var newPswReg= /^[a-zA-Z0-9]{6,20}$/;
                if(this.newPswOne.length < 6) {
                    _g.toast('密码不能少于6位');
                    return;
                }
                if(phoneReg.test(changePsw.phone) && codeReg.test(changePsw.code) && newPswReg.test(changePsw.newPswOne) && newPswReg.test(changePsw.newPswTwo)) {
                    if (this.newPswOne != this.newPswTwo) {
                        _g.toast('新密码与确认密码不同');
                        return;
                    }
                    this.isFinish = true;
                    Http.ajax({
                        data: {
                            loginname: _g.getLS('UserInfo').loginname,
                            mobile: changePsw.phone,
                            yzm: changePsw.code,
                            password: changePsw.newPswOne,
                        },
                        url: '/jiekou/agentht/staff/findPwd.aspx',
                        success: function(ret) {
                            if(ret.zt == 1) {
                                _g.toast(ret.msg);
                                this.phone = '';
                                this.code = '';
                                this.newPswOne = '';
                                this.newPswTwo = '';
                                this.isFinish = false;
                                setTimeout(function() {
                                    api && api.closeWin();
                                }, 2000);
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
                
            }
        }
        
    });
    function getMobile() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            url: '/jiekou/agentht/staff/getStaff.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    changePsw.phone = ret.data.mobile;
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
    var getCode = function(phone) {
        if (Vcode.isAllow()) {
            Http.ajax({
                data: {
                    mobile: phone,
                },
                isSync: true,
                url: '/jiekou/agentht/staff/getCheckcode.aspx',
                success: function(ret) {
                    if(ret.zt == 1) {
                        Vcode.start();
                        this.vcode = Vcode.getRandom(6);
                        _g.toast('验证码发送成功');
                    } else {
                        _g.toast('验证码发送失败');
                    }
                },
                    error: function(err) {},
            });
        } else {
            _g.toast('请在倒计时结束再点击获取新的验证码!');
        }
        
    }
    getMobile();

    module.exports = {};

});