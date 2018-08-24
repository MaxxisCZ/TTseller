define(function(require, exports, module) {
    var userid = api && api.pageParam.userid;
    var account = api && api.pageParam.mobile;
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var visitHistory = new Vue({
        el: '#visitHistory',
        template: _g.getTemplate('user/visitHistory-main-V'),
        data: {
            detail: {
                account: account,
                list: [{
                    signID: '',
                    content: '',
                    time: '',
                }, ]
            }
        },
        created: function() {
            this.detail.list = [];
        },
        methods: { 
        }
    });
    var getVisitData = function() {
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
            url: '/jiekou/agentht/user/getVisit.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            visitHistory.detail.list = getVisitDetail(ret.data).list;
                        } else {
                            visitHistory.detail.list = visitHistory.detail.list.concat(getVisitDetail(ret.data).list);
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
                        visitHistory.detail.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},

        });
    }

    var getVisitDetail = function(result) {
        var item = result ? result : '';
        var detail = item.visits ? item.visits : '';
        var newArray = [];
        for(var i = 0; i < item.visitsl; i++)
            newArray.push({
                signID: detail['visit_'+(i+1)+'_id'],
                content: detail['visit_'+(i+1)+'_nr'],
                time: detail['visit_'+(i+1)+'_sj'],
            });
        return{
            account: item.account || '',
            list: newArray || [],
        }
    }
    api && api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0
        }
    }, function(ret, err) {
        pageIndex ++;
        getVisitData();
    });
    _g.setPullDownRefresh(function() {
        window.isNoMore = false;
        pageIndex = 1;
        // visitHistory.detail.list = [];
        getVisitData();
    });
    getVisitData();

    module.exports = {};

});