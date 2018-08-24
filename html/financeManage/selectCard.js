define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var selectCard = new Vue({
        el: '#selectCard',
        template: _g.getTemplate('financeManage/selectCard-main-V'),
        data: {
            isDefault: 0,
            selectBank: '',
            selectCardID: '',
            selectCardNO: '',
            selectLogo: '',
            myCard: [{
                logo: '',
                bank: '农业银行',
                lastNumber: '1314',
                number: '',
                isSelected: true,
                cardID: '',
            }, {
                logo: '',
                bank: '建设银行',
                lastNumber: '5351',
                number: '',
                isSelected: false,
                cardID: '',
            }, ]
        },
        created: function() {
            this.myCard = [];
        },
        methods: {
            onSelectCardTap: function(index) {
                if(index != this.isDefault) {
                    selectCard.myCard[index].isSelected = true;
                    selectCard.myCard[this.isDefault].isSelected = false;
                    selectCard.selectLogo = selectCard.myCard[index].logo;
                    selectCard.selectBank = selectCard.myCard[index].bank;
                    selectCard.selectCardID = selectCard.myCard[index].cardID;
                    selectCard.selectCardNO = selectCard.myCard[index].lastNumber;
                    selectCard.selectCardNO = selectCard.myCard[index].number;
                    this.isDefault = index;
                // } else {
                //     selectCard.selectLogo = selectCard.myCard[index].logo;
                //     selectCard.selectBank = selectCard.myCard[index].bank;
                //     selectCard.selectCardID = selectCard.myCard[index].cardID;
                //     selectCard.selectCardNO = selectCard.myCard[index].lastNumber;
                }
            },
            onSumbitTap: function() {
                api.sendEvent({
                    name:'financeManage-selectCard-cardId',
                    extra: {
                        logo: selectCard.selectLogo,
                        cardID: selectCard.selectCardID,
                        bank: selectCard.selectBank,
                        cardNO: selectCard.selectCardNO,
                    }
                });
                api && api.closeWin();
            }
        },
    });
    function defaultBank(isDefault) {
        _.each(selectCard.myCard, function(n, i) {
            if(i == isDefault) {
                n.isSelected = true;
                selectCard.selectBank = n.cardID;
            } else {
                n.isSelected = false;
            }
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
                    selectCard.myCard = getDetail(data);
                    defaultBank(selectCard.isDefault);
                    selectCard.selectLogo = selectCard.myCard[selectCard.isDefault].logo;
                    selectCard.selectBank = selectCard.myCard[selectCard.isDefault].bank;
                    selectCard.selectCardID = selectCard.myCard[selectCard.isDefault].cardID;
                    selectCard.selectCardNO = selectCard.myCard[selectCard.isDefault].lastNumber;
                    selectCard.selectCardNO = selectCard.myCard[selectCard.isDefault].number;
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
        var detail = result ? result.yhks : [];
        return _.map(detail, function(data) {
            return {
                logo: data.logo || '',
                // lastNumber: (data.endnum || '').substr(-4,4),
                number: data.cardnumber || '',
                name: data.name || '',
                bank: data.bank || '',
                cardID: data.cardid || '',
                isSelected: false,
            }
        });
    }
    getCardData();

    module.exports = {};

});
