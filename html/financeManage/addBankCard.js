define(function(require, exports, module) {
	var Http = require('U/http');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var UserInfo = _g.getLS('UserInfo');
    var addBankCard = new Vue({
        el: '#addBankCard',
        template: _g.getTemplate('financeManage/addBankCard-main-V'),
        data: {
            oneName: '',
            cardNO: '',
            numberAgain: '',
            number: '',
            numbertext: '',
            cardNum: '',
            showNo: '银行卡卡号',
						opening:'',
            cardStr:'',
            bankName: '',
            bankID: '',
            isPass: false,
            change: 1,
            selected: '',
            options: [{
                name: '',
                bankID: '',
            }, ],
        },
        methods: {
            onSelectBankCard: function() {
                setTimeout(function() {
                    if(addBankCard.oneName !== '' && addBankCard.cardNO !== '' && addBankCard.numberAgain != '' && addBankCard.selected != '') {
                        addBankCard.isPass = true;
                    } else {
                        addBankCard.isPass = false;
                    }
                }, 0);
            },
            onExplainTap: function() {
                api && api.openFrame({
                    name: 'popupbox-bankCardExplain',
                    url: '../popupbox/bankCardExplain.html',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: windowHeight,
                    },
                });
            },
            onOneNameInput: function() {
                // var cardNOReg = /^[0-9]{23}$/;
                var cardNOReg = /^[0-9 ]$/;
                if(this.oneName !== '' && this.cardNO !== '' && this.numberAgain != '' && this.selected != '') {
                    this.isPass = true;
                } else {
                    this.isPass = false;
                }
            },
            onShowTap: function() {
                addBankCard.showNo = '';
            },
            onCardNoInput: function() {
                // 通过输入银行卡号判断卡的银行名字
                // if(this.cardNO.length == 6) {
                //     api.sendEvent({
                //         name: 'financeManage-addBankCard-getBankName',
                //     });
                // }
                // 限制只能输入23位数的号码
                // if(this.cardNO.length > 23){
                //     this.cardNO = this.cardNO.substring(0,23);
                // }
                // var cardNOReg = /^[0-9 ]{23}$/;
                if(this.oneName !== '' && this.cardNO != '' && this.numberAgain != '' && this.selected != '') {
                    this.isPass = true;
                } else {
                    this.isPass = false;
                }
                if(this.number.length < this.cardNO.length) {
                    if(this.cardNO.length == 4 || this.cardNO.length == 9 || this.cardNO.length == 14 || this.cardNO.length == 19 || this.cardNO.length == 24 || this.cardNO.length == 29) {
                        this.cardNO += ' ';
                    }
                    if(this.number.length == 4 || this.number.length == 9 || this.number.length == 14 || this.number.length == 19 || this.number.length == 24 || this.number.length == 29) {
                        var string = this.cardNO.substring(0,this.cardNO.length-1) + ' ' + this.cardNO.substring(this.cardNO.length-2,this.cardNO.length-1);
                        this.cardNO = string;
                    }
                } else if(this.number.length > this.cardNO.length){
                    if(this.cardNO.length == 5 || this.cardNO.length == 10 || this.cardNO.length == 15 || this.cardNO.length == 20 || this.cardNO.length == 25 || this.cardNO.length == 30) {
                         this.cardNO = this.cardNO.substring(0,this.cardNO.length-1);
                    }
                }
                this.number = this.cardNO;
            },
            onNumberAgainInput: function() {
                if(this.oneName !== '' && this.cardNO != '' && this.numberAgain != '' && this.selected != '') {
                    this.isPass = true;
                } else {
                    this.isPass = false;
                }
                if(this.numbertext.length < this.numberAgain.length) {
                    if(this.numberAgain.length == 4 || this.numberAgain.length == 9 || this.numberAgain.length == 14 || this.numberAgain.length == 19 || this.numberAgain.length == 24 || this.numberAgain.length == 29) {
                        this.numberAgain += ' ';
                    }
                    if(this.numbertext.length == 4 || this.numbertext.length == 9 || this.numbertext.length == 14 || this.numbertext.length == 19 || this.numbertext.length == 24 || this.numbertext.length == 29) {
                        var string = this.numberAgain.substring(0,this.numberAgain.length-1) + ' ' + this.numberAgain.substring(this.numberAgain.length-2,this.numberAgain.length-1);
                        this.numberAgain = string;
                    }
                } else if(this.numbertext.length > this.numberAgain.length){
                    if(this.numberAgain.length == 5 || this.numberAgain.length == 10 || this.numberAgain.length == 15 || this.numberAgain.length == 20 || this.numberAgain.length == 25 || this.numberAgain.length == 30) {
                         this.numberAgain = this.numberAgain.substring(0,this.numberAgain.length-1);
                    }
                }
                this.numbertext = this.numberAgain;
            },
            onNextTap: function() {
                if(this.isPass == true) {
                    getBankCard();
                } else {
                    _g.toast('请完善添加银行卡的资料');
                }
            }
        },
    });
    function getBankData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            url: '/jiekou/agentht/caiwujilu/getBank.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    addBankCard.options = addBankCard.options.concat(getBankDetail(data));
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
    function getBankDetail(result) {
        var data = result ? result : [];
        return _.map(data, function(detail) {
            return{
                name: detail.bankname || '',
                bankID: detail.bankid || '',
            }
        });
    }
    function getBankCard() {
        setTimeout(function() {
            var bankNum = '';
            _.each(addBankCard.options, function(n, i) {
                if(n.name == addBankCard.selected) {
                    bankNum = n.bankID;
                    return
                }
            });
            setTimeout(function() {
                Http.ajax({
                data: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    token: UserInfo.token,
                    name: addBankCard.oneName,
                    cardnumber: addBankCard.cardNO.replace(/\s/g,""),
                    numberagain: addBankCard.numberAgain.replace(/\s/g,""),
                    bankid: bankNum,
										opening:addBankCard.opening,
                },
                isSync: true,
                url: '/jiekou/agentht/caiwujilu/addBankaccount.aspx',
                success: function(ret) {
                    if (ret.zt == 1) {
                        setTimeout(function() {
                            addBankCard.change = 1;
                            api.sendEvent({
                                name:'financeManage-addBankCard',
                                extra: {
                                    change: addBankCard.change
                                }
                            });
                            api && api.closeWin();
                        }, 0);
                        addBankCard.change = 0;
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
            }, 500);
        }, 0);
    }
    getBankData();
    api.addEventListener({
        name:'financeManage-addBankCard-getBankName',
    }, function(ret, err) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                cardnumber: addBankCard.cardNO,
            },
            url: '/jiekou/agentht/caiwujilu/getBankName.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    addBankCard.bankName = ret.data.bank;
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
                // else {
                //     _g.toast(ret.msg);
                // }
            },
            error: function(err) {},
        });
    });
    module.exports = {};

});
