define(function(require, exports, module) {
    var pageSize = 30;
    var pageIndex = 1;
	var Http = require('U/http');
    var timeCensus = new Vue({
        el: '#timeCensus',
        template: _g.getTemplate('orderCensus/timeCensus-main-V'),
        data: {
            detail: [{
                sorting: '01',
                time: '2015-09-13',
                salling: 99,
                order: 23,
                orderPeople: 20,
            }, ],
        },
        created: function(){
            this.detail = [];
        },
        methods: {
        },
    });
    var getCensusData = function() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            isSync: true,
            url: '/jiekou/agentht/order/ordertj2.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            timeCensus.detail = getCensusDetail(ret.data);
                        } else {
                            timeCensus.detail = timeCensus.detail.concat(getCensusDetail(ret.data));
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
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    var getCensusDetail = function(result) {
        var data = result ? result : '';
        var detail = data.sales ? data.sales : '';
        var newArray = [];
        for(var i = 0; i < data.salesl; i++)
            newArray.push({
                sorting: detail['sale_'+(i+1)+'_num'],
                time: detail['sale_'+(i+1)+'_xdtime'],
                salling: detail['sale_'+(i+1)+'_shze'],
                order: detail['sale_'+(i+1)+'_ddsl'],
                orderPeople: detail['sale_'+(i+1)+'_rs'],
            });
        return(newArray);
    }
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getCensusData();
    });
    _g.setPullDownRefresh(function() {
        pageIndex = 1;
        // timeCensus.detail = [];
        getCensusData();
    });
    getCensusData();

    module.exports = {};

});