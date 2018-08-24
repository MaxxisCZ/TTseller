define(function(require, exports, module) {
    var userid = api && api.pageParam.userid;
    var account = api && api.pageParam.mobile;
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var shareFriend = new Vue({
        el: '#shareFriend',
        template: _g.getTemplate('user/shareFriend-main-V'),
        data: {
            detail: {
                account: account,
                list: [{
                    phone: '',
                    consumption: '',
                    times: '',
                    time: '',
                } ]
            }
        },
        created: function() {
            this.detail.list = [];
        },
        methods: { 
        }
    });
    var getShareFriendData = function() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid, 
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                userid: userid,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            isSync: true,
            url: '/jiekou/agentht/user/getReferee.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    if(pageIndex == 1) {
                        shareFriend.detail = getShareFriendDetail(ret.data);
                    } else {
                        shareFriend.detail.list = shareFriend.detail.list.concat(getShareFriendDetail(ret.data).list);
                    }
                    pageIndex ++;
                    setTimeout(function() {
                        _g.hideProgress();
                    }, 500);
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
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        })
    }
    var getShareFriendDetail = function(result) {
        var data = result ? result : '';
        var refers = data.refers ? data.refers : '';
        var newArray = [];
        for(var i= 0; i < data.refersl; i++)
            newArray.push({
                phone: refers['refer_'+(i+1)+'_zh'],
                consumption: refers['refer_'+(i+1)+'_ljxfe'],
                times: refers['refer_'+(i+1)+'_gbcs'],
                time: refers['refer_'+(i+1)+'_zjxfsj'],
            });
        return{
            account: data.account || '',
            list: newArray || [],
        }
    }
    api && api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0
        }
    }, function(ret, err) {
        getShareFriendData();
    });
    _g.setPullDownRefresh(function() {
        pageIndex = 1;
        shareFriend.detail.list = [];
        getShareFriendData();
    });
    getShareFriendData();

    module.exports = {};

});