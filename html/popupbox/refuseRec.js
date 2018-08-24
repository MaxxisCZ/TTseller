define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var refuseRec = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/refuseRec-main-V'),
        data: {
            reason: '',
        },
        methods: {
            onCancelTap: function() {
                // alert(111);
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            },
            onSubmitTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '开启支付密码',
                        },
                    },
                    name: 'financeManage-payPassword',
                    url: '../financeManage/payPassword.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        style: 2
                    }
                });
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
                // Http.ajax({
                //     data: {
                //         loginname: UserInfo.loginname,
                //         agentid: UserInfo.agentid,
                //         staffid: UserInfo.staffid,
                //         token: UserInfo.token,
                //         fcpnc: this.reason,
                //     },
                //     url: '/jiekou/agentht/fathercate/addFathercate.aspx',
                //     success: function(ret) {
                //         if (ret.zt == 1) {
                //             _g.toast(ret.msg);
                //             api.sendEvent({
                //                 name: 'product-dataReresh',
                //                 extra: {
                //                     data: 'father'
                //                 }
                //             });
                //             api.setFrameAttr({
                //                 name: api.frameName,
                //                 hidden: true,
                //             });
                //         } else {
                //             _g.toast(ret.msg);
                //         }
                //     },
                //     error: function(err) {}
                // });
            }
        }
    });
    module.exports = {};
});