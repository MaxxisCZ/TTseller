define(function(require, exports, module) {
    var userid = api && api.pageParam.userid;
    var pageIndex = 1;
    var pageSize = 30;
    var Http = require('U/http');
    var userOrder = new Vue({
        el: '#userOrder',
        template: _g.getTemplate('user/userOrder-main-V'),
        data: {
            detail: [{
                orderID: '123',
                state: '待付款',
                time: '2016/10/10',
                person: '小明',
            }]
        },
        created: function() {
            this.detail = [];
        },
        methods: {
            onOrderDetailTap: function(index) {
                _.each(this.detail, function(n, i) {
                    if (i == index) {
                        _g.openWin({
                            header: {
                                data: {
                                    title: '订单详情'
                                },
                                template: 'common/header-menu-V'

                            },
                            name: 'orderManage-orderDetail',
                            url: '../orderManage/orderDetail.html',
                            bounces: false,
                            slidBackEnabled: false,
                            pageParam: {
                                orderid: n.orderID,
                            }
                        });
                    }
                });
            }
        }
    });

    function getData() {
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
            url: '/jiekou/agentht/user/getOrder.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        if (pageIndex == 1) {
                            userOrder.detail = getDetail(ret.data);
                        } else {
                            userOrder.detail = userOrder.detail.concat(getDetail(ret.data));    
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
                    if (pageIndex == 1) {
                        userOrder.detail = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    function getDetail(result) {
        var data = result ? result : '';
        var order = data.orders;
        var newArry = [];
        for (var i = 0; i < data.ordersl; i++)
            newArry.push({
                orderID: order['order_' + (i + 1) + '_id'] || '--',
                state: getState(order['order_' + (i + 1) + '_status']) || '--',
                time: order['order_' + (i + 1) + '_time'] || '--',
                person: order['order_' + (i + 1) + '_shr'] || '--',
            });
        return (newArry);
    }
    getState = function(result) {
        switch (result) {
            case '0':
                state = '待付款';
                return (state);
                break;
            case '1':
                state = '待接单';
                return (state);
                break;
            case '2':
                state = '待发货';
                return (state);
                break;
            case '3':
                state = '待销单';
                return (state);
                break;
            case '4':
                state = '申请退款';
                return (state);
                break;
            case '5':
                state = '申请退款';
                return (state);
                break;
            case '6':
                state = '已退款';
                return (state);
                break;
            case '7':
                state = '已完成';
                return (state);
                break;
            case '8':
                state = '已发货';
                return (state);
                break;
        }
    }
    getData();
    api && api.addEventListener({
        name: 'orderManage-orderRefresh',
    }, function(ret, err) {
        if (ret.value.change == 1) {
            getData();
        }
    });

    // api && api.addEventListener({
    //     name: 'scrolltobottom',
    //     extra: {
    //         threshold: 0
    //     }
    // }, );

    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getData();
    });
    _g.setPullDownRefresh(function() {
        window.isNoMore = false;
        pageIndex = 1;
        // userOrder.detail = [];
        getData();
    });

    module.exports = {};

});
