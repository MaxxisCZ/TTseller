define(function(require, exports, module) {

	var Http = require('U/http');
    var Vcode = require('U/vcode');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var code = new Vue({
        el: '#code',
        template: _g.getTemplate('financeManage/code-main-V'),
        data: {
            phone: '13678960123',
            code: '',
            codeText: '',
            isPass: false,
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
            onCodeInput: function() {
                if(this.code != '') {
                    this.isPass = true;
                } else {
                    this.isPass = false;
                }
            },
            onGetCodeTap: function() {
                http.ajax({
                    data: {
                        mobile: this.phone
                    },
                    url: '/jiekou/agentht/staff/getCheckcode.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            Vcode.start();
                            _g.toast('验证码发送成功');
                        } else {
                            _g.toast('验证码发送失败');
                        }
                    },
                });
            },
            onSumbit: function() {
                if(this.code == '')
                    return;
                Http.ajax({
                    data: {
                        yzm: code.code,
                    },
                    url: '',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            setTimeout(function() {
                                _g.toast(ret.msg);
                                setTimeout(function() {
                                    api && api.openFrame({
                                        name: 'popupbox-addCardSuccess',
                                        url: '../popupbox/addCardSuccess.html',
                                        rect: {
                                            x: 0,
                                            y: headerHeight,
                                            w: 'auto',
                                            h: windowHeight,
                                        },
                                    });
                                }, 500);
                            }, 0);
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            }
        },
    });

    module.exports = {};

});