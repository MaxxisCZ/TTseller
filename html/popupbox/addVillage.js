define(function(require, exports, module) {
    var Http = require('U/http');
    // var area = _g.getLS("area");
    var UserInfo = _g.getLS("UserInfo");
    var addVillage = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/addVillage-body-V'),
        data: {
            isNetwork: false,
            name: '',
            szm: '',
        },
        methods: {
            onCancelTap: function() {
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            },
            onAddVillageTap: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        name: this.name,
                        szm: this.szm,
                    },
                    url: '/jiekou/agentht/distribution/addVillage.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            _g.toast(ret.msg);
                            api.setFrameAttr({
                                name: api.frameName,
                                hidden: true,
                            });
                            api.sendEvent({
                                name: 'refresh-data',
                                extra: {
                                    index: 2,
                                }
                            });
                        }
                    }
                });
            },
            isLetter: function(){
                var regs = /^[a-zA-Z]{1,999}$/;
                if(regs.test(this.szm)){}
                    else {
                         this.szm = '';
                    _g.toast('请输入字母');
                    }
            }

        }
    });
    module.exports = {};
});
