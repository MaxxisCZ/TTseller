define(function(require, exports, module) {
    var Http = require('U/http');
    var shopperID = api.pageParam.shopperID;
    // alert(shopperID);
    var UserInfo = _g.getLS("UserInfo");
    var shopperDetail = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/shopperDetail-V'),
        data: {
            isNetwork: false,
            name: '',
            mobile: '',
            sex: '',
            birth: '',
            time: '',
        },
        methods: {
            onCancelTap: function() {
                api.closeFrame();
            },
            picker: function() {
                api.openPicker({
                    type: 'date',
                    // date: '2014-05-01 12:30',
                    title: '选择时间'
                }, function(ret, err) {
                    if (ret) {
                        shopperDetail.time = ret.year+'-'+ret.month+'-'+ret.day;
                        shopperDetail.birth = ret.year+'-'+ret.month+'-'+ret.day;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            onSubmitTap: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        name: this.name,
                        mobile: this.mobile,
                        sex: sendSex(this.sex),
                        birth: this.birth,
                        shopperid: shopperID,
                    },
                    url: '/jiekou/agentht/distribution/editShopper.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            _g.toast(ret.msg);
                            api.sendEvent({
                                name: 'refresh-data',
                                extra: {
                                    index: 0
                                },
                            });
                            api.closeFrame();
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err){}
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
                shopperid: shopperID,
            },
            isSync: true,
            url: '/jiekou/agentht/distribution/getShopperDetail.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret.data;
                    shopperDetail.name = dt.name;
                    shopperDetail.mobile = dt.mobile;
                    shopperDetail.sex = getSex(dt.sex);
                    shopperDetail.birth = dt.birth;
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    var getSex = function(result) {
        switch (result) {
            case '1':
                return '男';
                break;
            case '2':
                return '女';
                break;
            default:
                break;
        }
    }
    var sendSex = function(result) {
        switch (result) {
            case '男':
                return '1';
                break;
            case '女':
                return '2';
                break;
            default:
                break;
        }
    }
    getData();
    module.exports = {};
});
