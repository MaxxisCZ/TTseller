define(function(require, exports, module) {
	var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var editReward = new Vue({
        el: '#editReward',
        template: _g.getTemplate('index/editReward-main-V'),
        data: {
            isSetReward: false,
            hasCoupon: false,
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

        },
        methods: {
            // 添加收货奖项
            onAddRewardTap: function() {
                if(editReward.name == "") {
                    _g.toast("奖项名称不能为空！");
                    return
                }
                if(editReward.point == "") {
                    _g.toast("积分不能为空！");
                    return
                }
                if(editReward.probability == "") {
                    _g.toast("获奖概率不能为空！");
                    return
                }
                if(parseFloat(editReward.probability) > 1) {
                    _g.toast("获奖概率不能大于1！");
                    return
                }
                if(parseFloat(editReward.probabilitySum) + parseFloat(receiptReward.probability) > 1) {
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
                    this.probabilitySum = parseFloat(editReward.probability).toFixed(5);
                    this.probabilityStr = this.probability;
                    editReward.isReward = true;
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
                    this.probabilitySum = parseFloat(editReward.probabilitySum) + parseFloat(editReward.probability);
                    this.probabilitySum = parseFloat(editReward.probabilitySum).toFixed(5);
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
                setTimeout(function() {
                    api.setFrameAttr({
                        name: api.frameName,
                        hidden: true,
                    });
                }, 200);
            }
        },
    });
    // 奖品类型数组
    function findKindID() {
        for(var i = 0; i < editReward.kind.length; i++) {
            if(editReward.kindValue == editReward.kind[i].text) {
                editReward.kindid = editReward.kind[i].value;
                return
            }
        }
    }
    // 券的内容
    function findCouponListID() {
        for(var i = 0; i < editReward.couponList.length; i++) {
            if(editReward.couponValue == editReward.couponList[i].describe) {
                editReward.couponid = editReward.couponList[i].quanid;
                return
            }
        }
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
                        editReward.couponList = ret.data;
                        editReward.couponValue = ret.data[0].describe;
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

    getCouponData();

    module.exports = {};

});