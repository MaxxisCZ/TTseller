define(function(require, exports, module) {
    var pageIndex = 1;
    var pageSize = 30;
    var UserInfo = _g.getLS("UserInfo");
	var Http = require('U/http');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var oneAddProduct = new Vue({
        el: '#oneAddProduct',
        template: _g.getTemplate('product/oneAddProduct-main-V'),
        data: {
            searchText: '',
            father: '',
            child: '',
            list: [{
                name: '土豆',
                price: '￥0.01元',
                weight: '2两/份',
            }, {
                name: '土豆',
                price: '￥0.01元',
                weight: '2两/份',
            }, {
                name: '土豆',
                price: '￥0.01元',
                weight: '2两/份',
            }, {
                name: '土豆',
                price: '￥0.01元',
                weight: '2两/份',
            }, ],
            fatherList: [{
                fatherName: '',
                fatherID: '',
            }],
            childList: [{
                childName: '',
                childID: '',
            }],
        },
        created: function() {
            this.list = [];
        },
        methods: {
            onSearchTap: function() {
                this.list = [];
                pageIndex = 1;
                getSearchData(this.searchText);
            },
            onSearchClassTap: function(classID,kind) {
                this.list = [];
                pageIndex = 1;
                searchFatherProduct(classID,kind);
            },
            onaddProductDetailTap: function(index) {
                _g.openWin({
                    header: {
                        data: {
                            title: '产品管理',
                        },
                    },
                    name: 'product-addProductDetail',
                    url: '../product/addProductDetail.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        productID: oneAddProduct.list[index].productID,
                    }
                });
            },
            onAddSingleTap: function(index) {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        productid: oneAddProduct.list[index].productID,
                    },
                    isSync: true,
                    url: '/jiekou/agentht/product/copyAddProduct.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            setTimeout(function() {
                                pageIndex = 1;
                                oneAddProduct.searchText = '';
                                oneAddProduct.list = [];
                                getData();
                            },0);
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
                // api && api.openFrame({
                //     name: 'selectProductClassify',
                //     url: '../popupbox/selectProductClassify.html',
                //     rect: {
                //         x: 0,
                //         y: headerHeight,
                //         w: 'auto',
                //         h: windowHeight,
                //     },
                //     pageParam: {
                //         productID: oneAddProduct.list[index].productID
                //     },
                // });
            }
        },
    });
    // 搜索菜品
    function getSearchData(param) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: pageSize,
                param: param,
            },
            isSync: true,
            url: '/jiekou/agentht/product/searchCopyProduct.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        var data = ret.data;
                        oneAddProduct.list = oneAddProduct.list.concat(getDetail(data));
                        pageIndex ++;
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
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    // 搜索父子类产品
    function searchFatherProduct(classID,kind) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: pageSize,
                kind: kind,
                condition: classID,
            },
            isSync: true,
            url: '/jiekou/agentht/product/searchCopyProductcate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        var data = ret.data;
                        oneAddProduct.list = oneAddProduct.list.concat(getDetail(data));
                        pageIndex ++;
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
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    // 获取数据 未完成
    function getData() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/product/getCopyProduct.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        var data = ret.data;
                        oneAddProduct.list = oneAddProduct.list.concat(getDetail(data));
                        pageIndex ++;
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
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function getDetail(result) {
        var object = result.products || {};
        var amount = result.productsl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                productID: object['pro_' + i + '_id'] || '', // 产品id
                name: object['pro_' + i + '_nc'] || '', // 产品名称
                marketPrice: object['pro_' + i + '_scj'] || 0, // 市场价
                price: object['pro_' + i + '_je'] || 0, // 价格
                cost: object['pro_' + i + '_cbj'] || '', // 成本价
                weight: object['pro_' + i + '_gg'] || '', // 单价重量
            })
        }
        return list;
    }

    // 获取父类数据
    function getFatherData() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/fathercate/getFathercate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        // alert(_g.j2s(ret));
                        var data = ret;
                        oneAddProduct.fatherList = getFatherDetail(data);
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
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function getFatherDetail(result) {
        var object = result.fathers || {};
        var amount = result.fathersl || 0;
        var list = [];
        for (var i = 0; i <= amount; i++) {
            list.push({
                fatherName: object['father_' + i + '_name'] || '', // 父类名称
                fatherID: object['father_' + i + '_id'] || '', // 父类id
            });
        }
        return list;
    }

    // 获取子类数据
    function getChildData() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/procate/getProcate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        // alert(_g.j2s(ret));
                        var data = ret;
                        oneAddProduct.childList = getChildDetail(data);
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
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    function getChildDetail(result) {
        var object = result.cates || {};
        var amount = result.catesl || 0;
        var list = [];
        for (var i = 0; i <= amount; i++) {
            list.push({
                childName: object['cate_' + i + '_nc'] || '', // 子类名称
                childID: object['cate_' + i + '_id'] || '', // 子类id
            });
        }
        return list;
    }

    getData();
    getFatherData();
    getChildData();

    api && api.addEventListener({
        name: 'product-oneAddProduct-referData',
    }, function(ret, err) {
        setTimeout(function() {
            pageIndex = 1;
            oneAddProduct.searchText = '';
            oneAddProduct.list = [];
            getData();
        },0);
    });

    api && api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0
        }
    }, function(ret, err) {
        if(oneAddProduct.searchText == '') {
            getData();
        } else {
            getSearchData(oneAddProduct.searchText);
        }
        
    });
    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            pageIndex = 1;
            oneAddProduct.searchText = '';
            oneAddProduct.list = [];
            getData();
        },0);
    });

    module.exports = {};

});