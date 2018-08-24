define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var addFatherProduct = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/addFatherProduct-body-V'),
        data: {
            isNetwork: false,
            fatherName: '',
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
                // alert(this.fatherName);
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        fcpnc: this.fatherName,
                    },
                    url: '/jiekou/agentht/fathercate/addFathercate.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            _g.toast(ret.msg);
                            api.sendEvent({
                                name: 'product-dataReresh',
                                extra: {
                                    data: 'father'
                                }
                            });
                            api.setFrameAttr({
                                name: api.frameName,
                                hidden: true,
                            });
                            addFatherProduct.fatherName = '';
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            }
        }
    });
    module.exports = {};
});
