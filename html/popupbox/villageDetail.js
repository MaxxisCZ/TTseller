define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var villagesID = api.pageParam.villagesID;
    var unCheck = api.pageParam.unCheck;
    var villageDetail = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/villageDetail-V'),
        data: {
            isNetwork: false,
            name: '',
            szm: '',
            unCheck: unCheck,
            reason: '',
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
                        name: this.name,
                        szm: this.szm,
                        villageid: villagesID,
                    },
                    url: '/jiekou/agentht/distribution/editVillage.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            _g.toast(ret.msg);
                            api.sendEvent({
                                name: 'refresh-data',
                                extra:{
                                    index: 2
                                }
                            });
                            api.closeFrame();
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) { _g.toast(ret.msg); }
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
                villageid: villagesID,
            },
            isSync: true,
            url: '/jiekou/agentht/distribution/getVillageDetail.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret.data;
                    villageDetail.name = dt.name;
                    villageDetail.szm = dt.szm;
                    villageDetail.reason = dt.reason;
                    // 判断是否审核
                    villageDetail.unCheck = villageCheck(dt.ischeck);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    var villageCheck = function(param) {
        // 如果未通过审核
        if(param == 2) {
            return(true);
        }
    }
    getData();
    module.exports = {};
});
