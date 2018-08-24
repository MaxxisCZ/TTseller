define(function(require, exports, module) {
	var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var addReward = new Vue({
        el: '#addReward',
        template: _g.getTemplate('index/addReward-main-V'),
        data: {
            name: '',
            point: '',
            quanid: '',
            probability: '',
            kindText: '谢谢参与',
            kindValue: 1,
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
        },
        created: function() {

        },
        methods: {
            onAddRewardTap: function() {
                if(addReward.name == "") {
                    _g.toast("奖项名称不能为空！");
                    return
                }
                if(addReward.point == "") {
                    _g.toast("积分不能为空！");
                    return
                }
                if(addReward.quanid == "") {
                    _g.toast("选择券不能为空！");
                    return
                }
                if(addReward.probability == "") {
                    _g.toast("获奖概率不能为空！");
                    return
                }
                postRewardData();
            }
        },
    });
    // 提交添加奖励数据
    function postRewardData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                name: addReward.name,
                kind: addReward.kindValue,
                point: addReward.point,
                quanid: addReward.quanid,
                probability: addReward.probability,
            },
            lock: false,
            url: '/jiekou/agentht/settings/setDiscount.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    api.closeWin();
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

    module.exports = {};

});