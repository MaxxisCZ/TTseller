define(function(require, exports, module) {
    var userid = api && api.pageParam.userid;
    var account = api && api.pageParam.mobile;
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var integral = new Vue({
        el: '#integral',
        template: _g.getTemplate('user/integral-main-V'),
        data: {
            detail: {
                account: account,
                list: [{
                    source: '',
                    vaule: 0,
                    useTime: '',
                } ]
            }
        },
        created: function() {
            this.detail.list = [];
        },
        methods: { 
        }
    });
    var getIntegralData = function() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                userid: userid,
                pageIndex: pageIndex,
                pageSize: pageSize,
                token: _g.getLS('UserInfo').token,
            },
            url: '/jiekou/agentht/user/getPoint.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            integral.detail.list = getIntegralDetail(ret.data).list;
                        } else {
                            integral.detail.list = integral.detail.list.concat(getIntegralDetail(ret.data).list);
                        }
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 500);
                    }, 0);
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
                    if(pageIndex == 1) {
                        integral.detail.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    var getIntegralDetail = function(result) {
        var item = result ? result : '';
        var detail = item.points ? item.points : '';
        var newArray = [];
        for(var i = 0; i < item.pointsl; i++)
            newArray.push({
                source: detail['point_'+(i+1)+'_ly'],
                vaule: detail['point_'+(i+1)+'_jf'],
                useTime: detail['point_'+(i+1)+'_jxsj'],
            });
        return{
            account: item.account || '',
            list: newArray || [],
        }
    }
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getIntegralData();
    });
    _g.setPullDownRefresh(function() {
        window.isNoMore = false;
        pageIndex = 1;
        // integral.detail.list = [];
        getIntegralData();
    });
    getIntegralData();

    module.exports = {};

});