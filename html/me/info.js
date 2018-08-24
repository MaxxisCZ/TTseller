define(function(require, exports, module) {

    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var infoList = new Vue({
        el: '#infoList',
        template: _g.getTemplate('me/info-list-V'),
        data: {
            detail: {
                name: '',
                sex: 1,
                birth: '',
                phone: '',
                email: '',
                addr: '',
                loginName: '',
                agentName: '',
                position: '',
                staffid: '',
                agentid: ''
            }
        },
        methods: {
            picker: function() {
                api.openPicker({
                    type: 'date',
                    title: '选择时间'
                }, function(ret, err) {
                    if (ret) {
                        infoList.detail.birth = ret.year + '/' + ret.month + '/' + ret.day;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            onInfoPostTap: function() {
                postInfoList();
            }
        }
    });

    function checkUser() {
        if (!_g.getLS('UserInfo')) {
            _g.openWin({
                header: {
                    data: {
                        title: '登录'
                    }
                },
                name: 'account-login',
                url: '../account/login.html',
                pageparam: {

                }
            });
        } else {
            var UserInfo = _g.getLS('UserInfo');
                infoList.detail.name = UserInfo.name;
                infoList.detail.agentid = UserInfo.agentid;
                infoList.detail.staffid = UserInfo.staffid;
                infoList.detail.token = UserInfo.token;
                infoList.detail.sex = UserInfo.sex;
                infoList.detail.birth = UserInfo.birth;
                infoList.detail.phone = UserInfo.mobile;
                infoList.detail.addr = UserInfo.addr;
                infoList.detail.email = UserInfo.email;
                infoList.detail.loginName = UserInfo.loginname;
                infoList.detail.agentName = UserInfo.agentname;
                infoList.detail.position = UserInfo.position;
        }
    }

    function postInfoList() {
        Http.ajax({
            data: {
                name: infoList.detail.name,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                sex: infoList.detail.sex,
                birth: infoList.detail.birth,
                mobile: infoList.detail.phone,
                addr: infoList.detail.addr,
                email: infoList.detail.email,
                loginname: UserInfo.loginname,
            },
            isSync: true,

            url: '/jiekou/agentht/staff/editStaff.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    var updateUserInfo = changeUserInfo();

                    _g.setLS('UserInfo', updateUserInfo);

                    api.sendEvent({
                        name: 'me-info-update',
                        extra: {
                            name: infoList.detail.name,
                            phone: infoList.detail.phone
                        }
                    });
                } else if(ret.zt == -1) {
                    _g.rmLS('UserInfo');
                    api && api.openWin({
                        name: 'account-login-win',
                        url: '../account/login.html',
                        pageParam: {
                            from: 'root'
                        },
                        bounces: false,
                        slidBackEnabled: false,
                        animation: {
                            type: 'none'
                        }
                    });
                    setTimeout(function() {
                        _g.closeWins(['main-index-win'])
                    }, 1000)
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    function changeUserInfo() {
        return {
            "name": infoList.detail.name,
            "sex": infoList.detail.sex,
            "place": "",
            "birth": infoList.detail.birth,
            "mobile": infoList.detail.phone,
            "loginname": infoList.detail.loginName,
            "email": infoList.detail.email,
            "addr": infoList.detail.addr,
            "agentid": UserInfo.agentid,
            "staffid": UserInfo.staffid,
            "token": UserInfo.token,
        }
    }

    checkUser();
    module.exports = {};
});
