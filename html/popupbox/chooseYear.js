define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var chooseYear = new Vue({
        el: '#chooseYear',
        template: _g.getTemplate('popupbox/chooseYear-V'),
        data: {
            year: 'A',
            list: [{
                year: ''
            }]
        },
        methods: {
            onCancelTap: function() {
                api.setFrameAttr({
                    hidden: true
                });
            },
            onAddTap: function() {
                api.sendEvent({
                    name: 'getYear',
                    extra: {
                        year: chooseYear.year
                    }
                });
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
                loginname: UserInfo.loginname
            },
            isSync: true,

            url: '/jiekou/agentht/cost/getYear.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    chooseYear.list = machData(ret.data);
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
                year: item || 0
            }
        });
    }
    getData();
    module.exports = {};
});
