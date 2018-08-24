define(function(require,exports,module) {
    var deposit = new Vue({
        el:'#deposit',
        template:_g.getTemplate('me/deposit-main-V'),
        data:{
            topIndex: 0,
            isAliPay: true,
            isWeChat: false,
            isCharge: true,
            isInputMoney: false,
            money: '',
            toplist: [{
                title: '我要充值',
                isSelected: true,
            }, {
                title: '已完成',
                isSelected: false,
            }, {
                title: '未完成',
                isSelected: false,
            }, ],
            chargeList: [{
                id: '5382',
                number: 'CZ16101216361512',
                time: '2017/4/10 15:40:23',
                money: '53.9',
                style: '用户订单付款'
            }, {
                id: '5382',
                number: 'CZ16101216361512',
                time: '2017/4/10 15:40:23',
                money: '53.9',
                style: '用户订单付款'
            }, ],
        },
        methods:{
            onTopTap: function(index) {
                this.toplist[this.topIndex].isSelected = false;
                this.toplist[index].isSelected = true;
                this.topIndex = index;
                if(index == 0) {
                    this.isCharge = true;
                } else {
                    this.isCharge = false;
                }
            },
            onPayStyleTap: function(number) {
                if(number == 1) {
                    this.isAliPay = true;
                    this.isWeChat = false;
                } else if(number == 2) {
                    this.isAliPay = false;
                    this.isWeChat = true;
                }
            },
            onMoneyInput: function() {
                if(this.money != '') {
                    this.isInputMoney = true;
                } else {
                    this.isInputMoney = false;
                }
            },
            onChargeTap: function() {
                if(this.isInputMoney == true) {
                    alert('充值');
                } else {
                    _g.toast('请输入金额！');
                }
            }
        }
    });

    function getData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                PageSize: PageSize,
                fkzt: 1,
            },
            lock: false,
            url: '/jiekou/agentht/caiwujilu/getChongzhi.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        var data = ret.data;
                        deposit.list = deposit.list.concat(chargeDetail(data));
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
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {
                _g.toast("获取失败")
            }
        });
    }

    function chargeDetail(data) {
        var list = data ? data.czs : [];
        return _.map(list, function(item) {
            return {
                id: item.cz_id || '',
                number: item.cz_ddh || '',
                time: item.cz_fksj || '',
                money: item.cz_je || '',
                style: chargeStyle(item.cz_fkfs) || ''
            };
        });
    }

    function chargeStyle(data) {
        switch (data) {
            case '1':
                return('支付宝支付')
            case '2':
                return('微信支付')
            case '3':
                return('管理员充值')
            case '4':
                return('管理员退款')
            case '5':
                return('用户订单付款')
        }
    }

    module.exports = {};
});
