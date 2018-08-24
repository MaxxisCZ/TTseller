define(function(require, exports, module) {
	var Http = require('U/http');
    var Vcode = require('U/vcode');
    var UserInfo = _g.getLS('UserInfo');
    var discountSetUp = new Vue({
        el: '#discountSetUp',
        template: _g.getTemplate('index/discountSetUp-main-V'),
        data: {
            code: '',
            inputCode: '',
            discount1: 0,
            discount2: 0,
        },
        created: function() {

        },
        methods: {
            // 点击刷新二维码
            onCodeTap: function() {
                makeCodeTap();
            },
            onSumbitTap: function() {
                if(discountSetUp.discount1 == "") {
                    makeCodeTap();
                    _g.toast("请输入第二天的折扣");
                    return
                }
                if(discountSetUp.discount2 == "") {
                    makeCodeTap();
                    _g.toast("请输入第三天的折扣");
                    return
                }
                if(discountSetUp.discount1 > 1 ||discountSetUp.discount2 > 2) {
                    makeCodeTap();
                    _g.toast("折扣不能大于1");
                    return
                }
                if(discountSetUp.inputCode == "") {
                    makeCodeTap();
                    _g.toast("请输入验证码");
                    return
                }
                if(discountSetUp.inputCode.toUpperCase() != discountSetUp.code) {
                    makeCodeTap();
                    _g.toast("验证码不正确");
                    return
                }
                // 对折扣进行四舍五入取小数点后两位
                discountSetUp.discount1 = parseFloat(discountSetUp.discount1,10).toFixed(2);
                discountSetUp.discount2 = parseFloat(discountSetUp.discount2,10).toFixed(2);
                setTimeout(function() {
                    postData();
                }, 200);
            }
        },
    });

    function makeCodeTap() {
        discountSetUp.code = Vcode.getVerificationCode();
    }
    function postData() {
        makeCodeTap();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                discount1: discountSetUp.discount1,
                discount2: discountSetUp.discount2,
            },
            lock: false,
            url: '/jiekou/agentht/settings/setDiscount.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    api.closeWin();
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
    function getDiscountData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/agent/getAgent.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    discountSetUp.discount1 = ret.data.discount1;
                    discountSetUp.discount2 = ret.data.discount2;
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
    // 生成码
    makeCodeTap();
    getDiscountData();

    module.exports = {};

});