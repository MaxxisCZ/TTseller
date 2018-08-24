define(function(require, exports, module) {
    var Http = require('U/http');
    // var area = _g.getLS("area");
    var UserInfo = _g.getLS("UserInfo");
    var setSendingTime = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/setSendingTime-main-V'),
        data: {
            hour: '',
        },
        methods: {
            onCancelTap: function() {
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            },
            onSetTimeTap: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        hour: this.hour,
                    },
                    url: '/jiekou/agentht/settings/setTime.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            api.setFrameAttr({
                                name: api.frameName,
                                hidden: true,
                            });
                            _g.toast(ret.msg);
                        } else {
                            _g.toast(ret.msg);
                        }
                    }
                });
            },
        }
    });
    function getTimeData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            url: '/jiekou/agentht/settings/getTime.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setSendingTime.hour = ret.data.hour;
                }
            }
        });
    }
    getTimeData();
    module.exports = {};
});
