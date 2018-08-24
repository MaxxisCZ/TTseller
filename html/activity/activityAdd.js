define(function(require, exports, module) {

    var Http = require('U/http');
    var activityID = api && api.pageParam.activityid;
    var UserInfo = _g.getLS("UserInfo");
    var activityAdd = new Vue({
        el: '#content',
        template: _g.getTemplate('activity/activityAdd-body-V'),
        data: {
            isNewestActivity: 1,
            noChoosePic: true,
            activityName: '',
            list: {
                activityName: '',
                activityDescribe: '',
                activityImage: '',
                activityPostdate: '',
                activityUrl: '',
                activityIsNew: 0,
            },

        },
        methods: {
            onUploadTap: function() {
                _g.openPicActionSheet({
                    allowEdit: true,
                    suc: function(res) {
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
                                activityAdd.noChoosePic = false;
                                activityAdd.list.activityImage = dt
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
                _g.showProgress();
                if (this.list.activityImage) {
                    Http.ajax({
                        data: {
                            loginname: UserInfo.loginname,
                            agentid: UserInfo.agentid,
                            staffid: UserInfo.staffid,
                            name: activityAdd.list.activityName,
                            describe: activityAdd.list.activityDescribe,
                            image: activityAdd.list.activityImage,
                            url: activityAdd.list.activityUrl,
                            isnew: activityAdd.list.activityIsNew,
                            token: UserInfo.token,

                        },
                        url: '/jiekou/agentht/activity/addActivity.aspx',
                        success: function(ret) {
                            if (ret.zt == 1) {
                                setTimeout(function() {
                                    api.sendEvent({
                                        name: 'refresh-activity'
                                    });
                                    setTimeout(function() {
                                        api.closeWin();
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
                                _g.toast(ret.msg);
                            }
                            _g.hideProgress();
                        },
                        error: function(err) {
                            _g.hideProgress();
                            _g.toast(ret.msg);
                        }
                    });
                } else {
                    _g.hideProgress();
                    _g.toast("请上传图片!");
                    return;
                }


            },
        }
    });

    module.exports = {};

});
