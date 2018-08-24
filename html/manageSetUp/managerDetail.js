define(function(require, exports, module) {
    var stid = api && api.pageParam.stid;
	var Http = require('U/http');
    var managerDetail = new Vue({
        el: '#managerDetail',
        template: _g.getTemplate('manageSetUp/managerDetail-main-V'),
        data: {
            isChange: 0,
            oneDetail: {
                name: '',
                sex: '',
                birth: '',
                mobile: '',
                email: '',
                place: '',
                loginnamel: '',
                position: '',
                password: '',
                power: [{
                    powerName: '暂无可删除权限',
                    powerID: '',
                    isSelect: false,
                }, ],
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
                powerID: '123',
                powerName: '更改产品内容',
                powerNum: '01',
                isSelect: false,
            }, {
                powerID: '234',
                powerName: '更改用户消息',
                powerNum: '02',
                isSelect: false,
            }, ]
        },
        created: function() {
            
        },
        methods: {
            picker: function() {
                api.openPicker({
                    type: 'date',
                    // date: '2014-05-01 12:30',
                    title: '选择时间'
                }, function(ret, err) {
                    if (ret) {
                        // managerDetail.oneDetail.time = ret.year+'/'+ret.month+'/'+ret.day;
                        managerDetail.oneDetail.birth = ret.year+'/'+ret.month+'/'+ret.day;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
           onDelPowerTap: function(index) {
                _.each(this.oneDetail.power, function(n,i) {
                    if(i == index) {
                        if(n.isSelect == false) {
                            n.isSelect = true;
                        } else {
                            n.isSelect = false;
                        }
                    }
                });
           },
           onAddPowerTap: function(index) {
                _.each(this.addList, function(n,i) {
                    if(i == index) {
                        if(n.isSelect == false) {
                            n.isSelect = true;
                        } else {
                            n.isSelect = false;
                        }
                    }
                });
           },
           onDelPowerSumbit: function() {
                var array = [];
                _.each(managerDetail.oneDetail.power, function(n,i) {
                    if(n.isSelect == true) {
                        array.push(n.powerID);
                    }
                });
                if(array == '') {
                    _g.toast('请选择删除的权限');
                    return;
                }
                var powerBunch = array.join(',');
                Http.ajax({
                    data: {
                        loginname: _g.getLS('UserInfo').loginname,
                        agentid: _g.getLS('UserInfo').agentid,
                        staffid: _g.getLS('UserInfo').staffid,
                        token: _g.getLS('UserInfo').token,
                        stid: stid,
                        qxjlid: powerBunch,
                    },
                    url: '/jiekou/agentht/settings/deleteAuthority.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            getManageData();
                            getPowerData();
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
           },
           onAddPowerSumbit: function() {
                var array = [];
                _.each(managerDetail.addList, function(n,i) {
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
                        stid: stid,
                        qxid: powerBunch,
                    },
                    url: '/jiekou/agentht/settings/addAuthority.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {        
                            getManageData();
                            getPowerData();
                        } else if(ret.zt == -1) {
                            _g.hideProgress();
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
           },
           onSubmitTap: function() {
                var phoneReg = /^1[0-9]{10}$/;
                if(phoneReg.test(managerDetail.oneDetail.mobile)) {
                    Http.ajax({
                        data: {
                            loginname: _g.getLS('UserInfo').loginname,
                            agentid: _g.getLS('UserInfo').agentid,
                            staffid: _g.getLS('UserInfo').staffid,
                            token: _g.getLS('UserInfo').token,
                            stid: stid,
                            name: managerDetail.oneDetail.name,
                            sex: managerDetail.oneDetail.sex,
                            birth: managerDetail.oneDetail.birth,
                            mobile: managerDetail.oneDetail.mobile,
                            email: managerDetail.oneDetail.email,
                            password: managerDetail.oneDetail.password,
                            addr: managerDetail.oneDetail.place,
                            loginname1: managerDetail.oneDetail.loginnamel,
                            position: managerDetail.oneDetail.position,
                        },
                        url: '/jiekou/agentht/settings/editStaff.aspx',
                        success: function(ret) {
                            managerDetail.isChange = 1;
                            if(ret.zt == 1) {
                                api && api.sendEvent({
                                    name: 'manageSetUp-editManage',
                                    extra: {
                                        isChange: managerDetail.isChange
                                    }
                                });
                                managerDetail.isChange = 0;
                            } else if(ret.zt == -1) {
                                _g.hideProgress();
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
           }
        },
    });
    var getPowerData = function() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                stid: stid,
            },
            lock: false,//解锁，防止数据只获取一次；
            url: '/jiekou/agentht/settings/getAuthority.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    managerDetail.addList = getPowerDetail(data);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    var getManageData = function() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                stid: stid,
            },
            lock: false,//解锁，防止数据只获取一次；
            url: '/jiekou/agentht/settings/getAdmin.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    managerDetail.oneDetail = getManageDetail(data);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    function getManageDetail(result) {
        var data = result ? result : {};
        var powerList = data.qxxx ? data.qxxx : {};
        var newArray = [];
        for(var i = 0; i < data.qxsl; i++)
            newArray.push({
                powerName: powerList['qx_'+(i+1)+'_name'],
                powerID: powerList['qx_'+(i+1)+'_jlid'],
                isSelect: false,
            });
        return {
            name: data.name || '',
            sex: data.sex || '',
            birth: data.birth || '',
            mobile: data.mobile || '',
            email: data.email || '',
            place: data.addr || '',
            loginnamel: data.loginname || '',
            position: data.position || '',
            powerNum: data.qxsl || '',
            power: newArray || [],
        }
    }
    function getPowerDetail(result) {
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
    getManageData();
    getPowerData();

    module.exports = {};

});