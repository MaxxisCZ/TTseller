define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var searchProduct = new Vue({
        el: '#content',
        template: _g.getTemplate('product/searchProduct-main-V'),
        data: {
            isNetwork: false,
            productNameOrID: '',
            father: '',
            child: '',
            fatherList: [{
                fatherName: '',
                fatherID: '',
            }],
            childList: [{
                childName: '',
                childID: '',
            }],
        },
        methods: {
            onCancelTap: function() {
                this.productNameOrID = '';
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            },
            onFatherTap: function(classID) {
                api.sendEvent({
                    name: 'product-product-searchClass',
                    extra: {
                        classID: classID,
                        type: 'father'
                    }
                });
                setTimeout(function() {
                    api.setFrameAttr({
                        name: api.frameName,
                        hidden: true,
                    });
                }, 250);
            },
            onChildTap: function(classID) {
                api.sendEvent({
                    name: 'product-product-searchClass',
                    extra: {
                        classID: classID,
                        type: 'cate'
                    }
                });
                setTimeout(function() {
                    api.setFrameAttr({
                        name: api.frameName,
                        hidden: true,
                    });
                }, 250);
            },
            onProductTap: function() {
                api.sendEvent({
                    name: 'search-product',
                    extra: {
                        content: searchProduct.productNameOrID
                    }
                });
                setTimeout(function() {
                    // searchProduct.productNameOrID = '';
                    api.setFrameAttr({
                        name: api.frameName,
                        hidden: true,
                    });
                }, 250);
            }

        }
    });
    // 获取父类数据
    function getFatherData() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token
            },
            isSync: true,
            lock: false,

            url: '/jiekou/agentht/fathercate/getFathercate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        // alert(_g.j2s(ret));
                        var data = ret;
                        searchProduct.fatherList = getFatherDetail(data);
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
                token: UserInfo.token
            },
            isSync: true,
            lock: false,

           url: '/jiekou/agentht/procate/getProcate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        // alert(_g.j2s(ret));
                        var data = ret;
                        searchProduct.childList = getChildDetail(data);
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

    getFatherData();
    getChildData();
    module.exports = {};
});
