define(function(require, exports, module) {
    var Http = require('U/http');
    var fatherList = _g.s2j(api.pageParam.fatherList);
    var fatherName = api.pageParam.fatherName;
    var fatherID = api.pageParam.fatherID;
    var UserInfo = _g.getLS("UserInfo");
    var addChildProduct = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/addChildProduct-body-V'),
        data: {
            isNetwork: false,
            childName: '',
            fatherName: '',
            fatherID: fatherID,
            fatherList: fatherList,
            fatherName: fatherName,
        },
        methods: {
            onCancelTap: function() {
                api&&api.closeFrame({

                });
                // api.setFrameAttr({
                //     name: api.frameName,
                //     hidden: true,
                // });
            },
            selectChange: function() {
               
                _.each(this.fatherList, function(n, i) {
                    
                    if (addChildProduct.fatherID == n.fatherID) {
                        addChildProduct.fatherName = n.fatherName;
 
                    }
                });

            },
            onChildSubmit: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        catename: this.childName,
                        fcpid: this.fatherID,
                        token: UserInfo.token,
                    },
                    url: '/jiekou/agentht/procate/addProcate.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            
                             api.sendEvent({
                                name: 'product-dataReresh',
                                extra: {
                                data: 'child'
                                }
                            });
                            api.setFrameAttr({
                                name: api.frameName,
                                hidden: true,
                            });
                            addChildProduct.childName = '';
                            addChildProduct.fatherName = '';
                        } else {
                            _g.toast(ret.msg);
                            return;
                        }
                    },
                    error: function(err) {}
                });
            },
        }
    });
    module.exports = {};
});
