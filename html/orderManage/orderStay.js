define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var order_status =api && api.pageParam.ddzt;
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var orderStay = new Vue({
        el: '#orderStay',
        template: _g.getTemplate('orderManage/orderStay-main-V'),
        data: {
            searchText: '',
            state: '',
            setPwd: false,
            detail: [{
                ID: '3521',
                state: '待发货',
                time: '2016/8/10 15:47:04',
                person: '周立波',
                orderID: '',
            },]
        },
        created: function(){
            this.detail = [];
        },
        methods: {
            onSearchTap: function() {
                pageIndex = 1;
                if(this.searchText != '') {
                    this.detail = [];
                    Http.ajax({
                        data: {
                            loginname: _g.getLS('UserInfo').loginname,
                            agentid: _g.getLS('UserInfo').agentid,
                            staffid: _g.getLS('UserInfo').staffid,
                            token: _g.getLS('UserInfo').token,
                            param: this.searchText,
                            pageIndex: pageIndex,
                            pageSize: pageSize,
                        },
                        isSync: true,
                        url: '/jiekou/agentht/user/searchUser.aspx',
                        success: function(ret) {
                            if(ret.zt == 1) {
                                getorderData();
                                // _g.toast(ret.msg);
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
                                _g.toast(ret.msg);
                            }
                        },
                        error: function(err) {},
                    });
                } else {
                    _g.toast('请输入需要搜索订单的订单号或手机号');
                }
            },
            onDetailTap: function(index) {
                var head = '';
                var refundName = '';
                var refundUrl = '';
                var template = '';
                if(order_status == 1) {
                    head = '待接订单详情';
                    refundName = 'orderManage-willRecDetail';
                    refundUrl = '../orderManage/willRecDetail.html';
                } else if(order_status == 2) {
                    head = '待发货订单详情';
                    refundName = 'orderManage-readySendDetail';
                    refundUrl = '../orderManage/readySendDetail.html';
                    template = 'common/header-menu-V';
                } else {
                    head = '待销订单详情';
                    refundName = 'orderManage-readyDestroyDetail';
                    refundUrl = '../orderManage/readyDestroyDetail.html';
                    template = 'common/header-menu-V';
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
                        orderid: orderStay.detail[index].orderID,
                        state: orderStay.detail[index].state,
                    }
                });
            },
            onDeleteTap: function(index) {
                var msg = '';
                if(order_status == 1) {
                    msg = '确定接收该订单吗？';
                } else if(order_status == 2) {
                    msg = '确定发货该订单吗？';
                } else if(order_status == 3) {
                    msg = '确定销毁该订单吗？';
                }
                api.confirm({
                    title: '注意',
                    msg: msg,
                    buttons: ['取消','确定']
                },function(ret,err) {
                    if(ret.buttonIndex == 2) {
                        if(orderStay.setPwd == true && order_status == 3) {
                            _g.openWin({
                                header: {
                                    data: {
                                        title: '支付密码',
                                    },
                                },
                                name: 'financeManage-payPassword',
                                url: '../financeManage/payPassword.html',
                                bounces: false,
                                slidBackEnabled: false,
                                pageParam: {
                                    style: 4,
                                    index: index
                                }
                            });
                        } else {
                            Http.ajax({
                                data: {
                                    loginname: _g.getLS('UserInfo').loginname,
                                    agentid: _g.getLS('UserInfo').agentid,
                                    staffid: _g.getLS('UserInfo').staffid,
                                    token: _g.getLS('UserInfo').token,
                                    ddzt: order_status,
                                    orderid: orderStay.detail[index].orderID,
                                },
                                isSync: true,
                                lock: false,
                                url: '/jiekou/agentht/order/editStatus.aspx',
                                success: function(ret) {
                                    if(ret.zt == 1) {
                                        pageIndex = 1;
                                        // orderStay.detail = [];
                                        getorderData();
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
                                        _g.toast(ret.msg);
                                    }
                                },
                                error: function(err) {},
                            });
                        }
                    }
                });
            }
        },
    });
    var getorderData = function() {
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
            lock: false,
            url: '/jiekou/agentht/order/getOrder.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var list = ret.data;
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            orderStay.detail = getOderDetail(list);
                        } else {
                            orderStay.detail = orderStay.detail.concat(getOderDetail(list));
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
                        orderStay.detail = [];
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
                            orderStay.detail = getOderDetail(ret.data);
                        } else {
                            orderStay.detail = orderStay.detail.concat(getOderDetail(ret.data));
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
                        orderStay.detail = [];
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
                time: orders['order_'+(i+1)+'_jh'] || '--',
                person: orders['order_'+(i+1)+'_shr'] || '--',
                orderID: orders['order_'+(i+1)+'_id'],
            });
        return(newArray);
    }
    function orderStatus(param) {
        if(param == 1) {
            orderStay.state = '接单';
        } else if(param == 2) {
            orderStay.state = '发货';
        } else if(param == 3) {
            orderStay.state = '销单';
        }
        return
    };
    function getState(param) {
        if(param == 1) {
            return('接单');
        } else if(param == 2) {
            return('发货');
        } else {
            return('销单');
        }
    }
    function havePsw() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/agent/getAgent.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    if(ret.data.payflag == 1) {
                        orderStay.setPwd = true;
                    } else {
                        orderStay.setPwd = false;
                    }
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
                    orderStay.setPwd = false;
                }
            },
            error: function(err) {},
        });
    }
    orderStatus(order_status);
    getorderData();
    havePsw();
    api && api.addEventListener({
        name: 'orderManage-orderStayRefresh',
    }, function(ret, err) {
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
        pageIndex = 1;
        // orderStay.detail = [];
        getorderData();
    });
    api && api.addEventListener({
        name: 'orderManage-readySendDetail-orderStyleData',
    }, function(ret, err) {
        pageIndex = 1;
        // orderStay.detail = [];
        getorderData(ret.value.state);
    });
    api && api.addEventListener({
        name: 'orderManage-orderStay-getData',
    }, function(ret, err) {
        pageIndex = 1;
        // orderStay.detail = [];
        getorderData(ret.value.state);
    });
    _g.setLoadmore(function(ret, err) {
        setTimeout(function() {
            pageIndex ++;
            if(orderStay.searchText != '') {
                searchData(orderStay.searchText);
            } else {
                getorderData();
            }
        }, 0);
    });
    api.addEventListener({
        name: 'orderManage-orderStay-search',
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
            // orderStay.detail = [];
            orderStay.searchText = ret.value.mobile;
            searchData(orderStay.searchText);
        } else {
            _g.toast('请输入需要搜索订单的订单号或手机号');
        }
    });
    api.addEventListener({
        name: 'orderManage-orderStay-payPwd',
    }, function(ret, err) {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                ddzt: order_status,
                orderid: orderStay.detail[ret.value.index].orderID,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/order/editStatus.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    api && api.openFrame({
                        name: 'popupbox-destroyOrder',
                        url: '../popupbox/destroyOrder.html',
                        rect: {
                            x: 0,
                            y: headerHeight,
                            w: 'auto',
                            h: windowHeight,
                        },
                    });
                    pageIndex = 1;
                    // orderStay.detail = [];
                    getorderData();
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
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    });
    _g.setPullDownRefresh(function() {
        pageIndex = 1;
        // orderStay.detail = [];
        orderStatus(order_status);
        getorderData();
        havePsw();
    });
    module.exports = {};

});