define(function(require, exports, module) {
    var userid = api && api.pageParam.userid;
    var account = api && api.pageParam.mobile;
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var sign = new Vue({
        el: '#sign',
        template: _g.getTemplate('user/sign-main-V'),
        data: {
            detail: {
                account: account,
                list: [{
                    signID: '',
                    signTime: '',
                } ],
            }
        },
        created: function() {
            this.detail.list = [];
        },
        methods: { 
        }
    });
    var getSign = function() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                userid: userid,
                token: _g.getLS('UserInfo').token,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            isSync: true,
            url: '/jiekou/agentht/user/getSign.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            sign.detail.list = getSignData(ret.data).list;
                        } else {
                            sign.detail.list = sign.detail.list.concat(getSignData(ret.data).list);
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
                        sign.detail.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        })
    }
    var getSignData = function(result) {
        var detail = result ? result : '';
        var data = detail.signs ? detail.signs : '';
        var newArray = [];
        for(var i = 0; i < detail.signsl; i++)
            newArray.push({
                signID: data['sign_'+(i+1)+'_id'],
                signTime: data['sign_'+(i+1)+'_time'],
            });
        return{
            account: detail.account || '',
            list: newArray || [],
        }
    }
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getSign();
    });
    _g.setPullDownRefresh(function() {
        window.isNoMore = false;
        pageIndex = 1;
        // sign.detail.list = [];
        getSign();
    });
    getSign();

    module.exports = {};

});