define(function(require, exports, module) {
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var order_status =api && api.pageParam.ddzt;
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var order = new Vue({
        el: '#order',
        template: _g.getTemplate('orderManage/order-main-V'),
        data: {
            searchText: '',
            detail: [{
                ID: '3521',
                state: '待发货',
                time: '2016/8/10 15:47:04',
                name: '周立波',
                orderID: '',
                stateNO: 0,
            },]
        },
        created: function(){
            this.detail = [];
        },
        methods: {
            onDetailTap: function(index) {
                var head = '';
                var refundName = '';
                var refundUrl = '';
                var template = '';
                _.each(this.detail, function(n,i) {
                    if(i == index) {
                        if(n.stateNO == 0) {
                            head = '待付款订单详情';
                            refundName = 'orderManage-willPayDetail';
                            refundUrl = '../orderManage/willPayDetail.html';
                        } else if(n.stateNO == 1) {
                            head = '待接订单详情';
                            refundName = 'orderManage-willRecDetail';
                            refundUrl = '../orderManage/willRecDetail.html';
                            // template = 'common/header-menu-V';
                        } else if(n.stateNO == 2) {
                            head = '待发货订单详情';
                            refundName = 'orderManage-readySendDetail';
                            refundUrl = '../orderManage/readySendDetail.html';
                            template = 'common/header-menu-V';
                        } else if(n.stateNO == 3) {
                            head = '待销订单详情';
                            refundName = 'orderManage-readyDestroyDetail';
                            refundUrl = '../orderManage/readyDestroyDetail.html';
                            template = 'common/header-menu-V';
                        } else if(n.stateNO == 4) {
                            head = '申请退款订单详情';
                            refundName = 'orderManage-applyRefundDetail';
                            refundUrl = '../orderManage/applyRefundDetail.html';
                        } else if(n.stateNO == 6) {
                            head = '已退款订单详情';
                            refundName = 'orderManage-refundedDetail';
                            refundUrl = '../orderManage/refundedDetail.html';
                            // template = 'common/header-menu-V';
                        } else if(n.stateNO == 7) {
                            head = '已完成订单详情';
                            refundName = 'orderManage-finishOrderDetail';
                            refundUrl = '../orderManage/finishOrderDetail.html';
                        } else {
                            head = '已发货订单详情';
                            refundName = 'orderManage-orderDetail';
                            refundUrl = '../orderManage/orderDetail.html';
                            // template = 'common/header-menu-V';
                        }
                        _g.openWin({
                            header:{
                                data:{
                                    title: head
                                },
                                template: template

                            },
                            name: refundName,
                            url: refundUrl,
                            bounces: false,
                            softInputMode: 'resize',
                            slidBackEnabled: false,
                            pageParam: {
                                orderid: n.orderID,
                                state: n.state,
                            }
                        });
                    }
                });
            }
        },
    });
    function getorderData() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                ddzt: order_status,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            // isSync: true,
            url: '/jiekou/agentht/order/getOrder.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var list = ret.data;
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            order.detail = getOderDetail(list);
                        } else {
                            order.detail = order.detail.concat(getOderDetail(list));
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
                        order.detail = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    function searchData(param) {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                ddzt: order_status,
                param: param,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            // isSync: true,
            url: '/jiekou/agentht/order/searchOrder.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            order.detail = getOderDetail(ret.data);
                        } else {
                            order.detail = order.detail.concat(getOderDetail(ret.data));
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
                        order.detail = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    function getOderDetail(result) {
        var data = result ? result : '';
        var orders = data.orders ? data.orders : '';
        var newArray = [];
        for(var i = 0; i < data.ordersl; i++)
            newArray.push({
                ID: orders['order_'+(i+1)+'_id'] || '--',
                state: getState(orders['order_'+(i+1)+'_status']) || '--',
                time: orders['order_'+(i+1)+'_time'] || '--',
                name: orders['order_'+(i+1)+'_shr'] || '--',
                orderID: orders['order_'+(i+1)+'_id'],
                stateNO: orders['order_'+(i+1)+'_status'] || '--',
            });
        return(newArray);
    }
    getState = function(result){
        switch(result){
            case '0':
                state = '待付款';
                return(state);
                break;
            case '1':
                state = '待接单';
                return(state);
                break;
            case '2':
                state = '待发货';
                return(state);
                break;
            case '3':
                state = '待销单';
                return(state);
                break;
            case '4':
                state = '申请退款';
                return(state);
                break;
            case '5':
                state = '申请退款';
                return(state);
                break;
            case '6':
                state = '已退款';
                return(state);
                break;
            case '7':
                state = '已完成';
                return(state);
                break;
            case '8':
                state = '已发货';
                return(state);
                break;
        }
    }
    getorderData();
    api && api.addEventListener({
        name: 'orderManage-orderRefresh',
    }, function(ret, err) {
        if(ret.value.refundSuccess == true) {
            api && api.openFrame({
                name: 'popupbox-successRefund',
                url: '../popupbox/successRefund.html',
                pageParam: {
                    printType: 2,
                },
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    h: windowHeight,
                },
            });
        }
        pageIndex = 1;
        // order.detail = [];
        getorderData();
    });
    // 监听发货刷新页面
    api && api.addEventListener({
        name: 'orderManage-readySendDetail-orderStyleData',
    }, function(ret, err) {
        pageIndex = 1;
        // order.detail = [];
        getorderData();
    });
    // 监听接单刷新页面
    api && api.addEventListener({
        name: 'orderManage-orderStay-getData',
    }, function(ret, err) {
        pageIndex = 1;
        // order.detail = [];
        getorderData();
    });
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        if(order.searchText != '') {
            searchData(order.searchText);
        } else {
            getorderData();
        }
    });
    api.addEventListener({
        name: 'orderManage-order-search',
    },function(ret,err) {
        api && api.openFrame({
            name: 'popupbox-search',
            url: '../popupbox/search.html',
            rect: {
                x: 0,
                y: headerHeight,
                w: 'auto',
                h: windowHeight,
            },
        });
    });
    api.addEventListener({
        name: 'orderManage-order-searchText',
    }, function(ret,err) {
        if(ret.value.mobile) {
            pageIndex = 1;
            // order.detail = [];
            order.searchText = ret.value.mobile;
            searchData(order.searchText);
        } else {
            _g.toast('请输入需要搜索订单的订单号或手机号');
        }
    });
    api.addEventListener({
        name:'orderManage-order-refundData',
    }, function(ret, err) {
        setTimeout(function() {
            pageIndex = 1;
            getorderData();
        }, 0);
    });
    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            pageIndex = 1;
            // order.detail = [];
            getorderData();
        }, 0);
    });

    module.exports = {};

});