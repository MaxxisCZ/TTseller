define(function(require, exports, module) {
    var windowHeight = window.innerHeight;
	var Http = require('U/http');
    var Vcode = require('U/vcode');
    var freightSetUp = new Vue({
        el: '#freightSetUp',
        template: _g.getTemplate('index/freightSetUp-main-V'),
        data: {
            detail: {
                money: '',
                full: '',
            },
            inputCode: '',
            code: '',
        },
        methods: {
            onCodeTap: function() {
                makeCodeTap();
            },
            onConfirmTap: function() {
                if(this.detail.money == '' && this.detail.full == '') {
                    makeCodeTap();
                    _g.toast('请输入运费和满额免运费');
                    return;
                }
                if(this.inputCode == '') {
                    makeCodeTap();
                    _g.toast('请输入验证码');
                    return;
                }
                if(this.inputCode.toUpperCase() != freightSetUp.code) {
                    makeCodeTap();
                    _g.toast('验证码不正确');
                    return;
                }
                postData();
            }
        },
    });
    function postData() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                yf: freightSetUp.detail.money,
                xe: freightSetUp.detail.full,
            },
            url: '/jiekou/agentht/agent/editFare.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    _g.toast(ret.msg);
                    makeCodeTap();
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
                    makeCodeTap();
                }
            },
            error: function(err) {},
        });
    }
    function getData() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
            },
            url: '/jiekou/agentht/agent/getFare.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    freightSetUp.detail = getDetail(data);
                    makeCodeTap();
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
    function getDetail(result) {
        var data = result ? result : '';
        return{
            money: data.yf || '',
            full: data.xe || '',
        };
    }
    function makeCodeTap() {
        freightSetUp.code = Vcode.getVerificationCode();
    }
    getData();

    module.exports = {};

});