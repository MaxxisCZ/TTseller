define(function(require, exports, module) {

    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var page = 0;
    var next = true;
    var nextQuery = true;
    var pageQuery = 0;
    var activity = new Vue({
        el: '#content',
        template: _g.getTemplate('activity/activity-body-V'),
        data: {
            isNetwork: false,
            name: '',
            list: [{
                activityID: '',
                activityName: '',
                activityAgentID: '',
                activityDescribe: '',
                activityImage: '',
                activityTime: '',
                activityUrl: '',
                activityIsNew: true,
            }, ]

        },
        created: function() {
            this.list = [];
        },
        methods: {
            onDeleteTap: function(index) {
                api.confirm({
                    title: '注意',
                    msg: '确定删除该活动？',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if(ret.buttonIndex == 2) {
                        Http.ajax({
                            data: {
                                activityid: activity.list[index].activityID,
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                token: UserInfo.token,
                            },
                            url: '/jiekou/agentht/activity/deleteActivity.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    next = true;
                                    page = 0;
                                    getData();
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
                    }
                });
            },
            onDetailTap: function(index) {
                _g.openWin({
                    header: {
                        data: {
                            title: '活动详情',
                        },
                    },
                    name: 'activity-activityDetail',
                    url: '../activity/activityDetail.html',
                    pageParam: {
                        activityid: this.list[index].activityID,
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                    },
                });
            },
        }
    });
    var getData = function() {
        page++;
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: page,
                pageSize: 30,
            },
            url: '/jiekou/agentht/activity/getActivity.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret.data;
                    setTimeout(function() {
                        var list = getDataValue(dt);
                        if(page == 1) {
                            activity.list = list;
                        } else {
                            activity.list = activity.list.concat(list);
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
                    if(page == 1) {
                        activity.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    var getDataValue = function(result) {
        var object = result.activities || {};
        var amount = result.activitysl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                activityID: object['ac_' + i + '_id'] || '',
                activityName: object['ac_' + i + '_name'] || '',
                activityAgentID: object['ac_' + i + '_agentid'] || '',
                activityDescribe: object['ac_' + i + '_ms'] || '',
                activityImage: object['ac_' + i + '_tp'] || '',
                activityTime: object['ac_' + i + '_fbrq'] || '',
                activityUrl: object['ac_' + i + '_url'] || '',
                activityIsNew: object['ac_' + i + '_isnew'] || '',
            })
        }
        return list;
    }
    getData();
    api && api.addEventListener({
        name: 'refresh-activity'
    }, function(ret, err) {
        setTimeout(function() {
            // activity.list = [];
            page = 0;
            getData();
        }, 0);
    });
    api.addEventListener({
        name: 'scrolltobottom',
    },function(){
        page = 0;
        getData();
    });
    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            // activity.list = [];
            page = 0;
            getData();
        }, 0);
    });
    module.exports = {};

});
