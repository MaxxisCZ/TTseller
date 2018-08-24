define(function(require, exports, module) {
    var pageIndex = 1;
    var pageSize = 20;
    var deposit = api && api.pageParam.deposit;
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var recharge = new Vue({
        el: '#recharge',
        template: _g.getTemplate('financeManage/recharge-main-V'),
        data: {
            deposit: deposit,
            depositMoney: '0.00',
            money: '',
            paySuc: 1,
            payStyle: 1,
            aliPay: true,
            weChat: false,
            isRecharge: true,
            isTouched: true,
            kind: 0,
            topList: [{
                title: '我要充值',
                isSelected: true,
            }, {
                title: '已完成',
                isSelected: false,
            }, {
                title: '未完成',
                isSelected: false,
            }, ],
            detail: [{
                noteID: '',
                ordNo: '',
                orderID: '',
                time: '',
                money: '',
                payStyle: '',
            }]
        },
        created: function() {
            this.detail = [];
            setTimeout(function() {
                if(deposit == true) {
                    recharge.kind = 1;
                } else {
                    recharge.kind = 0;
                }
            }, 100);
        },
        methods: {
            onRechargeTap: function(index) {
                _.each(this.topList, function(n, i) {
                    if(i == index) {
                        n.isSelected = true;
                    } else {
                        n.isSelected = false;
                    }
                });
                if(index == 0) {
                    recharge.isRecharge = true;
                } else {
                    recharge.isRecharge = false;
                }
                if(index == 1) {
                    pageIndex = 1;
                    recharge.paySuc = 1;
                    this.detail = [];
                    getUnfinishNote(recharge.paySuc);
                } else if(index == 2) {
                    pageIndex = 1;
                    recharge.paySuc = 0;
                    this.detail = [];
                    getUnfinishNote(recharge.paySuc);
                }
                // 待付款
                //  else if(index == 3) {
                //     pageIndex = 1;
                //     recharge.paySuc = 0;
                //     this.detail = [];
                //     getUnfinishNote(recharge.paySuc);
                // }
            },
            onAlipayTap: function() {
                if(this.aliPay == false) {
                    this.aliPay = true;
                    this.weChat = false;
                    this.payStyle = 1;
                }
            },
            onWechatTap: function() {
                if(this.weChat == false) {
                    this.aliPay = false;
                    this.weChat = true;
                    this.payStyle = 2;
                }
            },
            onDeleteTap: function(index) {
                api.confirm({
                    title: '注意',
                    msg: '确定删除该充值记录',
                    buttons: ['取消','确定']
                }, function(ret,err) {
                    if(ret.buttonIndex == 2) {
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                token: UserInfo.token,
                                czid: recharge.detail[index].noteID,
                            },
                            url: '/jiekou/agentht/caiwujilu/deleteChongzhi.aspx',
                            success: function(ret) {
                                if(ret.zt == 1) {
                                    pageIndex = 1;
                                    // recharge.detail = [];
                                    getUnfinishNote(recharge.paySuc);
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
                });
            },
            onConfirmTap: function() {
                var moneyReg = /^[0-9]{1,8}$/;
                if(this.money === '') {
                    _g.toast('金额不能为空');
                    return;
                }
                if(!moneyReg.test(this.money * 100)) {
                    _g.toast('请输入100万以内且大于0.01元的金额');
                    this.money = '';
                    return;
                }
                if(this.isTouched == true) {
                    this.isTouched = false;
                    var rechargeMoney = recharge.money * 100;
                    var rechargeStyle = '';
                    var title = '';
                    if(recharge.payStyle == 1) {
                        rechargeStyle = 'ALI_APP';
                        title = '支付宝';
                    } else if(recharge.payStyle == 2) {
                        rechargeStyle = 'WX_APP';
                        title = '微信支付';
                    }
                    Http.ajax({
                        data: {
                            loginname: UserInfo.loginname,
                            agentid: UserInfo.agentid,
                            staffid: UserInfo.staffid,
                            token: UserInfo.token,
                            je: recharge.money,
                            fkfs: recharge.payStyle,
                            kind: recharge.kind,
                        },
                        isSync: true,
                        url: '/jiekou/agentht/caiwujilu/addChongzhi.aspx',
                        success: function(ret) {
                            if(ret.zt == 1) {
                                var orderNum = ret.ordernum;
                                var payData = {
                                    channel: rechargeStyle,
                                    title: title,
                                    totalfee: rechargeMoney,
                                    billno: orderNum,
                                    // optional: {
                                    //             userID: 张三,
                                    //             mobile: 0512-86861620
                                    //         }
                                };
                                var demo = api.require('beecloud');
                                demo.pay(payData, payCallBack);
                                function payCallBack(ret, err) {
                                    recharge.isTouched = true;
                                    api.toast({ msg: ret.result_msg });
                                    if(ret.result_code == 0) {
                                        setTimeout(function() {
                                            api.sendEvent({
                                                name: 'me-index-getNewMoney',
                                            });
                                            setTimeout(function() {
                                                api.sendEvent({
                                                    name: 'financeManage-financeM-getNewMoney',
                                                });
                                            }, 500);
                                        }, 1000);
                                        recharge.topList[0].isSelected = false;
                                        recharge.topList[1].isSelected = true;
                                        recharge.isRecharge = false;
                                        pageIndex = 1;
                                        getUnfinishNote(1);
                                        recharge.isTouched = true;
                                    } else if(ret.result_code == -1) {  // 充值失败
                                        alert('支付失败');
                                        // recharge.topList[0].isSelected = false;
                                        // recharge.topList[2].isSelected = true;
                                        // recharge.isRecharge = false;
                                        // pageIndex = 1;
                                        // getUnfinishNote(2);
                                        // recharge.isTouched = true;
                                    }
                                }
                            } else if(ret.zt == 2) {
                                recharge.topList[0].isSelected = false;
                                recharge.topList[3].isSelected = true;
                                recharge.isRecharge = false;
                                pageIndex = 1;
                                getUnfinishNote(0);
                                recharge.isTouched = true;
                            } else {
                                _g.toast(ret.msg);
                                recharge.isTouched = true;
                            }
                        },
                        error: function(err) {}
                    });
                } else {
                    return
                }
            },
        },
    });
    function getUnfinishNote(param) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageSize: pageSize,
                pageIndex: pageIndex,
                fkzt: param,
                kind: recharge.kind,
            },
            isSync: true,
            url: '/jiekou/agentht/caiwujilu/getChongzhi.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            recharge.detail = getFinishNote(ret.data);
                        } else {
                            recharge.detail = recharge.detail.concat(getFinishNote(ret.data));
                        }
                    }, 100);
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
                        recharge.detail = [];
                    }
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    function getFinishNote(result) {
        var detail = result ? result.czs : '';
        return _.map(detail, function(data) {
            return {
                noteID: data.cz_id || '',
                ordNo: data.cz_ddh || '',
                orderID: data.cz_ddid || '',
                time: data.cz_fksj || '',
                money: data.cz_je || '',
                payStyle: payStyleText(data.cz_fkfs) || '',
            }
        });
    }
    function payStyleText(result) {
        switch(result) {
            case 1:
                return("支付宝支付");
                break;
            case 2:
                return("微信支付");
                break;
            case 3:
                return("管理员充值");
                break;
            case 4:
                return("管理员退款");
                break;
            case 5:
                return("用户订单付款");
                break;
        }
    }
    // 获取应付保证金
    function getDepositData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            url: '/jiekou/agentht/agent/getDeposit.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    recharge.depositMoney = ret.data.needpay;
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

    api && api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0
        }
    }, function(ret, err) {
        setTimeout(function() {
            pageIndex ++;
            getUnfinishNote(recharge.paySuc);
        }, 0);
    });

    getDepositData();

    module.exports = {};

});
