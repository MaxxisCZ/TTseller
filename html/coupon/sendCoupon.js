define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var allUsersSubmitTimer;
    var sendCoupon = new Vue({
        el: '#content',
        template: _g.getTemplate('coupon/sendCoupon-body-V'),
        data: {
            isSending: false,
            sended: false,
            isShow: true,
            showSureBtn: true,
            isNetwork: false,
            isSelectAllUser: false,
            isSelectCash: 1,
            isSelectTime: true,
            dayOrMonth: 0,
            account: '',
            limit: '',
            deadline: '',
            cash: '',
            coupon: '',
            faceValue: '',
            msg: '',
            allAccount: '',
            list: [{
                date: '天'
            }, {
                date: '月'
            }]
        },
        methods: {
            onChooseUserTap: function() {
                this.isSelectAllUser = true;
                this.showSureBtn = false;
                if(this.isSelectAllUser == true && this.isSelectCash == true) {
                    this.isShow = true;
                } else {
                    this.isShow = false;
                }
            },
            onUserTap: function() {
                this.isSelectAllUser = false;
                this.showSureBtn = true;
                if(this.isSelectAllUser == true && this.isSelectCash == true) {
                    this.isShow = true;
                } else {
                    this.isShow = false;
                }
            },
            onCashTap: function() {
                sendCoupon.limit = '';
                sendCoupon.coupon = '';
                this.isSelectCash = true;
                if(this.isSelectAllUser == true && this.isSelectCash == true) {
                    this.isShow = true;
                } else {
                    this.isShow = false;
                }
            },
            onCouponTap: function() {
                sendCoupon.limit = '';
                sendCoupon.cash = '';
                this.isSelectCash = false;
                if(this.isSelectAllUser == true && this.isSelectCash == true) {
                    this.isShow = true;
                } else {
                    this.isShow = false;
                }
            },
            onSelectTap: function(index) {
                this.dayOrMonth = index;
            },
            onSubmitSendCouponTap: function() {
                if (this.isSelectCash == 0) {
                    this.cash = '',
                        this.faceValue = this.coupon;
                } else {
                    this.faceValue = this.cash;
                }
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        kind: sendCoupon.isSelectCash + 1,
                        yxq: sendCoupon.deadline,
                        mz: sendCoupon.faceValue,
                        yxqdw: sendCoupon.dayOrMonth + 1,
                        limit: sendCoupon.limit,
                        account: sendCoupon.account,
                    },
                    isSync: true,
                    url: '/jiekou/agentht/quan/addUserQuan.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            api.sendEvent({
                                name:'coupon-coupon-updateCouponRewardList'
                            });
                            api && api.closeWin();
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
                    }
                });
            },
            allUsersSubmit: function() {
                if (sendCoupon.isSelectCash == 0) {
                    sendCoupon.cash = '',
                        sendCoupon.faceValue = sendCoupon.coupon;
                } else {
                    sendCoupon.faceValue = sendCoupon.cash;
                }
                if(sendCoupon.faceValue == '') {
                    _g.toast('请输入面值',4000);
                    return
                }
                if(sendCoupon.limit == '' && !sendCoupon.isShow) {
                    _g.toast('请输入限额',4000);
                    return
                }
                if(sendCoupon.deadline == '') {
                    _g.toast('请输入有效期限',4000);
                    return
                }
                if(sendCoupon.sended == false) {
                    sendCoupon.sended = true;
                } else {
                    alert("先暂停才能再点击确认!");
                    return
                }
                sendCoupon.isSending = true;
                allUsersSubmitTimer = setInterval(submit, 1000);
            },
            onStopTap: function() {
                if(sendCoupon.sended) {
                    sendCoupon.sended = false;
                    sendCoupon.isSending = false;
                    setTimeout(function() {
                        clearInterval(allUsersSubmitTimer);
                    }, 0);
                    alert("已暂停发送!");
                } else {
                    alert("优惠券发送中才能暂停!");
                }
            },
            onInputFaceValue: function() {
                if (this.isSelectCash == 0) {
                    this.cash = '',
                        this.faceValue = this.coupon;
                } else {
                    this.faceValue = this.cash;
                }
            },
        }
    });

    function submit() {
        if(sendCoupon.isShow) {
            Http.ajax({
                data: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    kind: sendCoupon.isSelectCash + 1,
                    yxq: sendCoupon.deadline,
                    mz: sendCoupon.faceValue,
                    yxqdw: sendCoupon.dayOrMonth + 1,
                    // limit: sendCoupon.limit,
                    token: UserInfo.token
                },
                isSync: true,
                url: '/jiekou/agentht/quan/addUserQuan2.aspx',
                success: function(ret) {
                    if (ret.zt == 1) {
                        sendCoupon.allAccount = ret.account;
                        sendCoupon.msg = ret.msg;
                    } else if (ret.zt == 2) {
                        clearInterval(allUsersSubmitTimer);
                        sendCoupon.allAccount = '';
                        sendCoupon.msg = ret.msg;
                        _g.toast(ret.msg);
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
                }
            });
        } else {
            Http.ajax({
                data: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    kind: sendCoupon.isSelectCash + 1,
                    yxq: sendCoupon.deadline,
                    mz: sendCoupon.faceValue,
                    yxqdw: sendCoupon.dayOrMonth + 1,
                    limit: sendCoupon.limit,
                    token: UserInfo.token
                },
                isSync: true,
                url: '/jiekou/agentht/quan/addUserQuan2.aspx',
                success: function(ret) {
                    if (ret.zt == 1) {
                        sendCoupon.allAccount = ret.account;
                        sendCoupon.msg = ret.msg;
                    } else if (ret.zt == 2) {
                        clearInterval(allUsersSubmitTimer);
                        sendCoupon.allAccount = '';
                        sendCoupon.msg = ret.msg;
                        _g.toast(ret.msg);
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
                }
            });
        }
        
    }

    module.exports = {};

});
