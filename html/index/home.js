define(function(require, exports, module) {
    var Http = require('U/http');
    // var header = _g.addHeader({
    //     data: {
    //         title: '应用',
    //     },
    //     methods: {
    //         onTapLeft: function(){
    //             api && api.closeWin();
    //     }
    // });
    var home = new Vue({
        el: '#content',
        template: _g.getTemplate('index/home-body-V'),
        data: {
            isNetwork: false,
        },
        methods: {
            onOrderTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '订单管理',
                        },
                    },
                    name: 'order-order',
                    url: '../orderManage/orderList.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onUserTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '用户管理',
                        },
                        template: 'common/header-apostrophe-V'
                    },
                    name: 'user-user',
                    url: '../user/user.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onProductTap: function() {


                _g.openWin({
                    header: {
                        data: {
                            title: '产品管理',
                        }
                    },
                    name: 'product-product',
                    url: '../product/product.html',
                    bounces: false,
                    softInputMode: 'resize',
                    slidBackEnabled: false,
                });
            },
            onActivityTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '活动管理',
                        },
                        template: 'common/header-add-V'
                    },
                    name: 'activity-activity',
                    url: '../activity/activity.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onCouponTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            isEdit: false,
                            title: '优惠券',
                        },
                        template: 'common/header-delOrAdd-V'
                    },
                    name: 'coupon-coupon',
                    url: '../coupon/coupon.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onDistributionTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '配送管理',
                        },
                        template: 'common/header-menu-V'
                    },
                    name: 'distribution-distribution',
                    url: '../distribution/distribution.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onFinanceTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '财务管理',
                        },
                        template: 'common/header-card-V'
                    },
                    name: 'financeManage-financeM',
                    url: '../financeManage/financeM.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onEvaluateTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '评价管理',
                        }
                    },
                    name: 'index-evaluate',
                    url: '../index/evaluate.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onCostTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '账本管理',
                        },
                         template: 'common/header-menu-V'
                    },
                    name: 'cost-costM',
                    url: '../cost/costM.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onSystemTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '管理员',
                        },
                        template:'common/header-menu-V'
                    },
                    name: 'manageSetUp-managerList',
                    url: '../manageSetUp/managerList.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onFileTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '文件管理',
                        },
                        // template:'common/header-menu-V'
                    },
                    name: 'file-file',
                    url: '../file/file.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onScanTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '扫一扫',
                        },
                    },
                    name: 'scan-index',
                    url: '../scan/index.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            }
        }
    });
    module.exports = {};
});
