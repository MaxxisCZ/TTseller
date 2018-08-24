define(function(require, exports, module) {

    var Http = require('U/http');
    var activityID = api && api.pageParam.activityid;
    var UserInfo = _g.getLS("UserInfo");
    var activityDetail = new Vue({
        el: '#content',
        template: _g.getTemplate('activity/activityDetail-body-V'),
        data: {
            isNewestActivity: 1,
            fileName: '未选择文件',
            noChoosePic: true,
            activityName: '',
            list: {
                activityName: '唱歌跳舞',
                activityDescribe: '你就随便玩就好了. enjoy yourself!',
                activityImage: '',
                activityPostdate: '1',
                activityUrl: 'http://www.baidu.com',
                activityIsNew: 1,
            },

        },
        methods: {
            onUploadTap: function() {
                _g.openPicActionSheet({
                    allowEdit: true,
                    suc: function(res) {
                        // alert(res.data);
                        api.ajax({
                            url: CONFIG.HOST + '/jiekou/agentht/activity/editImage.aspx',
                            method: 'post',
                            data: {
                                values: {
                                    loginname: UserInfo.loginname,
                                    agentid: UserInfo.agentid,
                                    staffid: UserInfo.staffid,
                                    token: UserInfo.token,
                                    param: 1,
                                },
                                files: {
                                    img_tx: res.data,
                                }
                            }
                        }, function(ret, err) {

                            if (ret.zt == 1) {
                                var dt = ret.tx;
                                activityDetail.noChoosePic = false;
                                activityDetail.list.activityImage = dt
                                _g.toast(ret.msg);
                            } else {
                                _g.toast(ret.msg);
                            }
                        });
                    }
                })
            },
            isUrl: function() {
                var regExp = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/;
                if (!regExp.test(this.list.activityUrl)) {
                    this.list.activityUrl = '';
                    _g.toast("输入URL地址格式错误");
                } else {
                    return;
                }
            },
            onNewestActivity: function() {
                if (this.list.activityIsNew == 1) {
                    this.list.activityIsNew = 0;
                } else {
                    this.list.activityIsNew = 1;
                }
            },
            onSaveTap: function() {
                Http.ajax({
                    data: {
                        activityid: activityID,
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        name: this.list.activityName,
                        describe: this.list.activityDescribe,
                        image: this.list.activityImage,
                        url: this.list.activityUrl,
                        isnew: this.list.activityIsNew,
                        token: UserInfo.token,
                    },
                    url: '/jiekou/agentht/activity/editActivity.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            _g.toast(ret.msg);
                            setTimeout(function() {
                                api.closeWin();
                                api.sendEvent({
                                    name: 'refresh-activity'
                                });
                            }, 250);

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
        }
    });
    var getData = function() {
        Http.ajax({
            data: {
                activityid: activityID,
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            url: '/jiekou/agentht/activity/getActivityDetail.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret.data;
                    getDataValue(dt);
                    console.log(_g.j2s(activityDetail.list));
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
                }
            },
        });
    }

    var getDataValue = function(result) {
        var object = result || {};
        activityDetail.list.activityName = object.name || '';
        activityDetail.list.activityDescribe = object.describe || '';
        activityDetail.list.activityImage = object.image || '';
        activityDetail.list.activityPostdate = object.postdate || '';
        activityDetail.list.activityUrl = object.url || '';
        activityDetail.list.activityIsNew = object.isnew || '';
    }
    getData();
    module.exports = {};

});
