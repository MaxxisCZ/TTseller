define(function(require, exports, module) {
    var orderid = api && api.pageParam.orderid;
    var UserInfo = _g.getLS('UserInfo');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var Http = require('U/http');
    var Vcode = require('U/vcode');
    var finishOrderDetail = new Vue({
        el: '#finishOrderDetail',
        template: _g.getTemplate('orderManage/finishOrderDetail-main-V'),
        data: {
            isShow: 1,
            code: '1234',
            inputCode: '',
            setPwd: false,
            reason: '',
            deliveryTime: [{
                time: ''
            }, ],
            options: [{
                text: '待付款',
                value: 0
            }, {
                text: '待接单',
                value: 1
            }, {
                text: '待发货',
                value: 2
            }, {
                text: '待销单',
                value: 3
            }, {
                text: '申请退款_未发货',
                value: 4
            }, {
                text: '申请退款_已发货',
                value: 5
            }, {
                text: '已退款',
                value: 6
            }, {
                text: '已完成',
                value: 7
            }, {
                text: '已发货',
                value: 8
            }, ],
            detail: {
                orderNum: '',
                call: '',
                phoneNum: '',
                orderCount: '',
                sumPrice: '',
                bill: '',
                recName: '',
                payWay: '',
                discountPrice: '',
                points: '',
                postage: '',
                payTime: '',
                sendTime: '',
                getTime: '',
                recPhone: '',
                orderTime: '',
                selected: '',
                remarks: '',
                addr: '',
                addrID: '',
                userID: '',
                orderMessage: '',
                stname: '',
                stmobile: '',
                goods: [{
                    goodsID: '',
                    goodOrderID: '',
                    avatar: '',
                    title: '',
                    sumMoney: '',
                    standard: '',
                    standardID: '',
                    amount: 0,
                    price: '',
                    sumPrice: '',
                }],
            },
            goodsIDArr: [{
                goodsID: ''
            }],
            standardArr: [{
                standard: ''
            }],
            sumArr: [{
                amount: ''
            }],
        },
        created: function() {
            this.detail = {};
        },
        methods: {
            onUserDetailTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '用户详情'
                        },
                        template: 'common/header-apostrophe-V'
                    },
                    name: 'user-userDetail',
                    url: '../user/userDetail.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        userid: finishOrderDetail.detail.userID,
                    }
                });
            },
            onAddressTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '修改收货地址',
                            userid: finishOrderDetail.detail.userID,
                        },
                        // template: '../html/common/header-add-V',
                    },
                    name: 'orderManage-changeAddress',
                    url: '../orderManage/changeAddress.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        userid: finishOrderDetail.detail.userID,
                    }
                });
            },
            onInputTap: function() {
                this.isShow = 0;
            },
            picker: function() {
                api.openPicker({
                    type: 'date_time',
                    // date: '2014-05-01 12:30',
                    title: '选择时间'
                }, function(ret, err) {
                    if (ret) {
                        // alert(JSON.stringify(ret));
                        finishOrderDetail.detail.getTime = ret.year+'-'+ret.month+'-'+ret.day+ ' '+ret.hour+':'+ret.minute;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            onCodeTap: function() {
                makeCodeTap();
            },
            onSubmitTap: function() {
                if(this.inputCode === '') {
                    _g.toast('验证码不能为空');
                    return;
                }
                if(this.inputCode.toUpperCase() != this.code) {
                    _g.toast('验证码不正确');
                    return;
                }
                Http.ajax({
                    data: {
                        loginname: _g.getLS('UserInfo').loginname,
                        agentid: _g.getLS('UserInfo').agentid,
                        staffid: _g.getLS('UserInfo').staffid,
                        token: _g.getLS('UserInfo').token,
                        orderid: orderid,
                        orderstatus: finishOrderDetail.detail.selected,
                        addrid: finishOrderDetail.detail.addrID,
                        jhtime: finishOrderDetail.detail.getTime,
                        shrmobile: finishOrderDetail.detail.recPhone,
                    },
                    url: '/jiekou/agentht/order/editOrder.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            api && api.sendEvent({
                                name: 'orderManage-orderRefresh',
                            });
                            makeCodeTap();
                            this.inputCode = '';
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
                            makeCodeTap();
                            this.inputCode = '';
                        }
                    },
                    error: function(err) {},
                });

            },
            onAmountInput: function(index) {
                this.detail.goods[index].amount = '';
            },
            onRefundSingleTap: function(index) {
                api.confirm({
                    title: '注意',
                    msg: '确定该单品退款！',
                    buttons: ['取消','确定']
                },function(ret,err) {
                    if(ret.buttonIndex == 2) {
                        if(finishOrderDetail.setPwd == true) {
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
                                    index: index,
                                    style: 1
                                }
                            });
                        } else {
                            Http.ajax({
                                data: {
                                    loginname: _g.getLS('UserInfo').loginname,
                                    agentid: _g.getLS('UserInfo').agentid,
                                    staffid: _g.getLS('UserInfo').staffid,
                                    token: _g.getLS('UserInfo').token,
                                    orderid: orderid,
                                    ordetailid: finishOrderDetail.detail.goods[index].goodOrderID
                                },
                                url: '/jiekou/agentht/order/drawback.aspx',
                                success: function(ret) {
                                    if(ret.zt == 1) {
                                        getOrderData();
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
                        }
                    }
                });
            },
            onRefundAllTap: function() {
                api && api.openFrame({
                    name: 'popupbox-refund',
                    url: '../popupbox/refund.html',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: windowHeight,
                    },
                });
            },
            onAmountTap: function() {
                if(finishOrderDetail.setPwd == true) {
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
                            style: 6
                        }
                    });
                } else {
                    var goodsID = [];
                    var standard = [];
                    var sum = [];
                    for (var i = 0; i < finishOrderDetail.detail.goods.length; i++) {
                        goodsID.push(finishOrderDetail.detail.goods[i].goodsID)
                        standard.push(finishOrderDetail.detail.goods[i].standardID);
                        sum.push(finishOrderDetail.detail.goods[i].amount);
                    }
                    finishOrderDetail.goodsIDArr = goodsID.join(',');
                    finishOrderDetail.standardArr = standard.join(',');
                    finishOrderDetail.sumArr = sum.join(',');
                    Http.ajax({
                        data: {
                            loginname: _g.getLS('UserInfo').loginname,
                            agentid: _g.getLS('UserInfo').agentid,
                            staffid: _g.getLS('UserInfo').staffid,
                            token: _g.getLS('UserInfo').token,
                            orderid: orderid,
                            pid: finishOrderDetail.goodsIDArr,
                            ggid: finishOrderDetail.standardArr,
                            ptcount: finishOrderDetail.sumArr,
                        },
                        url: '/jiekou/agentht/order/editProduct.aspx',
                        success: function(ret) {
                            if (ret.zt == 1) {
                                // 刷新数据
                                getOrderData();
                                getJhTimeData();
                                havePsw();
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
        },
    });
    function payWay(param) {
        if(param == 1) {
            return('账户余额');
        } else if(param == 2) {
            return('微信支付');
        } else if(param == 3) {
            return('支付宝');
        } else if(param == 4) {
            return('货到付款');
        }
    }
    var getOrderData = function() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                orderid: orderid,
            },
            lock: false,
            url: '/jiekou/agentht/order/getOrderdetail.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var data = ret.data;
                    finishOrderDetail.detail = getOderDetail(data);
                    makeCodeTap();
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

    //获取交货时间
    function getJhTimeData() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
            },
            lock: false,
            url: '/jiekou/agentht/distribution/getTimeJH.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var data = ret.data.times;
                    finishOrderDetail.deliveryTime = data;
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

    var getOderDetail = function(result) {
        var data = result ? result : '';
        var detail = data.cpxx ? data.cpxx : '';
        var newArray = [];
        for (var i = 0; i < data.cpxxsl; i++)
            newArray.push({
                goodsID: detail['cp_' + (i + 1) + '_id'] || '',
                goodOrderID: detail['cp_' + (i + 1) + '_odid'] || '',
                avatar: detail['cp_' + (i + 1) + '_tp'] || '',
                title: detail['cp_' + (i + 1) + '_mc'] || '',
                sumMoney: detail['cp_' + (i + 1) + '_zj'] || '',
                standard: detail['cp_' + (i + 1) + '_gg'] || '',
                standardID: detail['cp_' + (i + 1) + '_ggid'] || '',
                amount: detail['cp_' + (i + 1) + '_sl'] || '',
                price: detail['cp_' + (i + 1) + '_jg'] || '',
                sumPrice: detail['cp_' + (i + 1) + '_zj'] || '',
            });
        return {
            orderNum: data.ordernum || '',
            call: data.name || '',
            phoneNum: data.account || '',
            orderCount: data.ordercount || '',
            sumPrice: data.sumprice || '',
            bill: data.bill || '',
            recName: data.shr || '',
            payWay: payWay(data.fkfs) || '',
            discountPrice: data.discountprice || '',
            points: data.points || '',
            postage: data.youfei || '',
            payTime: data.paytime || '',
            sendTime: data.sendtime || '',
            getTime: data.jhtime || '',
            recPhone: data.shrmobile || '',
            orderTime: data.ordertime || '',
            selected: data.ddzt || '',
            remarks: data.liuyan || '',
            addr: data.addr || '',
            addrID: data.addrid || '',
            userID: data.userid || '',
            orderMessage: data.liuyan || '',
            stname: data.stname || '',
            stmobile: data.stmobile || '',
            goods: newArray || [],
        }
    }
    function printOrder(result) {
        var detail = result ? result : {};
        var good = result ? result.goods : [];
        var newArray = [];
        _.map(good, function(data) {
            newArray.push({
                name: data.title || '',
                dj: data.standard || '',
                num: data.amount || '',
                je: data.sumMoney || '',
            });
        });
        return {
            ddh: detail.orderNum || '',
            khxm: detail.recName || '',
            mobile: detail.recPhone || '',
            xdsj: detail.orderTime || '',
            jhsj: detail.getTime || '',
            addr: detail.addr || '',
            fkfs: detail.payWay || '',
            xdly: detail.orderMessage || '',
            ddxq: newArray || [],
            zj: detail.sumPrice || '',
            yf: detail.postage || '',
            zkj: detail.discountPrice || '',
            tb: detail.points || '',
            ze: detail.bill || '',
        }
    }
    function printProduct(result) {
        var detail = result ? result : [];
        return _.map(detail, function(data) {
            return{
                id: data.goodsID || '',
                name: data.title || '',
                weight: data.standard || '',
                num: data.amount || '',
                money: data.price || '',
            };
        });
    }
    function makeCodeTap() {
        finishOrderDetail.code = Vcode.getVerificationCode();
    }
    function havePsw() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/agent/getAgent.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    if(ret.data.payflag == 1) {
                        finishOrderDetail.setPwd = true;
                    } else {
                        finishOrderDetail.setPwd = false;
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
                    finishOrderDetail.setPwd = false;
                }
            },
            error: function(err) {},
        });
    }
    getOrderData();
    getJhTimeData();
    havePsw();
    api.addEventListener({
        name: 'orderDetail-menu',
    }, function(ret, err) {
        if (!window.isMenuOpen) {
            _g.openMenuFrame({
                list: ['打印订单', '打印菜品标签']
            });
        } else {
            api.sendEvent({
                name: 'global-menu-onBtnTap',
            });
        }

    });
    api.addEventListener({
        name: api.winName + '-menu-onItemTap',
    }, function(ret, err) {
        if(ret.value.index == 0) {
            api.confirm({
                title: '注意',
                msg: '确定打印订单！',
                buttons: ['取消','确定']
            }, function(ret,err) {
                if(ret.buttonIndex == 2) {
                    Http.ajax({
                        data: {
                            loginname: UserInfo.loginname,
                            agentid: UserInfo.agentid,
                            staffid: UserInfo.staffid,
                            token: UserInfo.token,
                            data: printOrder(finishOrderDetail.detail),
                        },
                        isSync: true,
                        url: '/jiekou/agentht/order/PrintOrder.aspx',
                        success: function(ret) {
                            if(ret.zt == 1) {
                                _g.toast(ret.msg);
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
            });
        } else if(ret.value.index == 1) {
            api.confirm({
                title: '注意',
                msg: '确定打印菜品标签！',
                buttons: ['取消','确定']
            }, function(ret,err) {
                if(ret.buttonIndex == 2) {
                    Http.ajax({
                        data: {
                            loginname: UserInfo.loginname,
                            agentid: UserInfo.agentid,
                            staffid: UserInfo.staffid,
                            token: UserInfo.token,
                            data: printProduct(finishOrderDetail.detail.goods),
                        },
                        isSync: true,
                        url: '/jiekou/agentht/order/PrintProduct.aspx',
                        success: function(ret) {
                            if(ret.zt == 1) {
                                _g.toast(ret.msg);
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
            });
        }
    });
    api.addEventListener({
        name: 'orderManage-orderDetail-refundSingle',
    }, function(ret, err) {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                orderid: orderid,
                ordetailid: finishOrderDetail.detail.goods[ret.value.index].goodOrderID
            },
            url: '/jiekou/agentht/order/drawback.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    _g.toast(ret.msg);
                    getOrderData();
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
    });
    api.addEventListener({
        name: 'orderManage-orderDetail-refundAll',
    }, function(ret, err) {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                orderid: orderid,
                tkly: finishOrderDetail.reason,
            },
            url: '/jiekou/agentht/order/drawback2.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    api && api.sendEvent({
                        name: 'orderManage-orderRefresh',
                        extra: {
                            refundSuccess: true,
                        }
                    });
                    api && api.closeWin();
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
                    api && api.openFrame({
                        name: 'popupbox-failRefund',
                        url: '../popupbox/failRefund.html',
                        pageParam: {
                            printType: 2,
                        },
                        rect: {
                            x: 0,
                            y: headerHeight,
                            w: 'auto',
                            h: windowHeight,
                        },
                        pageParam: {
                            message: ret.msg,
                        }
                    });
                }
            },
            error: function(err) {},
        });
    });
    api.addEventListener({
        name: 'orderManage-finishOrderDetail-refundReason',
    }, function(ret, err) {
        setTimeout(function() {
            finishOrderDetail.reason = ret.value.reason;
        }, 500);
        if(finishOrderDetail.setPwd == true) {
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
                    style: 2
                }
            });
        } else {
            Http.ajax({
                data: {
                    loginname: _g.getLS('UserInfo').loginname,
                    agentid: _g.getLS('UserInfo').agentid,
                    staffid: _g.getLS('UserInfo').staffid,
                    token: _g.getLS('UserInfo').token,
                    orderid: orderid,
                    tkly: finishOrderDetail.reason,
                },
                url: '/jiekou/agentht/order/drawback2.aspx',
                success: function(ret) {
                    if(ret.zt == 1) {
                        _g.toast(ret.msg);
                        setTimeout(function() {
                            api && api.sendEvent({
                                name: 'orderManage-orderRefresh',
                                extra: {
                                    refundSuccess: true,
                                }
                            });
                        }, 0);
                        api && api.closeWin();
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
                        api && api.openFrame({
                            name: 'popupbox-failRefund',
                            url: '../popupbox/failRefund.html',
                            pageParam: {
                                printType: 2,
                            },
                            rect: {
                                x: 0,
                                y: headerHeight,
                                w: 'auto',
                                h: windowHeight,
                            },
                            pageParam: {
                                message: ret.msg,
                            }
                        });
                    }
                },
                error: function(err) {},
            });
        }
    });
    api.addEventListener({
        name: 'orderManage-orderDetail-saveAll',
    }, function(ret, err) {
        var goodsID = [];
        var standard = [];
        var sum = [];
        for (var i = 0; i < finishOrderDetail.detail.goods.length; i++) {
            goodsID.push(finishOrderDetail.detail.goods[i].goodsID)
            standard.push(finishOrderDetail.detail.goods[i].standardID);
            sum.push(finishOrderDetail.detail.goods[i].amount);
        }
        finishOrderDetail.goodsIDArr = goodsID.join(',');
        finishOrderDetail.standardArr = standard.join(',');
        finishOrderDetail.sumArr = sum.join(',');
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                orderid: orderid,
                pid: finishOrderDetail.goodsIDArr,
                ggid: finishOrderDetail.standardArr,
                ptcount: finishOrderDetail.sumArr,
            },
            url: '/jiekou/agentht/order/editProduct.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    // 刷新数据
                    getOrderData();
                    getJhTimeData();
                    havePsw();
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
    });
    api.addEventListener({
        name: 'orderManage-changeAddress',
    }, function(ret, err) {
        finishOrderDetail.detail.addr = ret.value.changeAddress;
        finishOrderDetail.detail.addrID = ret.value.addrID;
    });

    module.exports = {};

});
