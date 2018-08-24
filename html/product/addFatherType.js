define(function(require, exports, module) {
    var pageIndex = 1;
    var pageSize = 30;
    var UserInfo = _g.getLS("UserInfo");
	var Http = require('U/http');
    var addFatherType = new Vue({
        el: '#addFatherType',
        template: _g.getTemplate('product/addFatherType-main-V'),
        data: {
            fatherIndex: 0,
            fatherList: [{
                fatherID: '2246',
                type: '鲜蔬',
                isShow: false,
            }, {
                fatherID: '2246',
                type: '鲜蔬',
                isShow: false,
            }, {
                fatherID: '2246',
                type: '鲜蔬',
                isShow: false,
            }, {
                fatherID: '2246',
                type: '鲜蔬',
                isShow: false,
            }, ],
            childList: [{
                childID: '8982',
                childName: '蔬菜类',
                isShow: false,
            }, {
                childID: '8982',
                childName: '菌菇类',
                isShow: false,
            }, {
                childID: '8982',
                childName: '菜干类',
                isShow: false,
            }, ]
        },
        created: function() {
            this.fatherList = [];
            this.childList = [];
        },
        methods: {
            onAllAddTap: function() {
                submitAllType();
            },
            onAddFatherTap: function(index) {
                submitFatherID(this.fatherList[index].fatherID);
            },
            onAddChildTap: function(index) {
                submitChildID(this.childList[index].childID);
            },
            onShowTypeTap: function(index) {
                if(this.fatherList[index].isShow == false) {
                    this.fatherList[this.fatherIndex].isShow = false;
                    this.childList = [];
                    this.fatherList[index].isShow = true;
                    this.fatherIndex = index;
                    getChildData(this.fatherList[index].fatherID);
                } else {
                    this.fatherList[index].isShow = false;
                }
            },
        },
    });
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
            url: '/jiekou/agentht/fathercate/getCopyFathercate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    addFatherType.fatherList = getDetail(ret);
                    _g.hideProgress();
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
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    // 获取父类数据详情转换
    function getDetail(result) {
        var object = result.fathers || {};
        var amount = result.fathersl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                fatherID: object['father_' + i + '_id'] || '', // 父产品类别id
                type: object['father_' + i + '_name'] || '', // 父产品类别名称
                isShow: false,
            })
        }
        return list;
    }
    // 获取子类数据
    function getChildData(fatherID) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                fcpid: fatherID,
            },
            isSync: true,
            url: '/jiekou/agentht/procate/getProcate2.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    addFatherType.childList = getChildDetail(ret);
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
    // 获取子类数据详情转换
    function getChildDetail(result) {
        var object = result.cates || {};
        var amount = result.catesl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                fatherName: object['cate_' + i + '_fnc'] || '', // 父类别名
                fatherID: object['cate_' + i + '_fcpid'] || '', // 父产品类别id
                childID: object['cate_' + i + '_id'] || '', // 子产品类别id
                childName: object['cate_' + i + '_nc'] || '', // 子产品类别名称
                isShow: false,
            })
        }
        return list;
    }
    // 全部分类添加
    function submitAllType() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            url: '/jiekou/agentht/product/CopyAddAllProduct.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
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
            error: function(err) {}
        });
    }
    // 提交父分类id
    function submitFatherID(fatherID) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                fathercateid: fatherID,
            },
            isSync: true,
            url: '/jiekou/agentht/product/copyAddProductByF.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
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
            error: function(err) {}
        });
    }
    // 提交子分类id
    function submitChildID(childID) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                procateid: childID,
            },
            isSync: true,
            url: '/jiekou/agentht/product/copyAddProductByP.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
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
            error: function(err) {}
        });
    }

    getFatherData();

    // api && api.addEventListener({
    //     name: 'scrolltobottom',
    //     extra: {
    //         threshold: 0
    //     }
    // }, function(ret, err) {
    //     getData();
    // });
    // _g.setPullDownRefresh(function() {
    //     pageIndex = 1;
    //     addFatherType.list = [];
    //     getData();
    // });

    module.exports = {};

});