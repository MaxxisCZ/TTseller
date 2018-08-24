define(function(require, exports, module) {
    var Http = require('U/http');
    var productID = api.pageParam.productID;
    var UserInfo = _g.getLS("UserInfo");
    var selectProductClassify = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/selectProductClassify-body-V'),
        data: {
            isNetwork: false,
            fatherName: '',
            fatherID: '',
            childName: '',
            childID: '',
            fatherList: [{
                fatherID: '111',
                fatherName: '蔬菜',
            }],
            childList: [{
                childName: '鸡肉类',
                childID: '111',
                fatherName: '鸡肉',
                fatherID: '122',
            }],
        },
        created: function() {
            this.fatherList = [];
            this.childList = [];
        },
        methods: {
            onCancelTap: function() {
                api&&api.closeFrame({

                });
            },
            selectFatherChange: function() {
                _.each(this.fatherList, function(n, i) {
                    if (selectProductClassify.fatherID == n.fatherID) {
                        selectProductClassify.fatherName = n.fatherName;
                        selectProductClassify.fatherID = n.fatherID;
                    }
                });
                getChildList();
            },
            selectChildChange: function() {
                _.each(this.childList, function(n, i) {
                    if (selectProductClassify.childID == n.childID) {
                        selectProductClassify.childName = n.childName;
                        selectProductClassify.childID = n.childID;
                    }
                });
            },
            onSubmitTap: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        productid: productID,
                        fathercateid: selectProductClassify.fatherID,
                        procateid: selectProductClassify.childID,
                    },
                    isSync: true,
                    url: '/jiekou/agentht/product/copyAddProduct.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            api && api.sendEvent({
                                name: 'product-oneAddProduct-referData',
                            });
                            setTimeout(function() {
                                api&&api.closeFrame({});
                            }, 500);
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            }
        }
    });
    function getFatherList() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            isSync: true,
            url: '/jiekou/agentht/fathercate/getFathercate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        selectProductClassify.fatherList = getFatherValue(ret);
                        selectProductClassify.fatherName = selectProductClassify.fatherList[0].fatherName;
                        selectProductClassify.fatherID = selectProductClassify.fatherList[0].fatherID;
                        setTimeout(function() {
                            getChildList();
                        }, 500);
                    }, 0);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    function getChildList() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                fcpid: selectProductClassify.fatherID,
            },
            lock: false,
            isSync: true,
            url: '/jiekou/agentht/procate/getProcate2.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        selectProductClassify.childList = getChildValue(ret);
                        selectProductClassify.childName = selectProductClassify.childList[0].childName;
                        selectProductClassify.childID = selectProductClassify.childList[0].childID;
                    }, 0);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    function getFatherValue(result) {
        var object = result.fathers || {};
        var amount = result.fathersl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                fatherID: object['father_' + i + '_id'] || '',
                fatherName: object['father_' + i + '_name'] || '',
            })
        }
        return list;
    }
    function getChildValue(result) {
        var object = result.cates || {};
        var amount = result.catesl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                isEdit: 0,
                isAdd: 0,
                isEmpty: 0,
                childName: object['cate_' + i + '_nc'] || '',
                childName2: object['cate_' + i + '_nc'] || '',
                childID: object['cate_' + i + '_id'] || '',
                fatherName: object['cate_' + i + '_fnc'] || '',
                fatherID: object['cate_' + i + '_fcpid'] || '',
            })
        }
        return list;
    }
    getFatherList();
    module.exports = {};
});
