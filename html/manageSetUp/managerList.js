define(function(require, exports, module) {
    var pageIndex = 1;
    var pageSize = 30;
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var UserInfo = _g.getLS("UserInfo");
	var Http = require('U/http');
    var managerList = new Vue({
        el: '#managerList',
        template: _g.getTemplate('manageSetUp/managerList-main-V'),
        data: {
            detail: [{
                staffID: '',
                number: '',
                loginname: '',
                name: '',
                staff_agentid: '',
            }, ]
        },
        created: function() {
            this.detail = [];
        },
        methods: {
            onManagerDetail: function(index) {
                _.each(this.detail, function(n, i) {
                    if(i == index) {
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
                                stid: n.staffID,
                            }
                        });
                    }
                });
            },
            onDeleteTap: function(index) {
                api.confirm({
                    title: '注意',
                    msg: '确定删除该管理员',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if(ret.buttonIndex == 2) {
                        _.each(managerList.detail, function(n, i) {
                            if(i == index) {
                                Http.ajax({
                                    data: {
                                        loginname: UserInfo.loginname,
                                        agentid: UserInfo.agentid,
                                        staffid: UserInfo.staffid,
                                        token: UserInfo.token,
                                        stid: n.staffID,
                                    },
                                    url: '/jiekou/agentht/settings/deleteStaff.aspx',
                                    success: function(ret) {
                                        if(ret.zt == 1) {
                                            pageIndex = 1;
                                            // managerList.detail = [];
                                            getManagerData();
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
                                    error: function(err) {},
                                });
                            }
                        });
                    }
                });
            }
        },
    });
    var getManagerData = function() {
        _g.showProgress();
        Http.ajax({
            data:{
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            url: '/jiekou/agentht/settings/getStaff.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            managerList.detail = getManagerDetail(ret.data);
                        } else {
                            managerList.detail = managerList.detail.concat(getManagerDetail(ret.data));
                        }
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 500);
                    }, 0);
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
                    if(pageIndex == 1) {
                        managerList.detail = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    var getManagerDetail = function(result) {
        var data = result ? result.staffs : [];
        return _.map(data, function(detail) {
            return{
                staffID: detail.staff_id || '',
                number: detail.staff_num || '',
                loginname: detail.staff_dlm || '',
                name: detail.staff_xm || '',
                staff_agentid: detail.staff_agentid || '',
            }
        });
    }
    getManagerData();

    api.addEventListener({
        name: 'managerList-menu',
    }, function(ret, err) {
        if (!window.isMenuOpen) {
            _g.openMenuFrame({
                list: ['添加管理员', '店铺开启或关闭']
            });
        } else {
            api.sendEvent({
                name: 'global-menu-onBtnTap',
            });
        }

    });
    api.addEventListener({
        name: api.winName + '-menu-onItemTap',
    },function(ret,err){
        if(ret.value.index == 0) {
            _g.openWin({
                header: {
                    data: {
                        title: '添加管理员'
                    },
                },
                name: 'manageSetUp-addManage',
                url: '../manageSetUp/addManage.html',
                bounces: false,
                slidBackEnabled: false,
            });
        }else if (ret.value.index == 1) {
            api && api.openFrame({
                name: 'popupbox-closeOrNot',
                url: '../popupbox/closeOrNot.html',
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    h: windowHeight,
                },
            });
        }
    });
    api.addEventListener({
        name: 'manageSetUp-addManage',
    }, function(ret,err) {
        if(ret.value.isChange == 1) {
            pageIndex = 1;
            // managerList.detail = [];
            getManagerData();
        }
    });
    api.addEventListener({
        name: 'manageSetUp-editManage',
    }, function(ret,err) {
        if(ret.value.isChange == 1) {
            pageIndex = 1;
            // managerList.detail = [];
            getManagerData();
        }
    });
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getManagerData();
    });
    _g.setPullDownRefresh(function() {
        window.isNoMore = false;
        pageIndex = 1;
        // managerList.detail = [];
        getManagerData();
    });

    module.exports = {};

});
