define(function(require, exports, module) {
    var pageIndex = 1;
    var pageSize = 20;
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var cash = new Vue({
        el: '#cash',
        template: _g.getTemplate('financeManage/cash-main-V'),
        data: {
            balance: '0',
            money: '',
            bankCardID: '',
            isCash: true,
            topList: [{
                title: '我要提现',
                isSelected: true,
            }, {
                title: '提现记录',
                isSelected: false,
            }, ],
            cardDetail: {
                logo: '',
                bank: '',
                lastNumber: '',
                bankCardID: '',
            },
            detail: [{
                orderID: '',
                cardID: '',
                money: '',
                time: '',
                state: '',
                isDel: '',
            }]
        },
        created: function() {
            this.detail = [];
        },
        methods: {
            onCashTap: function(index) {
                _.each(this.topList, function(n, i) {
                    if(i == index) {
                        n.isSelected = true;
                    } else {
                        n.isSelected = false;
                    }
                });
                if(index == 0) {
                    this.isCash = true;
                } else {
                    this.isCash = false;
                }
                if(index == 1) {
                    getCashNote();
                }
            },
            onSelectCardTap: function() {
                _g.openWin({
                    header:{
                        data: {
                            title: '选择银行卡'
                        }
                    },
                    name: 'financeManage-selectCard',
                    url: '../financeManage/selectCard.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {

                    }
                });
            },
            onDeleteTap: function(index) {
                if(cash.detail[index].isDel == true) {
                    api.confirm({
                        title: '注意',
                        msg: '请再次确定删除该提现记录',
                        buttons: ['取消', '确定']
                    }, function(ret, err) {
                        if(ret.buttonIndex == 2) {
                            Http.ajax({
                                data: {
                                   loginname: UserInfo.loginname,
                                    agentid: UserInfo.agentid,
                                    staffid: UserInfo.staffid,
                                    token: UserInfo.token,
                                    id: cash.detail[index].orderID,
                                },
                                url: '/jiekou/agentht/caiwujilu/deleteWidthdraw.aspx',
                                success: function(ret) {
                                    if(ret.zt == 1) {
                                        // this.detail = [];
                                        getCashNote();
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
                    });
                } else {
                    api.confirm({
                        title: '注意',
                        msg: '请再次确定撤销该提现记录',
                        buttons: ['取消', '确定']
                    }, function(ret, err) {
                        if(ret.buttonIndex == 2) {
                            Http.ajax({
                                data: {
                                   loginname: UserInfo.loginname,
                                    agentid: UserInfo.agentid,
                                    staffid: UserInfo.staffid,
                                    token: UserInfo.token,
                                    id: cash.detail[index].orderID,
                                },
                                url: '/jiekou/agentht/caiwujilu/cancelWithdraw.aspx',
                                success: function(ret) {
                                    if(ret.zt == 1) {
                                        getCashNote();
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
                    });
                }

            },
            onConfirmTap: function() {
                var moneyReg = /^[0-9]{1,8}$/;
                if(this.money === '') {
                    _g.toast('金额不能为空');
                    return;
                }
                if(!moneyReg.test(this.money * 100)) {
                    _g.toast('请输入100万以内的金额');
                    this.money = '';
                    return;
                }
                //添加提现记录
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        je: cash.money,
                        cardid: cash.cardDetail.bankCardID,
                    },
                    isSync: true,
                    url: '/jiekou/agentht/caiwujilu/addWidthdraw.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            // _g.toast(ret.msg);
                            api.alert({
                                msg: '提现成功，等待后台处理',
                            }, function(ret, err) {
                                _g.openWin({
                                    header: {
                                        data: {
                                            title: '',
                                            noLeftBtn: true
                                        }
                                    },
                                });
                            });
                            cash.money = '';
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
                            return;
                        }
                    },
                    error: function(err) {}
                });
            },
            postSubmit: function() {

            }
        }
    });
    //获取总资产
    function getMoneyData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/agent/getBalance.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    cash.balance = ret.data.balance2;
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
    //获取提现记录
    function getCashNote() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/caiwujilu/getWithdraw.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if (pageIndex == 1) {
                            cash.detail = getCashDetail(ret.data);
                        }else {
                            cash.detail = cash.detail.concat(getCashDetail(ret.data));
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
                    if (pageIndex == 1) {
                        cash.detail = [];
                    }
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    //获取银行卡记录
    function getCardData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/caiwujilu/getBankaccount.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    cash.cardDetail = getDetail(data);
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
                    // 没有银行卡跳至添加银行卡
                    setTimeout(function() {
                        _g.openWin({
                            header: {
                                data: {
                                    title: '添加银行卡'
                                },
                                // template: 'financeManage/header-base-V'
                            },
                            name: 'financeManage-addBankCard',
                            url: '../financeManage/addBankCard.html?mod=dev',
                            bounces: false,
                            slidBackEnabled: false,
                        });
                        setTimeout(function() {
                            api && api.closeWin();
                        }, 700);
                    }, 700);

                }
            },
            error: function(err) {},
        });
    }
    function getCashDetail(result) {
        var detail = result ? result.txs : '';
        return _.map(detail, function(data) {
            return {
                orderID: data.tx_id || '',
                cardID: data.tx_kh || '',
                money: data.tx_je || '',
                time: data.tx_sj || '',
                state: data.tx_cl || '',
                isDel: isDelete(data.tx_cl) || '',
            }
        });
    }
    function getDetail(result) {
        var detail = result ? result.yhks : [];
        return {
            logo: detail[0].logo || '',
            lastNumber: (detail[0].endnum || ''),
            bank: detail[0].bank || '',
            bankCardID: detail[0].cardid || '',
        }
    }
    function isDelete(param) {
        if(param == '已撤销') {
            return(true);
        } else if( param == '待处理') {
            return(false);
        }
    }
    api && api.addEventListener({
        name: 'financeManage-selectCard-cardId',
    }, function(ret, err) {
        if(ret.value.cardID) {
            cash.cardDetail.logo = ret.value.logo;
            cash.cardDetail.bank = ret.value.bank;
            cash.cardDetail.lastNumber = ret.value.cardNO;
            cash.cardDetail.bankCardID = ret.value.cardID;
        }
    });
    getMoneyData();
    getCardData();

    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getCashNote();
    });

    module.exports = {};

});
