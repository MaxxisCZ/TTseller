define(function(require, exports, module) {
    var productID = api && api.pageParam.productID;
    var UserInfo = _g.getLS("UserInfo");
	var Http = require('U/http');
    var addProductDetail = new Vue({
        el: '#addProductDetail',
        template: _g.getTemplate('product/addProductDetail-main-V'),
        data: {
            isProductEdit: true, // 不能编辑
            productDetail: {
                productName: '', //产品名称
                cateid: '', //子产品类别id
                cate: '', //子产品类别
                fatherID: '',   //父产品ID
                fatherName: '',     //父产品名字
                marketprice: '', // 市场价
                price: '', // 价格
                descibe: '', // 产品描述
                weight1: '', // 小重量
                weight2: '', // 大重量
                place: '', // 产地
                procount: '', // 库存量
                image1: '', // 产品小图
                image2: '', // 产品大图
                xgsl: '', // 限购数量
                dw_id: '', // 计价单位id
                dw: '', // 计价单位
                costprice: '', // 成本价
                ptnum: '', // 产品编号
                ishot: '', // 是否为热卖（ 1 是， 0 否）
                istop: '', // 是否置顶（ 1 是， 0 否）
                isweight: '', // 是否论斤显示（ 1 是， 0 否）
                ptbrand: '', // 产品品牌名
                rank: '', // 产品序列号
                zldw_id: '', // 重量单位id
                zldw: '', // 重量单位
                issale: '', // 是否为特价（ 0 否， 1 是）
                isnew: '', // 是否为新品（ 0 否， 1 是）
                istime: '', // 是否限时（ 0 否， 1 是）
                time1: '', // 开始时间
                time2: '', // 结束时间
                ggsl: '', // 规格数量
                ggs: '', // 规格信息
                unpassReason: '', // 未通过审核理由
                ggs: [{
                    ggTitle: 0,
                    ggid: '', // 规格id
                    ggprice: '', // 规格价格
                    ggxzl: '', // 规格小重量
                    ggdzl: '', // 规格大重量
                    ggkc: '', // 规格库存
                    ggfbsj: '', // 发布时间
                    ggxgsl: '', // 限购数量
                    ggdwid: '', // 单位id
                    ggzldwid: '', // h重量单位id
                    ggscj: '', // 市场价
                    ggcbj: '', // 规格成本价
                }, ]
            },
            fatherList: [{
                fatherID: '111',
                fatherName: '蔬菜',
                isEdit: 0,
                isShowChild: 0,
                childList: [{
                    isEdit: 0,
                    isAdd: 0,
                    isEmpty: 0,
                    childName: '鸡肉类',
                    childID: '111',
                    fatherName: '鸡肉',
                    fatherID: '122',
                }, ],
            }, ],
            childList: [{
                childName: '鸡肉类',
                childID: '111',
                fatherName: '鸡肉',
                fatherID: '122',
            }],
        },
        created: function() {

        },
        methods: {
            openStartTimePicker: function() {
                if (_g.isIOS) {
                    api.openPicker({
                        type: 'date_time',
                        // date: '2014-05-01 12:30',
                        title: '选择时间'
                    }, function(ret, err) {
                        if (ret) {
                            var year = ret.year;
                            var month = ret.month < 10 ? '0' + ret.month : ret.month;
                            var day = ret.day < 10 ? '0' + ret.day : ret.day;
                            var hour = ret.hour < 10 ? '0' + ret.hour : ret.hour;
                            var minute = ret.minute < 10 ? '0' + ret.minute : ret.minute;
                            var timeStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':00';
                            time1 = timeStr;
                        }
                    });
                }
            },
            selectFatherChange: function() {
                _.each(this.fatherList, function(n, i) {
                    if (addProductDetail.productDetail.fatherID == n.fatherID) {
                        addProductDetail.productDetail.fatherName = n.fatherName;
                        addProductDetail.productDetail.fatherID = n.fatherID;
                    }
                });
                setTimeout(function() {
                    getChildData();
                }, 300);
            },
            selectChildChange: function() {
                _.each(this.childList, function(n, i) {
                    if (addProductDetail.productDetail.cateid == n.childID) {
                        addProductDetail.productDetail.cate = n.childName;
                        addProductDetail.productDetail.cateid = n.childID;
                    }
                });
            },
            onAddSingleTap: function(index) {
                postSingleChildType();
            },
        },
    });

    function postSingleChildType() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                productid: productID,
                fathercateid: addProductDetail.productDetail.fatherID,
                procateid: addProductDetail.productDetail.cateid,
            },
            isSync: true,
            url: '/jiekou/agentht/product/copyAddProduct.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    _g.toast(ret.msg);
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
            error: function(err) {}
        });
    }

    function getProductData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                productid: productID,
                token: UserInfo.token,
            },
            lock: false,
            isSync: true,
            url:'/jiekou/agentht/product/getCopyProductDetail.aspx',
        //    url: '/jiekou/agentht/product/getProductDetail.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    getProductDetailValue(ret.data);
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
            error: function(err) {}
        });
    }

    function getProductDetailValue(result) {
        var object = result || {};
        addProductDetail.productDetail.productName = object.name || ''; //产品名称
        addProductDetail.productDetail.fatherID = object.fathercateid || ''; //父产品类别id
        addProductDetail.productDetail.fatherName = fatherChangToName(object.fathercateid) || ''; //父产品类别名字
        addProductDetail.productDetail.cateid = object.cateid || ''; //子产品类别id
        addProductDetail.productDetail.cate = changToName(object.cateid) || ''; //子产品类别名字
        addProductDetail.productDetail.marketprice = object.marketprice || ''; // 市场价
        addProductDetail.productDetail.price = object.price || ''; // 价格
        addProductDetail.productDetail.descibe = object.descibe || ''; // 产品描述
        addProductDetail.productDetail.weight1 = object.weight1 || ''; // 小重量
        addProductDetail.productDetail.weight2 = object.weight2 || ''; // 大重量
        addProductDetail.productDetail.place = object.place || ''; // 产地
        addProductDetail.productDetail.procount = object.procount || ''; // 库存量
        addProductDetail.productDetail.image1 = object.image1 || ''; // 产品小图
        addProductDetail.productDetail.image2 = object.image2 || ''; // 产品大图
        addProductDetail.productDetail.xgsl = object.xgsl || ''; // 限购数量
        addProductDetail.productDetail.dw_id = object.dw_id || ''; // 计价单位id
        addProductDetail.productDetail.dw = priceIDtoName(object.dw_id) || ''; // 计价单位
        addProductDetail.productDetail.costprice = object.costprice || ''; // 成本价
        addProductDetail.productDetail.ptnum = object.ptnum || ''; // 产品编号
        addProductDetail.productDetail.ishot = changeData(object.ishot) || ''; // 是否为热卖（ 1 是， 0 否）
        addProductDetail.productDetail.istop = changeData(object.istop) || ''; // 是否置顶（ 1 是， 0 否）
        addProductDetail.productDetail.isweight = changeData(object.isweight) || ''; // 是否论斤显示（ 1 是， 0 否）
        addProductDetail.productDetail.ptbrand = object.ptbrand || ''; // 产品品牌名
        addProductDetail.productDetail.rank = object.rank || ''; // 产品序列号
        addProductDetail.productDetail.zldw_id = object.zldw_id || ''; // 重量单位id
        addProductDetail.productDetail.zldw = weightIDtoName(object.zldw_id) || ''; // 重量单位
        addProductDetail.productDetail.issale = changeData(object.issale) || ''; // 是否为特价（ 0 否， 1 是）
        addProductDetail.productDetail.isnew = changeData(object.isnew) || ''; // 是否为新品（ 0 否， 1 是）
        addProductDetail.productDetail.istime = changeData(object.istime) || ''; // 是否限时（ 0 否， 1 是）
        addProductDetail.productDetail.time1 = object.time1 || ''; // 开始时间
        addProductDetail.productDetail.time2 = object.time2 || ''; // 结束时间
        addProductDetail.productDetail.ggsl = object.ggsl || ''; // 规格数量
        // addProductDetail.unpassReason = object.reason || '' // 未通过理由
        addProductDetail.productDetail.ggs = getSpeData(object);
    }

    function getFatherData() {
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
                if (ret.zt = 1) {
                    setTimeout(function() {
                        var dt = ret;
                        addProductDetail.fatherList = getFatherValue(dt);
                        addProductDetail.productDetail.fatherName = addProductDetail.fatherList[0].fatherName;
                        addProductDetail.productDetail.fatherID = addProductDetail.fatherList[0].fatherID;
                        setTimeout(function() {
                            getChildData();
                        }, 300);
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
    var getFatherValue = function(result) {
        var object = result.fathers || {};
        var amount = result.fathersl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                fatherID: object['father_' + i + '_id'] || '',
                fatherName: object['father_' + i + '_name'] || '',
                // isEdit: 0,
                // isShowChild: 0,
                // childList: [],
            });
        }
        return list;
    }
    function getChildData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                fcpid: addProductDetail.productDetail.fatherID,
            },
            lock: false,
            isSync: true,
            url: '/jiekou/agentht/procate/getProcate2.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret;
                    addProductDetail.childList = getChildValue(dt);
                    addProductDetail.productDetail.cate = addProductDetail.childList[0].childName;
                    addProductDetail.productDetail.cateid = addProductDetail.childList[0].childID;
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
                childID: object['cate_' + i + '_id'] || '',
                fatherName: object['cate_' + i + '_fnc'] || '',
                fatherID: object['cate_' + i + '_fcpid'] || '',
            })
        }
        return list;
    }

    var getSpeData = function(object) {
        var ggs = object.ggs || {};
        var amount = object.ggsl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                ggTitle: i,
                ggid: ggs['gg_' + i + '_id'] || '', // 规格id
                ggprice: ggs['gg_' + i + '_price'] || '', // 规格价格
                ggxzl: ggs['gg_' + i + '_xzl'] || '', // 规格小重量
                ggdzl: ggs['gg_' + i + '_dzl'] || '', // 规格大重量
                ggkc: ggs['gg_' + i + '_kc'] || '', // 规格库存
                ggfbsj: ggs['gg_' + i + '_fbsj'] || '', // 发布时间
                ggxgsl: ggs['gg_' + i + '_xgsl'] || '', // 限购数量
                ggdwid: priceIDtoName(ggs['gg_' + i + '_dwid']) || '', // 单位id
                ggzldwid: weightIDtoName(ggs['gg_' + i + '_zldwid']) || '', // h重量单位id
                ggscj: ggs['gg_' + i + '_scj'] || '', // 市场价
                ggcbj: ggs['gg_' + i + '_cbj'] || '', // 规格成本价
            })
        }
        return list;
    }
    //父类转名字
    function fatherChangToName(result) {
        var res;
        _.each(addProductDetail.fatherList, function(n, i) {

            if (result == n.fatherID) {
                res = n.fatherName;
                return res;
            }
        });
    }
    //子类转名字
    function changToName(result) {
        var res;
        _.each(addProductDetail.childList, function(n, i) {

            if (result == n.childID) {
                res = n.childName;
            }
        });
        return res;
    }
    function priceIDtoName(result) {
        var res;
        _.each(addProductDetail.price, function(n, i) {

            if (result == n.unitsID) {
                res = n.unitsName;
            }
        });
        return res;
    }
    var weightIDtoName = function(result) {
        var res;
        _.each(addProductDetail.weight, function(n, i) {
            if (result == n.unitsID) {
                res = n.unitsName;
            }
        });

        return res;

    }
    function changeData(result) {
        switch (result) {
            case '是':
                return 1;
                break;
            case '否':
                return 0;
                break;
            case '1':
                return '是';
                break;
            case '0':
                return '否';
                break;
            default:
                break;
        }
    }

    getFatherData();
    getProductData();

    module.exports = {};

});
