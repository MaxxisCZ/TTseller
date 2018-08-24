define(function(require, exports, module) {
    var pageSize = 30;
    var pageIndex = 1;
	var Http = require('U/http');
    var orderCensus = new Vue({
        el: '#orderCensus',
        template: _g.getTemplate('orderCensus/orderCensus-main-V'),
        data: {
            detail: [{
                sorting: '01',
                quarters: '羊城花园',
                salling: 99,
                order: 23,
                orderPeople: 20,
            }, {
                sorting: '02',
                quarters: '天朗明居',
                salling: 91,
                order: 50,
                orderPeople: 43,
            },{
                sorting: '03',
                quarters: '珠江新城',
                salling: 69,
                order: 89,
                orderPeople: 18,
            },],
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
            url: '/jiekou/agentht/order/ordertj3.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            orderCensus.detail = getCensusDetail(ret.data);
                        } else {
                            orderCensus.detail = orderCensus.detail.concat(getCensusDetail(ret.data));
                        }
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
                quarters: detail['sale_'+(i+1)+'_village'],
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
        window.isNoMore = false;
        pageIndex = 1;
        // orderCensus.detail = [];
        getCensusData();
    });
    getCensusData();

    module.exports = {};

});