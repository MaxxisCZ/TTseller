define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var addShopper = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/addShopper-body-V'),
        data: {
            isNetwork: false,
            name: '',
            mobile: '',
            sex: '男',
            birth: '',
            time: '',
        },
        methods: {
            onCancelTap: function() {
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            },
            picker: function() {
                api.openPicker({
                    type: 'date',
                    // date: '2014-05-01 12:30',
                    title: '选择时间'
                }, function(ret, err) {
                    if (ret) {
                        addShopper.time = ret.year+'-'+ret.month+'-'+ret.day;
                        addShopper.birth = ret.year+'-'+ret.month+'-'+ret.day;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            onAddShopperTap: function() {
                var phoneReg = /^1[0-9]{10}$/;
                if(!phoneReg.test(this.mobile)){
                    _g.toast('请输入11位数的手机号码');
                    return;
                }           
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        name: addShopper.name,
                        mobile: addShopper.mobile,
                        sex: getSex(addShopper.sex),
                        birth: addShopper.birth,
                    },
                    url: '/jiekou/agentht/distribution/addShopper.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            api.setFrameAttr({
                                name: api.frameName,
                                hidden: true,
                            });
                            addShopper.name = '';
                            addShopper.mobile = '';
                            addShopper.sex = '';
                            addShopper.birth = '';
                            api.sendEvent({
                                name: 'refresh-data',
                                extra:{
                                    index: 0,
                                }
                            });
                        } else {
                            _g.toast(ret.msg);
                        }
                    }
                });
            },
        }
    });
    var getSex = function(result) {
        switch (result) {
            case '男':
                return 1;
                break;
            case '女':
                return 2;
                break;
            default:
                break;
        }
    }
    module.exports = {};
});
