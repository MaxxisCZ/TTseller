define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var closeOrNot = new Vue({
        el: '#closeOrNot',
        template: _g.getTemplate('popupbox/closeOrNot-V'),
        data: {
            isNetwork: false
        },
        methods: {
            onCancelTap: function() {
                api.setFrameAttr({
                    hidden: true
                });
            },
            onCloseTap: function(){
                Http.ajax({
                    data: {
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        loginname: UserInfo.loginName,
                        isopen: 0
                    },
                    isSync: true,

                    url: '/jiekou/agentht/settings/openShop.aspx',

                    success: function(ret) {
                        if (ret.zt == 1) {
                            _g.toast('店铺已关闭');
                        } else {
                            _g.toast(ret.msg);
                        }
                        api.setFrameAttr({
                            hidden: true
                        });
                    },
                    error: function(err) {},
                });
            },
            sureTap: function() {
                Http.ajax({
                    data: {
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        loginname: UserInfo.loginName,
                        isopen: 1
                    },
                    isSync: true,

                    url: '/jiekou/agentht/settings/openShop.aspx',

                    success: function(ret) {
                        if (ret.zt == 1) {
                            _g.toast('店铺已开启');
                        } else {
                            _g.toast(ret.msg);
                        }
                        api.setFrameAttr({
                            hidden: true
                        });
                    },
                    error: function(err) {},
                });
            },
        }
    });
    module.exports = {};
});
