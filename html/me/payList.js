define(function(require, exports, module) {

    var Http = require('U/http');

    var payList = new Vue({
        el: '#payList',
        template: _g.getTemplate('me/payList-V'),
        data: {
            list: [{
                money: '+20',
                time: '2016/6/20',
                min: '12:00:00',
                status: '交易取消',
                reason: '不喜欢',
                type: '1'
            }, {
                money: '+20',
                time: '2016/6/20',
                min: '12:00:00',
                status: '交易取消',
                reason: '不喜欢',
                type: '1'
            }, {
                money: '+20',
                time: '2016/6/20',
                min: '12:00:00',
                status: '交易取消',
                reason: '不喜欢',
                type: '1'
            }, {
                money: '+20',
                time: '2016/6/20',
                min: '12:00:00',
                status: '交易取消',
                reason: '不喜欢',
                type: '1'
            }]
        },
        // created: function() {
        //     this.list = [];
        // },
        methods: {

        }
    });
    console.log(_g.getLS('UserInfo'));
    _g.toast(_g.getLS('UserInfo'));

    function getData() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                userid: _g.getLS('UserInfo').userid,
            },
            isSync: true,

            url: '/jiekou/agentht/user/getCaiwujil.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    var list = getPayList(ret.data);
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

    function getPayList(data) {
        var list = payList.list;
        return _.map(list, function(item) {
            return {
                cwjl_1_fkyy: item.reason||'',
                cwjl_1_sj: item.time && item.min ||'',
                cwjl_1_je: item.money||'',
                cwjl_1_kind: item.type || 0,
            }
        });
    }
    getData();
    module.exports = {};
});
