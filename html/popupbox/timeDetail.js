define(function(require, exports, module) {
    var Http = require('U/http');
    var timeID = api.pageParam.timeID;
    var UserInfo = _g.getLS("UserInfo");
    var timeDetail = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/timeDetail-V'),
        data: {
            isNetwork: false,
            start: '',
            end: '',
        },
        methods: {
            onCancelTap: function() {
                api.closeFrame();
            },
            onSubmitTap: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        start: this.start,
                        end: this.end,
                        timeid: timeID,
                    },
                    url: '/jiekou/agentht/distribution/editTime.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            _g.toast(ret.msg);
                            api.sendEvent({
                                name: 'refresh-data',
                                extra:{
                                    index: 1
                                },
                            });
                            api.closeFrame();
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            }

        }
    });
    var getData = function() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                timeid: timeID,
            },
            isSync: true,
            url: '/jiekou/agentht/distribution/getTimeDetail.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret.data;
                    timeDetail.start = dt.start;
                    timeDetail.end = dt.end;
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    getData();
    module.exports = {};
});
