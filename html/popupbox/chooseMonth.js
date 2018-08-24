define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var year = api && api.pageParam.year;
    var chooseMonth = new Vue({
        el: '#chooseMonth',
        template: _g.getTemplate('popupbox/chooseMonth-V'),
        data: {
            list: [{
                month: ''
            }]
        },
        methods: {
            onCancelTap: function() {
                api.setFrameAttr({
                    hidden: true
                });
            },
            onSureTap: function() {
                api.sendEvent({
                    name: 'updateCostRecord',
                });
                api.setFrameAttr({
                    hidden: true
                });
            }
        }
    });

    function getData() {
        Http.ajax({
            data: {
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                loginname: UserInfo.loginname,
                year: year
            },
            isSync: true,

            url: '/jiekou/agentht/cost/getMonth.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    chooseMonth.list = machData(ret.data);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    function machData(data) {
        return _.map(data, function(item) {
            return {
                month: item || 0
            }
        });
    }
    getData();
    module.exports = {};
});
