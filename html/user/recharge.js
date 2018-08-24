define(function(require, exports, module) {
    var userid = api && api.pageParam.userid;
    var account = api && api.pageParam.mobile;
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var recharge = new Vue({
        el: '#recharge',
        template: _g.getTemplate('user/recharge-main-V'),
        data: {
            detail: {
                account: account,
                list: [{
                    oddNumbers: '',
                    money: '',
                    time: '',
                    type: '',
                    state: '',
                } ]
            }
        },
        created: function() {
            this.detail.list = [];
        },
        methods: {
        }
    });
    var getRechargeData = function() {
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
            url: '/jiekou/agentht/user/getChongzhi.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            recharge.detail.list = getRechargeDetail(ret.data).list;
                        } else {
                            recharge.detail.list = recharge.detail.list.concat(getRechargeDetail(ret.data).list);
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
                        recharge.detail.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    var getRechargeDetail = function(result) {
        var item = result ? result : '';
        var detail = item.czxx ? result.czxx : '';
        var newArray = [];
        for(var i = 0; i < item.czsl; i++)
            newArray.push({
                oddNumbers: detail['cz_'+(i+1)+'_dh'] || '--',
                money: detail['cz_'+(i+1)+'_je'] || '--',
                time: detail['cz_'+(i+1)+'_fksj'] || '--',
                type: rechargeType(detail['cz_'+(i+1)+'_fkfs']) || '--',
                state: stateType(detail['cz_'+(i+1)+'_zt']) || '--',
            });
        return{
            account: item.account || '',
            list: newArray || [],
        }
    }
    var stateType = function(result) {
        if(result == 1) {
            return('成功');
        } else {
            return('失败');
        }
    }
    var rechargeType = function(result) {
        if(result == 1) {
            return('支付宝支付');
        } else if(result == 2) {
            return('微信支付');
        } else if(result == 3) {
            return('管理员充值');
        } else if(result == 4) {
            return('管理员退款');
        } else if(result == 5) {
            return('系统充值_好友首单满送');
        } else if(result == 6) {
            return('系统退款');
        } else {
            return('--');
        }
    }
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getRechargeData();
    });
    _g.setPullDownRefresh(function() {
        window.isNoMore = false;
        pageIndex = 1;
        // recharge.detail.list = [];
        getRechargeData();
    });
    getRechargeData();

    module.exports = {};

});