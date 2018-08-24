define(function(require, exports, module) {
    var userid = api && api.pageParam.userid;
    var account = api && api.pageParam.mobile;
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var purchaseHistory = new Vue({
        el: '#purchaseHistory',
        template: _g.getTemplate('user/purchaseHistory-main-V'),
        data: {
            detail: {
                account: account,
                list: [{
                    money: 0,
                    payTime: '',
                    payStyle: '',
                    payState: '',
                    payReason: '',
                }]
            }
        },
        created: function() {
            this.detail.list = [];
        },
        methods: { 
        }
    });
    var getPurchaseData = function() {
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
            url: '/jiekou/agentht/user/getCaiwujil.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            purchaseHistory.detail.list = getPurchaseDetail(ret.data);
                        } else {
                            purchaseHistory.detail.list = purchaseHistory.detail.list.concat(getPurchaseDetail(ret.data));
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
                        purchaseHistory.detail.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    var getPurchaseDetail = function(result) {
        var item = result ? result : '';
        var detail = item.cwjls ? item.cwjls : '';
        var newArray = [];
        for(var i = 0; i < item.cwjlsl; i++)
            newArray.push({
                money: detail['cwjl_'+(i+1)+'je'] || '-',
                payTime: detail['cwjl_'+(i+1)+'_sj'] || '-',
                payStyle: detail['cwjl_'+(i+1)+'_fkfs'] || '-',
                payState: stateType(detail['cwjl_'+(i+1)+'_cl']) || '-',
                payReason: detail['cwjl_'+(i+1)+'_fkyy'] || '-',
            });
        return (newArray)
    }
    var stateType = function(result) {
        if(result == 1) {
            return('成功');
        } else {
            return('失败');
        }
    }
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getPurchaseData();
    });
    _g.setPullDownRefresh(function() {
        window.isNoMore = false;
        pageIndex = 1;
        // purchaseHistory.detail.list = [];
        getPurchaseData();
    });
    getPurchaseData();

    module.exports = {};

});