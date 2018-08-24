define(function(require, exports, module) {
    var pageIndex = 1;
	var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var receiptReward = new Vue({
        el: '#receiptReward',
        template: _g.getTemplate('index/receiptReward-main-V'),
        data: {
            isSetReward: false,
            hasCoupon: false,
            isShow: false,
            isReward: false,
            isGetData: false,
            name: '',
            point: '',
            quanid: '',
            probability: '',
            kindValue: '谢谢参与',
            kindid: '',
            couponValue: '',
            couponid: '',
            nameStr: '',
            kindStr: '',
            pointStr: '',
            quanidStr: '',
            probabilityStr: '',
            probabilitySum: 0,
            kind: [{
                text: '谢谢参与',
                value: 1,
            }, {
                text: '优惠券',
                value: 2,
            }, {
                text: '积分',
                value: 3,
            }, {
                text: '现金券',
                value: 4,
            }, ],
            couponList: [{
                describe: '',
                quanid: '',
            }],
            rewardList: [{
                name: '测试1',
                coupon: '优惠券',
                tBill: '10T币',
                describe: '5.00元优惠券满50元50元使用',
                probability: '10%',
            }, {
                name: '测试1',
                coupon: '优惠券',
                tBill: '10T币',
                describe: '5.00元优惠券满50元50元使用',
                probability: '10%',
            }, ],
        },
        created: function() {
            this.rewardList = [];
        },
        methods: {
            // 保存提交收货奖项
            onSaveTap: function() {
                postRewardData();
            },
            // 添加收货奖项
            onAddRewardTap: function() {
                if(receiptReward.name == "") {
                    _g.toast("奖项名称不能为空！");
                    return
                }
                if(receiptReward.point == "") {
                    _g.toast("积分不能为空！");
                    return
                }
                if(receiptReward.probability == "") {
                    _g.toast("获奖概率不能为空！");
                    return
                }
                if(parseFloat(receiptReward.probability) > 1) {
                    _g.toast("获奖概率不能大于1！");
                    return
                }
                if(parseFloat(receiptReward.probabilitySum) + parseFloat(receiptReward.probability) > 1) {
                    _g.toast("获奖概率总数不能大于1！");
                    return
                }
                findKindID();
                findCouponListID();
                if(this.rewardList.length == 0) {
                    this.rewardList = [{
                        name: this.name,
                        coupon: this.kindValue,
                        tBill: this.point,
                        describe: this.couponValue,
                        probability: this.probability
                    }];
                    this.nameStr = this.name;
                    this.kindStr = this.kindid;
                    this.pointStr = this.point;
                    this.quanidStr = this.couponid;
                    this.probabilitySum = parseFloat(receiptReward.probability).toFixed(5);
                    this.probabilityStr = this.probability;
                    receiptReward.isReward = true;
                } else {
                    this.rewardList.push({
                        name: this.name,
                        coupon: this.kindValue,
                        tBill: this.point,
                        describe: this.couponValue,
                        probability: this.probability,
                    });
                    this.nameStr = this.nameStr + ',' + this.name;
                    this.kindStr = this.kindStr + ',' + this.kindid;
                    this.pointStr = this.pointStr + ',' + this.point;
                    this.quanidStr = this.quanidStr + ',' + this.couponid;
                    this.probabilitySum = parseFloat(receiptReward.probabilitySum) + parseFloat(receiptReward.probability);
                    this.probabilitySum = parseFloat(receiptReward.probabilitySum).toFixed(5);
                    this.probabilityStr = this.probabilityStr + ',' + this.probability;
                }
            },
            // 取消添加收货奖项
            oncancelTap: function() {
                this.name == "";
                this.kindValue == '谢谢参与';
                this.point == "";
                this.quanid == "";
                this.probability == "";
                this.isShow = false;
            }
        },
    });
    // 获取收货奖项数据
    function getRewardData() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: 20,
            },
            lock: false,
            url: '/jiekou/agentht/settings/getPrize.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    receiptReward.isSetReward = true;
                    setTimeout(function() {
                        var data = ret.data;
                        receiptReward.hasCoupon = true;
                        // receiptReward.isReward = true;   // 删除全部奖项后才能添加新奖项
                        receiptReward.rewardList = receiptReward.rewardList.concat(getRewardDetail(data));
                        pageIndex ++;
                        receiptReward.isGetData = true;
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 500);
                    }, 0);
                } else if(ret.zt == 2) {
                    receiptReward.isSetReward = false;
                    receiptReward.isReward = false;
                    _g.toast(ret.msg);
                    _g.hideProgress();
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
                    receiptReward.isSetReward = false;
                    _g.toast(ret.msg);
                    _g.hideProgress();
                }
            },
            error: function(err) {},
        });
    }

    // 获取优惠券数据
    function getCouponData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/quan/getQuan2.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        receiptReward.couponList = ret.data;
                        receiptReward.couponValue = ret.data[0].describe;
                    }, 0);
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
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    function getRewardDetail(result) {
        var data = result ? result : [];
        return _.map(data, function(detail) {
            return{
                name: detail.name || '',
                coupon: detail.kind || '',
                describe: detail.quanname || '',
                probability: detail.probability || 0,
                tBill: detail.point || 0,
            }
        });
    }
    // 删除全部收货奖项
    function delAllReward() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/settings/deletePrize.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        pageIndex = 1;
                        receiptReward.isReward = false;
                        receiptReward.nameStr = '';
                        receiptReward.kindStr = '';
                        receiptReward.pointStr = '';
                        receiptReward.quanidStr = '';
                        receiptReward.probabilityStr = '';
                        receiptReward.probabilitySum = 0;
                        receiptReward.rewardList = [];
                        receiptReward.isGetData = false;
                    }, 0);
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
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    // 提交添加奖励数据
    function postRewardData() {
        if(parseFloat(receiptReward.probabilitySum) != 1) {
            // alert(receiptReward.probabilitySum);
            alert("奖励概率总数要等于1");
            return
        }
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                name: receiptReward.nameStr,
                kind: receiptReward.kindStr,
                point: receiptReward.pointStr,
                quanid: receiptReward.quanidStr,
                probability: receiptReward.probabilityStr,
            },
            lock: false,
            url: '/jiekou/agentht/settings/setPrize.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    receiptReward.isReward = false;
                    receiptReward.nameStr = '';
                    receiptReward.kindStr = '';
                    receiptReward.pointStr = '';
                    receiptReward.quanidStr = '';
                    receiptReward.probabilityStr = '';
                    receiptReward.probabilitySum = 0;
                    receiptReward.rewardList = [];
                    pageIndex = 1;
                    getRewardData();
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    // 奖品类型数组
    function findKindID() {
        for(var i = 0; i < receiptReward.kind.length; i++) {
            if(receiptReward.kindValue == receiptReward.kind[i].text) {
                receiptReward.kindid = receiptReward.kind[i].value;
                return
            }
        }
    }
    // 券的内容
    function findCouponListID() {
        for(var i = 0; i < receiptReward.couponList.length; i++) {
            if(receiptReward.couponValue == receiptReward.couponList[i].describe) {
                receiptReward.couponid = receiptReward.couponList[i].quanid;
                return
            }
        }
    }
    // 删除全部奖励
    api.addEventListener({
        name: 'index-receiptReward-delAllReward',
    }, function(ret, err) {
        if(receiptReward.rewardList.length == 0) {
            _g.toast('暂无奖励可删除');
            return;
        }
        api.confirm({
            title: '注意',
            msg: '确定删除全部奖励',
            buttons: ['取消', '确定']
        }, function(ret, err) {
            if(ret.buttonIndex == 2) {
                receiptReward.hasCoupon = false;
                if(receiptReward.isGetData == true) {
                    delAllReward();
                } else {
                    receiptReward.isReward = false;
                    receiptReward.nameStr = '';
                    receiptReward.kindStr = '';
                    receiptReward.pointStr = '';
                    receiptReward.quanidStr = '';
                    receiptReward.probabilityStr = '';
                    receiptReward.probabilitySum = 0;
                    receiptReward.rewardList = [];
                }
            }
        });
    });

    // 打开添加奖励
    api.addEventListener({
        name: 'index-receiptReward-addReward',
    }, function(ret, err) {
        if(receiptReward.hasCoupon == true) {
            alert('请删除已有的奖励才能添加~');
        } else {
            setTimeout(function() {
                receiptReward.isShow = true;
            }, 0);
        }
    });

    api && api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0
        }
    }, function(ret, err) {
        if(receiptReward.isSetReward == true) {
            getRewardData();
        }
    });
    // _g.setPullDownRefresh(function() {
    //     setTimeout(function() {
    //         receiptReward.isReward = false;
    //         receiptReward.nameStr = '';
    //         receiptReward.kindStr = '';
    //         receiptReward.pointStr = '';
    //         receiptReward.quanidStr = '';
    //         receiptReward.probabilityStr = '';
    //         receiptReward.probabilitySum = 0;
    //         receiptReward.rewardList = [];
    //         pageIndex = 1;
    //         getRewardData();
    //     }, 0);
    // });
    api && api.setRefreshHeaderInfo({
        visible: false,
        loadingImg: 'widget://image/refresh.png',
        bgColor: '#ccc',
        textColor: '#fff',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function(ret, err){
        setTimeout(function() {
            window.isNoMore = false;
            receiptReward.isReward = false;
            receiptReward.nameStr = '';
            receiptReward.kindStr = '';
            receiptReward.pointStr = '';
            receiptReward.quanidStr = '';
            receiptReward.probabilityStr = '';
            receiptReward.probabilitySum = 0;
            receiptReward.rewardList = [];
            pageIndex = 1;
            getRewardData();
            callback && callback();
        }, 0);
    });

    getRewardData();
    getCouponData();

    module.exports = {};

});
