define(function(require, exports, module) {
    var periodSelector = api.require('periodSelector');
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var addTime = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/addTime-body-V'),
        data: {
            isNetwork: false,
            start: '',
            end: '',
        },
        created: function() {
            periodSelector.open({
                x: 0,
                y: api.frameHeight / 2 - 150,
                w: api.frameWidth,
                h: 200,
                fixedOn: 'popupbox-addTime',
            }, function(ret, err) {
                if (ret) {
                    if(ret.sHour < 10) {
                        ret.sHour = '0' + ret.sHour;
                    }
                    if(ret.sMinute < 10) {
                        ret.sMinute = '0' + ret.sMinute;
                    }
                    if(ret.eHour < 10) {
                        ret.eHour = '0' + ret.eHour;
                    }
                    if(ret.eMinute < 10) {
                        ret.eMinute = '0' + ret.eMinute;
                    }
                    addTime.start = ret.sHour + ':' + ret.sMinute;
                    addTime.end = ret.eHour + ':' + ret.eMinute;
                } else {
                    // alert(JSON.stringify(err));
                }
            });
        },
        methods: {
            onCancelTap: function() {
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            },
            onAddTimeTap: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        start: addTime.start,
                        end: addTime.end,
                    },
                    url: '/jiekou/agentht/distribution/addTime.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            api.setFrameAttr({
                                name: api.frameName,
                                hidden: true,
                            });
                            api.sendEvent({
                                name: 'refresh-data',
                                extra: {
                                    index: 1,
                                }
                            });
                        } else{
                            _g.toast(ret.msg);
                        }
                    },
                    error:function(err){}
                });
            },
        }
    });
    module.exports = {};
});
