define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var costRecord = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/costRecord-body-V'),
        data: {
            isNetwork: false,
            money:'',
            reason:''
        },
        methods: {
            onCancelTap: function(){
                // alert(111);
                api.setFrameAttr({
                    hidden: true
                });
            },
            onRecordTap: function() {
                postCostRecord();
            }
        }
    });

    function postCostRecord() {
        Http.ajax({
            data: {
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                loginname: UserInfo.loginname,
                cb: costRecord.money,
                reason: costRecord.reason
            },
            isSync: true,

            url: '/jiekou/agentht/cost/addCost.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    api.sendEvent({
                        name:'updateCostRecord',
                    });
                    api.setFrameAttr({
                        hidden: true
                    });
                    _g.toast(ret.msg);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    module.exports = {};
});
