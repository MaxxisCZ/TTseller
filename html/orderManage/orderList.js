define(function(require, exports, module) {
    // var order_status = 0;
    var Http = require('U/http');
    var orderList = new Vue({
        el: '#orderList',
        template: _g.getTemplate('orderManage/orderList-main-V'),
        data: {
            order_status: -1,
            isCheck: 1,
            topList: [{
                title: '订单详情',
                isSelect: 1
            }, {
                title: '订单统计',
                isSelect: 0
            }],

            detail: [{
                title:'全部订单',
                tag: 'is-allOrder',
            }, {
                title:'待接单',
                tag: 'is-planOrder',
            }, {
                title:'待发货',
                tag: 'is-planShipped',
            }, {
                title:'待付款',
                tag: 'is-planPayment',
            }, {
                title:'已退款',
                tag: 'is-shipped',
            }, {
                title:'已完成',
                tag: 'is-finish',
            }, {
                title:'申请退款',
                tag: 'is-applyRefund',
            }, {
                title:'待销订单',
                tag: 'is-cleanOrder',
            }],

            statistics: [{
                title:'年月日销售',
                tag: 'is-monthCensus',
            }, {
                title:'时段下单量',
                tag: 'is-timeCensus',
            }, {
                title:'交货时段',
                tag: 'is-deliveryCensus',
            }, {
                title:'小区订单',
                tag: 'is-orderCensus',
            }, ]
        },
        methods: {
            onChangeTap: function(index) {
                // _.each(this.topList, function(n,i) {
                //     if(i == index) {
                //         n.isSelect = 1;
                //         orderList.isCheck = 0;
                //     } else{
                //         n.isSelect = 0;
                //         orderList.isCheck = 1;
                //     }
                // });
                if(index == 0) {
                    this.topList[0].isSelect = 1;
                    this.topList[1].isSelect = 0;
                    this.isCheck = 1;
                } else if(index == 1) {
                    this.topList[0].isSelect = 0;
                    this.topList[1].isSelect = 1;
                    this.isCheck = 0;
                }
            },
            onDetailTap: function(index) {
                var orderTitle = '';
                var orderUrl = '../orderManage/order.html';
                var orderName = 'orderManage-order';
                if(index == 0) {
                    this.order_status = -1;
                    orderTitle = '全部订单';
                } else if(index == 1) {
                    this.order_status = 1;
                    orderTitle = '待接单';
                    orderUrl = '../orderManage/orderStay.html';
                    orderName = 'orderManage-orderStay';
                } else if(index == 2) {
                    this.order_status = 2;
                    orderTitle = '待发货';
                    orderUrl = '../orderManage/orderStay.html';
                    orderName = 'orderManage-orderStay';
                } else if(index == 3) {
                    this.order_status = 0;
                    orderTitle = '待付款';
                } else if(index == 4) {
                    this.order_status = 6;
                    orderTitle = '已退款';
                } else if(index == 5) {
                    this.order_status = 7;
                    orderTitle = '已完成';
                } else if(index == 6) {
                    this.order_status = 4;
                    orderTitle = '申请退款';
                } else if(index == 7) {
                    this.order_status = 3;
                    orderTitle = '待销单';
                    orderUrl = '../orderManage/orderStay.html';
                    orderName = 'orderManage-orderStay';
                }
                _g.openWin({
                    header:{
                        data:{
                            title:orderTitle
                        },
                        template: 'common/header-search-V',
                    },
                    name: orderName,
                    url: orderUrl,
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        ddzt: orderList.order_status,
                    }
                });
            },
            onStatisticsTap: function(index) {
                // _.each(this.detail, function(n,i) {
                if(index == 0) {
                    _g.openWin({
                        header: {
                            data: {
                                title: '年月日销售',
                            },
                            template: 'common/header-menu-V',
                        },

                        name: 'orderCensus-yearMonthCensus',
                        url: '../orderCensus/yearMonthCensus.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                } else if(index == 1) {
                    _g.openWin({
                        header: {
                            data: {
                                title: '时段下单量',
                            }
                        },
                        name: 'orderCensus-timeCensus',
                        url: '../orderCensus/timeCensus.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                } else if(index == 2) {
                    _g.openWin({
                        header: {
                            data: {
                                title: '交货时段',
                            }
                        },
                        name: 'orderCensus-deliveryCensus',
                        url: '../orderCensus/deliveryCensus.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                } else if(index == 3) {
                    _g.openWin({
                        header: {
                            data: {
                                title: '小区订单',
                            }
                        },
                        name: 'orderCensus/orderCensus',
                        url: '../orderCensus/orderCensus.html',
                        bounces: false,
                        slidBackEnabled: false,
                    });
                }
                // });
            }
        },
    });

    module.exports = {};

});