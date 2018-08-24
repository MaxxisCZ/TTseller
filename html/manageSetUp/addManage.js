define(function(require, exports, module) {
	var Http = require('U/http');
    var addManage = new Vue({
        el: '#addManage',
        template: _g.getTemplate('manageSetUp/addManage-main-V'),
        data: {
            stid: '',
            isChange: 0,
            oneDetail: {
                name: '',
                sex: '',
                birth: '',
                mobile: '',
                email: '',
                place: '',
                loginname: '',
                position: '',
                password: '',
            },
            options: [{
                text: '男',
                value: 1,
            }, {
                text: '女',
                value: 2,
            }, {
                text: '--',
                value: 0,
            }],
            addList: [{
                powerID: '',
                powerName: '添加菜品',
                powerNum: '',
                isSelect: false,
            }, ],
        },
        created: function() {
            
        },
        methods: {
            // onSelectedTap: function(index) {
            //     _.each(this.addList, function(n,i) {
            //         if(i == index) {
            //             if(n.isSelect == false) {
            //                 n.isSelect = true;
            //             } else {
            //                 n.isSelect = false;
            //             }
            //         }
            //     });
            // },
            onSubmitTap: function() {
                var phoneReg = /^1[0-9]{10}$/;
                if(phoneReg.test(addManage.oneDetail.mobile)) {
                    Http.ajax({
                        data: {
                            loginname: _g.getLS('UserInfo').loginname,
                            agentid: _g.getLS('UserInfo').agentid,
                            staffid: _g.getLS('UserInfo').staffid,
                            token: _g.getLS('UserInfo').token,
                            name: addManage.oneDetail.name,
                            sex: addManage.oneDetail.sex,
                            birth: addManage.oneDetail.birth,
                            mobile: addManage.oneDetail.mobile,
                            email: addManage.oneDetail.email,
                            password: addManage.oneDetail.password,
                            place: addManage.oneDetail.place,
                            loginname1: addManage.oneDetail.loginname,
                            position: addManage.oneDetail.position,
                        },
                        url: '/jiekou/agentht/settings/addStaff.aspx',
                        success: function(ret) {
                            addManage.isChange = 1;
                            if(ret.zt == 1) {
                                api && api.sendEvent({
                                    name: 'manageSetUp-addManage',
                                    extra: {
                                        isChange: addManage.isChange
                                    }
                                });
                                addManage.isChange = 0;
                                addManage.stid = ret.data.stid;
                                // 添加成功后跳转至详情页
                                _g.openWin({
                                    header:{
                                        data:{
                                            title: '管理者详情'
                                        }
                                    },
                                    name: 'manageSetUp-managerDetail',
                                    url: '../manageSetUp/managerDetail.html',
                                    bounces: false,
                                    slidBackEnabled: false,
                                    pageParam: {
                                        stid: ret.data.stid,
                                    }
                                });
                                api && api.closeWin();
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
                        error: function(err) {}
                    });
                } else {
                    _g.toast('请输入正确的手机号码');
                    return;
                }
            },
            onPowerTap: function() {
                var array = [];
                _.each(addManage.addList, function(n,i) {
                    if(n.isSelect == true) {
                        array.push(n.powerID);
                    }
                });
                if(array == '') {
                    _g.toast('请选择添加的权限');
                    return;
                }
                var powerBunch = array.join(',');
                Http.ajax({
                    data: {
                        loginname: _g.getLS('UserInfo').loginname,
                        agentid: _g.getLS('UserInfo').agentid,
                        staffid: _g.getLS('UserInfo').staffid,
                        token: _g.getLS('UserInfo').token,
                        stid: addManage.stid,
                        qxid: powerBunch,
                    },
                    url: '/jiekou/agentht/settings/addAuthority.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            _g.toast(ret.msg);
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
                    error: function(err) {}
                });
           }
        },
    });
    // 获取权限
    var getPowerData = function() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
            },
            url: '/jiekou/agentht/settings/getAuthority.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    addManage.addList = getPowerDetail(data);
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
            error: function(err) {}
        });
    }
    var getPowerDetail = function(result) {
        var data = result ? result : '';
        var powerList = data.qxxx ? data.qxxx : '';
        var newArray = [];
        for(var i = 0; i < data.qxsl; i++)
            newArray.push({
                powerID: powerList['qx_'+(i+1)+'_id'],
                powerName: powerList['qx_'+(i+1)+'_name'],
                powerNum: powerList['qx_'+(i+1)+'_num'],
                isSelect: false,
            });
        return(newArray);
    }
    // getPowerData();
    module.exports = {};

});