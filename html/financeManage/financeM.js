define(function(require, exports, module) {
    var pageIndex = 1;
    var PageSize = 30;
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var financeM = new Vue({
        el: '#content',
        template: _g.getTemplate('financeManage/financeM-body-V'),
        data: {
            hiddenMoney: true,
            balance: 0,
            showBalance: '0',
            isNetwork: false,
            isShowDetail: true,
            list: [{
                time: '2016/8/7 0:00:00',
                payReason: '233',
                money: '33'
            },{
                time: '2016/8/7 0:00:00',
                payReason: '233',
                money: '33'
            },{
                time: '2016/8/7 0:00:00',
                payReason: '233',
                money: '33'
            },]
        },
        created: function() {
            this.list = [];
        },
        methods: {
            onShowMoneyTap: function() {
                if(this.hiddenMoney == true) {
                    this.hiddenMoney = false;
                } else {
                    this.hiddenMoney = true;
                }
                setVisible();
            },
            onShowDetail: function() {
                if (this.isShowDetail == true) {
                    this.isShowDetail = false;
                } else {
                    this.isShowDetail = true;
                }
            },
            onRechargeTap: function() {
                _g.openWin({ 
                    header: {
                        data: {
                            title: '充值',
                        },
                    },
                    name: 'financeManage-recharge',
                    url: '../financeManage/recharge.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onCashTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '提现',
                        },
                        template: 'common/header-titleR-V'
                    },
                    name: 'financeManage-cash',
                    url: '../financeManage/cash.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            }
        }
    });
    function getMoneyData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/agent/getBalance.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    financeM.balance = ret.data.balance;
                    financeM.showBalance = ret.data.balance;
                    if(ret.data.isvisible == 1) {
                        financeM.hiddenMoney = true;
                    } else {
                        financeM.hiddenMoney = false;
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
                }
            },
            error: function(err) {},
        });
    }

    function setVisible() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/agent/setVisible.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    getMoneyData();
                    api && api.sendEvent({
                        name: 'me-index-setVisible',
                    });
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
                }
            },
            error: function(err) {},
        });
    }

    function getFinanceList() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                PageSize: PageSize
            },
            lock: false,
            // isSync: true,
            url: '/jiekou/agentht/caiwujilu/getCaiwujilu.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            financeM.list = machFinanceList(ret.data);
                        } else {
                            financeM.list = financeM.list.concat(machFinanceList(ret.data));
                        }
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 500);
                    }, 0);

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
                    if(pageIndex == 1) {
                        financeM.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {
                _g.toast("获取失败")
            }
        });
    }

    function machFinanceList(data) {
        var list = data ? data.cws : [];
        return _.map(list, function(item) {
            return {
                time: item.cw_sj || '',
                payReason: item.cw_fkyy || '',
                money: item.cz_je || ''
            };
        });
    }
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getFinanceList();
    });
    getMoneyData();
    getFinanceList();
    
    api.addEventListener({
        name: 'financeManage-financeM-getNewMoney'
    }, function(ret, err) {
        getMoneyData();
    });
    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            window.isNoMore = false;
            pageIndex = 1;
            // financeM.list = [];
            financeM.balance = 0;
            financeM.isShowDetail = true;
            setTimeout(function() {
                getMoneyData();
                getFinanceList();
            }, 500);
        }, 0);
    });
    module.exports = {};

});
