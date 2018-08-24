define(function(require, exports, module) {

    var Http = require('U/http');
    var Vcode = require('U/vcode');

    var forget = new Vue({
        el: '#forget',
        template: _g.getTemplate('account/forget-V'),
        data: {
            loginName: '',
            phone: '',
            code: '',
            password: '',
            newPassword: '',
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
            sendCode: function() {
                var phoneReg = /^1[0-9]{10}$/;
                if (!phoneReg.test(this.phone)) {
                    _g.toast('手机号码不正确!');
                    return;
                }
                if (Vcode.isAllow()) {
                    Http.ajax({
                        data: {
                            mobile: this.phone
                        },

                        isSync: true,

                        url: '/jiekou/agentht/staff/getCheckcode.aspx',

                        success: function(ret) {

                            if (ret.zt == 1) {
                                Vcode.start();
                                this.vcode = Vcode.getRandom(6);
                                _g.toast('验证码发送成功');
                            } else {
                                _g.toast('验证码发送失败');
                            }
                        },
                    });
                } else {
                    _g.toast('请在倒计时结束再点击获取新的验证码!');
                }

            },
            confirm: function() {
                var mobileReg = /^1[0-9]{10}$/;
                var passwordReg = /^[A-Za-z0-9]{6,16}$/;
                var vcodeReg=/^[0-9]{6}$/;
                if (this.phone == '') {
                    _g.toast('手机号不能为空');
                    return;
                }
                if(!mobileReg.test(this.phone)) {
                    _g.toast('请输入11位数的手机号码');
                    return;
                }
                if (this.code == '') {
                    _g.toast('验证码不能为空');
                    return;
                }
                if(!vcodeReg.test(this.code)) {
                    _g.toast('请输入6位数的验证码');
                    return;
                }
                if (this.password == '') {
                    _g.toast('密码不能为空')
                    return;
                }
                if(!passwordReg.test(this.password)) {
                    _g.toast('请输入6~16位数字/字母组合的密码');
                    return;
                }
                if (this.newPassword == '') {
                    _g.toast('确认密码不能为空');
                    return;
                }
                if (this.password.length < 6) {
                    _g.toast('密码不能小于6位');
                    return;
                }
                if (this.password != this.newPassword) {
                    _g.toast('输入的密码不一致');
                    return;
                }
                postData();
            },
        }

    });

    function postData() {
        Http.ajax({
            data: {
                loginname: forget.loginName,
                mobile: forget.phone,
                yzm: forget.code,
                password: forget.newPassword
            },
            isSync: true,
            url: '/jiekou/agentht/staff/findPwd.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    _g.toast(ret.msg);
                    api && api.closeWin();
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    module.exports = {};
});
