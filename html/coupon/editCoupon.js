define(function(require, exports, module) {
    var Http = require('U/http');
    var couponID = api && api.pageParam.couponID;
    var UserInfo = _g.getLS("UserInfo");
    var editCoupon = new Vue({
        el: '#content',
        template: _g.getTemplate('coupon/editCoupon-body-V'),
        data: {
            editRule:'',
            choice: 0,
            isSelectTime: 0,
            isSelectCash: 0,
            cash: 0,
            coupon: 0,
            limit: 0,
            faceValue: 0,
            deadline: 0,
            type: 1,
            sendType: [{
                type: '每日固定发送',

            }, {
                type: '用户主动领取',

            }, {
                type: '抽奖奖项',

            }, ]
        },
        methods: {
            onChooseUserTap: function(index) {
                this.choice = index;
                this.num = index + 1;
            },
            onSelectDayTap: function() {
                this.isSelectTime = 0;
            },
            onSelectMonthTap: function() {
                this.isSelectTime = 1;
            },
            onCashTap: function() {
                this.limit = '';
                this.coupon = '';
                this.isSelectCash = 1;
                this.type = 2;
            },
            onCouponTap: function() {
                this.limit = '';
                this.cash = '';
                this.isSelectCash = 0;
                this.type = 1;
            },
            onSubmitSendCouponTap: function() {
                if (this.isSelectCash == 0) {
                    this.cash = '',
                    this.faceValue = this.coupon;
                } else {
                    this.coupon = '',
                    this.faceValue = this.cash;
                }
                if(editCoupon.editRule == '') {
                    _g.toast('请输入使用规则');
                    return;
                }
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        quanid: couponID,
                        kind: this.choice + 1,
                        yxq: this.deadline,
                        yxqdw: this.isSelectTime+1,
                        limit: this.limit,
                        mz: this.faceValue,
                        token: UserInfo.token,
                        type: this.type,
                        rule: editCoupon.editRule,



                    },
                    isSync: true,
                    url: '/jiekou/agentht/quan/editQuan.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            _g.toast(ret.msg);
                            api.sendEvent({
                                name:'updateCouponList'
                            });
                            api&&api.closeWin();
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
                    error: function(err) {}
                });
            },
            onInputFaceValue: function() {
                if (this.isSelectCash == 0) {
                    this.cash = '',
                    this.faceValue = this.coupon;
                } else {
                    this.coupon = '',
                    this.faceValue = this.cash;
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
                quanid: couponID,
            },
            isSync: true,
            url: '/jiekou/agentht/quan/getQuanDetail.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    editCoupon.choice = data.quan_kind - 1;
                    editCoupon.limit = data.quan_limit;
                    editCoupon.deadline = data.quan_yxsc;
                    editCoupon.type = data.quan_type;
                    editCoupon.cash = data.quan_mz;
                    editCoupon.coupon = data.quan_mz;
                    editCoupon.isSelectCash = isSelectCash(data.quan_type);
                    editCoupon.editRule = data.quan_rule;
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
    function isSelectCash(param) {
        if(param == 1) {
            return(false);
        } else {
            return(true);
        }
    }
    getData();

    module.exports = {};

});
