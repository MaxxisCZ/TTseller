define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var system = new Vue({
        el: '#system',
        template: _g.getTemplate('index/system-main-V'),
        data: {
            havePwd: false,
            selector: true,
            selectG: true,
            selectGNum: 0,
            selectR: false,
            size: 0,
            getMessage: false,
            isQuit: false,
        },
        methods: {
            onchangePsw: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '修改密码',
                        },
                    },
                    name: 'index-changePsw',
                    url: '../index/changePsw.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onSelectorInforTap: function() {
                if(this.selectG == false) {
                    this.selectG = true;
                    this.selectGNum = 1;
                } else {
                    this.selectG = false;
                    this.selectGNum = 0;
                }
                Http.ajax({
                    data: {
                        loginname: _g.getLS('UserInfo').loginname,
                        agentid: _g.getLS('UserInfo').agentid,
                        staffid: _g.getLS('UserInfo').staffid,
                        token: _g.getLS('UserInfo').token,
                        ms_on: this.selectGNum,
                    },
                    url: '/jiekou/agentht/agent/switchMs.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            _g.toast(ret.msg);
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
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {},
                });
            },
            onPswTap: function(event) {
                if($(event.target).closest('.ui-select').length > 0) {
                    if(this.selectR == false) {
                        if(system.havePwd == false) {
                            _g.openWin({
                                header: {
                                    data: {
                                        title: '支付密码',
                                    },
                                },
                                name: 'index-setUpPwd',
                                url: '../index/setUpPwd.html',
                                bounces: false,
                                slidBackEnabled: false,
                            });
                        }
                    } else {
                        // this.selectR = false;
                        // _g.rmLS('payPassWord');
                        // system.havePwd = false;
                        _g.openWin({
                            header: {
                                data: {
                                    title: '关闭支付密码',
                                },
                            },
                            name: 'index-closePwd',
                            url: '../index/closePwd.html',
                            bounces: false,
                            slidBackEnabled: false,
                        });
                    }
                } else {
                    _g.openWin({
                        header: {
                            data: {
                                title: '支付密码',
                            },
                        },
                        name: 'index-setUpPwd',
                        url: '../index/setUpPwd.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                }

            },
            onChangePwdTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '修改支付密码',
                        },
                    },
                    name: 'index-changePwd',
                    url: '../index/changePwd.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onFreightTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '运费设置',
                        },
                    },
                    name: 'index-freightSetUp',
                    url: '../index/freightSetUp.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onPrintTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '打印设置',
                        },
                    },
                    name: 'index-printSetUp',
                    url: '../index/printSetUp.html',
                    bounces: false,
                    softInputMode: 'resize',
                    slidBackEnabled: false,
                });
            },
            onRadiationTap:function(){
              _g.openWin({
                header:{
                  data:{
                    title:'辐射距离设置',
                  },
                },
                name:'index-radiationSetUp',
                url:'../index/radiationSetUp.html',
                bounces: false,
                softInputMode: 'resize',
                slidBackEnabled: false,
              });
            },
            onDiscountTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '打折设置',
                        },
                    },
                    name: 'index-discountSetUp',
                    url: '../index/discountSetUp.html',
                    bounces: false,
                    softInputMode: 'resize',
                    slidBackEnabled: false,
                });
            },
            onReceiptTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '确认收货奖励',
                        },
                        template: 'common/header-delOrAdd-V'
                    },
                    name: 'index-receiptReward',
                    url: '../index/receiptReward.html',
                    bounces: false,
                    softInputMode: 'resize',
                    slidBackEnabled: false,
                });
            },
            onScanTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '扫一扫',
                        },
                    },
                    name: 'scan-index',
                    url: '../scan/index.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onCleanCacheTap:function(){
                _g.showProgress();
                api.clearCache({
                    // timeThreshold:30
                }, function() {
                    _g.hideProgress();
                    _g.toast('缓存清理成功');
                });
                system.size = 0;
            },
            onCleanLSTap: function() {
                api.confirm({
                    title: '注意',
                    msg: '确定退出登录？',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if(ret.buttonIndex == 2) {
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
                            _g.closeWins(['main-index-win','index-system-win'])
                        }, 1000)
                    }
                });
            },
            onAboutUsTap :function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '关于我们',
                        },
                    },
                    name: 'index-about',
                    url: '../index/about.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onApplyQuitTap: function() {
              //  applyQuitAgent();
              /*  api.confirm({
                    title: '提示信息',
                    msg: '您是否退出加盟商?',
                    buttons: ['确定', '取消']
                }, function (ret, err) {
                    if (ret.buttonIndex == 1) {
                        applyQuitAgent();
                    }
                });
                */
                api.prompt({
                       title: '您是否退出加盟?',
                       msg: '提示：如果您确定退出加盟，请在下方输入框输入“确认退出加盟”并点击确定按钮',
                       buttons: ['确定', '取消']
                    }, function(ret, err) {
                    //  alert(ret.text)
                      if (ret.buttonIndex == 1){
                        if(ret.text=='确认退出加盟'){
                          applyQuitAgent();
                        }else{
                            _g.toast('请输入正确的提示语')
                        }
                      }
                    });
            },

            cannelyQuitTap:function(){
                  applyQuitAgent();
            },
        },
    });
    function getMessage() {
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
                    if(ret.data.ms_on == 1) {
                        system.selectG = true;
                    } else {
                        system.selectG = false;
                    }
                } else if(ret.zt == -1) {
                    api && api.openWin({
                        name: 'account-login-win',
                        url: './html/account/login.html',
                        pageParam: {
                            from: 'root'
                        },
                        bounces: false,
                        slidBackEnabled: false,
                        animation: {
                            type: 'none'
                        }
                    });
                }
            }
        });
    }
    function applyQuitAgent() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/agent/setIsout.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    getAgentTap();
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
            }
        });
    }
    function getAgentTap() {
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
                    if(ret.data.isout == 1) {
                        system.isQuit = true;
                    } else {
                        system.isQuit = false;
                    }
                }
            }
        });
    }
    function getCacheSize() {
        var size = api.getCacheSize({
            sync: true
        });
        system.size = Math.ceil(size / 1024);
    }
    getCacheSize();
    api && api.addEventListener({
        name: 'index-system-isPwd',
    }, function(ret, err) {
        if(ret.value.isPwd == 1) {
            system.selectR = true;
        } else {
            system.selectR = false;
        }
    });

    function havePsw() {
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
                    if(ret.data.payflag == 1) {
                        system.selectR = true;
                    }
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
                    system.selectR = false;
                }
            },
            error: function(err) {},
        });
    }
    havePsw();
    api.addEventListener({
        name: 'index-system-openUrl'
    }, function(ret, err) {
        _g.openWin({
            header:{
                data:{
                    title:'hello'
                }
            },
            name: 'system-openUrl',
            url: ret.value.url,
            bounces:true,
            slidBackEnabled:false
        });
        setTimeout(function(){
            _g.closeWins(['scan-index-win']);
        },500);
    });
    getMessage();
    getAgentTap();

    module.exports = {};

});
