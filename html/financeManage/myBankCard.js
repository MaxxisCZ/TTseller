define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var myBankCard = new Vue({
        el: '#myBankCard',
        template: _g.getTemplate('financeManage/myBankCard-main-V'),
        data: {
            hasCard: false,
            myCard: [{
                logo: '',
                number: '',
                name: '',
                bank: '',
                cardID: '',
            }]
        },
        created: function() {
            this.myCard = [];
        },
        methods: {
            onDelTap: function(index) {
                _.each(this.myCard, function(n, i) {
                    if(i == index) {
                        api.confirm({
                            title: '注意',
                            msg: '确定删除该卡！',
                            buttons: ['取消','确定']
                        }, function(ret,err) {
                            if(ret.buttonIndex == 2) {
                                Http.ajax({
                                    data: {
                                        loginname: UserInfo.loginname,
                                        agentid: UserInfo.agentid,
                                        staffid: UserInfo.staffid,
                                        token: UserInfo.token,
                                        cardid: n.cardID,
                                    },
                                    lock: false,
                                    url: '/jiekou/agentht/caiwujilu/deleteBankaccount.aspx',
                                    success: function(ret) {
                                        if(ret.zt == 1) {
                                            myBankCard.myCard = [];
                                            getData();
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
                    }
                });
            }
        },
    });
    function getData() {
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
                    myBankCard.myCard = getDetail(data);
                    myBankCard.hasCard = true;
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
                    myBankCard.hasCard = false;
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    function getDetail(result) {
        var detail = result ? result.yhks : [];
        return _.map(detail, function(data) {
            return {
                logo: data.logo || '',
                number: data.cardnumber || '',
                name: data.name || '',
                bank: data.bank || '',
                cardID: data.cardid || '',
            }
        });
    }
    getData();
    api && api.addEventListener({
        name: 'financeManage-addBankCard',
    }, function(ret, err) {
        if(ret.value.change == 1) {
            getData();
        }
    });
    _g.setPullDownRefresh(function() {
        pageIndex = 1;
        myBankCard.myCard = [];
        getData();
    });

    module.exports = {};

});