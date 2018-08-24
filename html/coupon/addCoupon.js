define(function(require, exports, module) {

    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var addCoupon = new Vue({
        el: '#content',
        template: _g.getTemplate('coupon/addCoupon-body-V'),
        data: {
            addRule:'',
            choice: 0,
            dayOrMonth: 0,
            isSelectCash: 0,
            cash: '',
            coupon: '',
            limit: '',
            period: '',
            faceValue:'',
            type: 1,
            sendType: [{
                type: '每日固定发送',
            }, {
                type: '用户主动领取',
            }, {
                type: '用户抽奖领取',
            }, ],
            list: [{
                date: '天'
            }, {
                date: '月'
            }]
        },
        methods: {
            onChooseUserTap: function(index) {
                this.choice = index;
            },
            onSelectTap: function(index) {
                this.dayOrMonth = index;
            },
            onCashTap: function() {
                addCoupon.limit = '';
                addCoupon.coupon = '';
                this.isSelectCash = 1;
                this.type = 2;
            },
            onCouponTap: function() {
                addCoupon.limit = '';
                addCoupon.cash = '';
                this.isSelectCash = 0;
                this.type = 1;
            },
            onSubmitSendCouponTap: function() {
                getData();
            },
            onInputFaceValue: function() {
                if (this.isSelectCash == 0) {
                    this.cash = '',
                        this.faceValue = this.coupon;
                } else {
                    this.coupon = '',
                        this.faceValue = this.cash;
                }
            },

        }
    });

    function getData() {
        if (addCoupon.isSelectCash == 0) {
            addCoupon.cash = '',
                addCoupon.faceValue = addCoupon.coupon;
            if(addCoupon.limit == '') {
                _g.toast('请输入限额');
                return;
            }
        } else {
            addCoupon.coupon = '',
                addCoupon.faceValue = addCoupon.cash;
        }
        if(addCoupon.faceValue == '') {
            _g.toast('请输入面值');
            return;
        }
        if(addCoupon.period == '') {
            _g.toast('请输入有限期');
            return;
        }
        if(addCoupon.addRule == '') {
            _g.toast('请输入使用规则');
            return;
        }
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                kind: addCoupon.choice+1,
                yxq: addCoupon.period,
                yxqdw: addCoupon.dayOrMonth+1,
                limit: addCoupon.limit,
                mz: addCoupon.faceValue,
                type: addCoupon.type,
                rule: addCoupon.addRule,



            },
            isSync: true,
            url: '/jiekou/agentht/quan/addQuan.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        api.sendEvent({
                            name:'updateCouponList'
                        });
                        api && api.closeWin();
                    }, 0);
                    api && api.openFrame({
                        name: 'popupbox-addCouponSuccess',
                        url: '../popupbox/addCouponSuccess.html',
                        rect: {
                            x: 0,
                            y: headerHeight,
                            w: 'auto',
                            h: windowHeight,
                        },
                    });
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
                    api && api.openFrame({
                        name: 'popupbox-addCouponFail',
                        url: '../popupbox/addCouponFail.html',
                        rect: {
                            x: 0,
                            y: headerHeight,
                            w: 'auto',
                            h: windowHeight,
                        },
                    });
                }
            },
            error: function(err) {
                _g.toast("添加失败")
            }
        });
    }
    module.exports = {};

});
