define(function(require, exports, module) {
    var index = api && api.pageParam.index;
    var style = api && api.pageParam.style;
    var code = api && api.pageParam.code;
    var mobile = api && api.pageParam.mobile;
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var myOldPayPwd = new Vue({
        el: '#myOldPayPwd',
        template: _g.getTemplate('index/myOldPayPwd-main-V'),
        data: {
            isShow: true,
            pwd: '',
            isFir: false,
            isSec: false,
            isThr: false,
            isFou: false,
            isFif: false,
            isSix: false,
            numberList: [{
                number: '1',
            }, {
                number: '2',
            }, {
                number: '3',
            }, {
                number: '4',
            }, {
                number: '5',
            }, {
                number: '6',
            }, {
                number: '7',
            }, {
                number: '8',
            }, {
                number: '9',
            }, {
                number: '',
            }, {
                number: '0',
            }, ]
        },
        methods: {
            onOpenTap: function() {
                this.isShow = true;
            },
            onCloseTap: function() {
                this.isShow = false;
            },
            onDeleteTap: function() {
                if(this.pwd.length == 0) return;
                this.pwd = this.pwd.substring(0, this.pwd.length - 1);
                if(this.pwd != '') {
                    if(this.pwd.length < 2) {
                        this.isFir = true;
                        this.isSec = false;
                        this.isThr = false;
                        this.isFou = false;
                        this.isFif = false;
                        this.isSix = false;
                    } else if(this.pwd.length < 3) {
                        this.isFir = true;
                        this.isSec = true;
                        this.isThr = false;
                        this.isFou = false;
                        this.isFif = false;
                        this.isSix = false;
                    } else if(this.pwd.length < 4) {
                        this.isFir = true;
                        this.isSec = true;
                        this.isThr = true;
                        this.isFou = false;
                        this.isFif = false;
                        this.isSix = false;
                    } else if(this.pwd.length < 5) {
                        this.isFir = true;
                        this.isSec = true;
                        this.isThr = true;
                        this.isFou = true;
                        this.isFif = false;
                        this.isSix = false;
                    } else if(this.pwd.length < 6) {
                        this.isFir = true;
                        this.isSec = true;
                        this.isThr = true;
                        this.isFou = true;
                        this.isFif = true;
                        this.isSix = false;
                    } else if(this.pwd.length < 7) {
                        this.isFir = true;
                        this.isSec = true;
                        this.isThr = true;
                        this.isFou = true;
                        this.isFif = true;
                        this.isSix = true;
                    }
                } else {
                    this.isFir = false;
                    this.isSec = false;
                    this.isThr = false;
                    this.isFou = false;
                    this.isFif = false;
                    this.isSix = false;
                }
            },
            onPasswordInput: function(index) {
                if(this.pwd.length == 6) return;
                if(index == 0) {
                    this.pwd += '1';
                }
                if(index == 1) {
                    this.pwd += '2';
                }
                if(index == 2) {
                    this.pwd += '3';
                }
                if(index == 3) {
                    this.pwd += '4';
                }
                if(index == 4) {
                    this.pwd += '5';
                }
                if(index == 5) {
                    this.pwd += '6';
                }
                if(index == 6) {
                    this.pwd += '7';
                }
                if(index == 7) {
                    this.pwd += '8';
                }
                if(index == 8) {
                    this.pwd += '9';
                }
                if(index == 10) {
                    this.pwd += '0';
                }
                if(this.pwd != '') {
                    if(this.pwd.length < 2) {
                        this.isFir = true;
                        this.isSec = false;
                        this.isThr = false;
                        this.isFou = false;
                        this.isFif = false;
                        this.isSix = false;
                    } else if(this.pwd.length < 3) {
                        this.isFir = true;
                        this.isSec = true;
                        this.isThr = false;
                        this.isFou = false;
                        this.isFif = false;
                        this.isSix = false;
                    } else if(this.pwd.length < 4) {
                        this.isFir = true;
                        this.isSec = true;
                        this.isThr = true;
                        this.isFou = false;
                        this.isFif = false;
                        this.isSix = false;
                    } else if(this.pwd.length < 5) {
                        this.isFir = true;
                        this.isSec = true;
                        this.isThr = true;
                        this.isFou = true;
                        this.isFif = false;
                        this.isSix = false;
                    } else if(this.pwd.length < 6) {
                        this.isFir = true;
                        this.isSec = true;
                        this.isThr = true;
                        this.isFou = true;
                        this.isFif = true;
                        this.isSix = false;
                    } else if(this.pwd.length < 7) {
                        this.isFir = true;
                        this.isSec = true;
                        this.isThr = true;
                        this.isFou = true;
                        this.isFif = true;
                        this.isSix = true;
                    }
                } else {
                    this.isFir = false;
                    this.isSec = false;
                    this.isThr = false;
                    this.isFou = false;
                    this.isFif = false;
                    this.isSix = false;
                }
            },
            onNextTap: function() {
                // 提交密码
                if(myOldPayPwd.pwd.length === 6) {
                    if(style == 1) {
                        _g.openWin({
                            header: {
                                data: {
                                    title: '支付密码',
                                },
                            },
                            name: 'index-payPwd',
                            url: '../index/payPwd.html',
                            bounces: false,
                            slidBackEnabled: false,
                            pageParam: {
                                oldPwd: myOldPayPwd.pwd,
                                code: myOldPayPwd.code,
                                mobile: myOldPayPwd.mobile,
                                style: 1,
                            }
                        });
                    } else if(style == 3) {
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                token: UserInfo.token,
                                paypwd: this.pwd,
                            },
                            url: '/jiekou/agentht/settings/closePayPwd.aspx',
                            success: function(ret) {
                                if(ret.zt == 1) {
                                    // api && api.sendEvent({
                                    //     name: 'index-setUpPwd-closePwd',
                                    // });
                                    api && api.openFrame({
                                        name: 'popupbox-closePwd',
                                        url: '../popupbox/closePwd.html',
                                        rect: {
                                            x: 0,
                                            y: headerHeight,
                                            w: 'auto',
                                            h: windowHeight,
                                        },
                                    });
                                    // setTimeout(function(){
                                    //     api && api.closeWin();
                                    // },1000);
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
                                    setTimeout(function(){
                                        api && api.closeWin();
                                    },1000);
                                }
                            },
                            error: function(err) {},
                        });
                    }
                } else {
                    _g.toast('请输入6位支付密码');
                }
                
            }
        },
    });
    module.exports = {};

});