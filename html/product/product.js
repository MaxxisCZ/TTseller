define(function(require, exports, module) {
    var Http = require('U/http');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var UserInfo = _g.getLS("UserInfo");
    var page = 0;
    var next = true;
    var deletePage = 0;
    var deleteNext = true;
    var mytime = new Date();
    var allNext = true;
    var allPage = 0;
    var monthNext = true;
    var monthPage = 0;
    var weekNext = true;
    var weekPage = 0;
    var storeNext = true;
    var storPage = 0;
    var fs = api.require('fs');
    var product = new Vue({
        el: '#content',
        template: _g.getTemplate('product/product-body-V'),
        data: {
            searchContent: '',
            isSearch: 0,
            checkIndex: 0, // 审核下标值
            isCheck: true,
            ischeckDetail: false, // 产品详情是否通过测试
            isHasSpe: 0, //是否能点击添加规格
            isFatherEdit: false, //是否编辑父产品
            isShowChildList: false,
            isFirstSelect: -1, //是否第一次选择
            currSelectIndex: -1,
            currSaleListIndex: -1,
            turnPageIndex: -1, //是否可以翻页
            isTrue: false,
            isStoreData: false, //是否显示库存量
            isOpenProductDetail: false, //是否打开产品详情
            isNetwork: false,
            isClassify: true,
            isDelete: false,
            isShowRecycleSales: false,
            isShowQuery: false,
            isShowSelect: false,
            isShowClassify: true,
            isShowList: false,
            isShowSales: true,
            isShowDetail: false,
            isAddProduct: false,
            isAddSpecifications: true,
            isProductEdit: true,
            // isList:false,
            chooseIndex: 0,
            IOS: _g.isIOS,
            isFatherProduct: true,
            isChildProduct: true,
            isShowFatherList: true,
            isShowChildProduct: true,
            fatherListIDSelect: '未选择',
            childListIDSelect: '未选择',
            ChangeFatherName: '',
            chooseFatherIndex: '',
            chooseChildIndex: '',
            editFather: '',
            editChild: '',
            childName: '',
            productID: '',
            fatherName: '',
            fatherID: '',
            productPriceUnits: '',
            productWeightUnits: '',
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            checkTop: [{
                title: '已审核',
                isSelect: true
            }, {
                title: '未审核',
                isSelect: false
            }, {
                title: '未通过',
                isSelect: false
            }, ],
            productAdd: {
                priceUnits: '', // 计价单位
                priceID: '', //计价单位ID
                fatherID: '', //父产品ID
                fatherName: '', //父产品名字
                childID: '', //子产品ID
                childName: '', //子产品名字
                weightID: '',
                weightUnits: '',
                time1: '',
                time2: '',
                isSales: '', // 是否为特价（ 0 否， 1 是）
                isNew: '', // 是否为新品（ 0 否， 1 是）
                isTimeLimit: '', // 是否限时（ 0 否， 1 是）
                costPrice: '', // 成本价
                productNum: '', // 产品编号
                productBrand: '', // 产品品牌名
                rank: '10000', // 产品序列号
                productPrice: '', // 价格
                limitAmount: '', // 限购数量
                place: '', // 产地
                isTop: '', // 是否置顶（ 1 是， 0 否）
                isWeight: '', // 是否论斤显示（ 1 是， 0 否）
                isHot: '', // 是否为热卖（ 1 是， 0 否）
                minWeight: '', // 小重量
                maxWeight: '', // 大重量
                procount: '', // 库存量
                productName: '', //产品名称
                describe: '', //描述
                marketPrice: '', // 市场价
                // minImage: '', // 产品小图
                maxImage: '', // 产品大图
            },
            productDetail: {
                productName: '', //产品名称
                cateid: '', //子产品类别id
                cate: '', //子产品类别
                fatherID: '', //父产品ID
                fatherName: '', //父产品名字
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
            checkList: [{
                list: '更新产品月销量'
            }, {
                list: '更新产品周销量'
            }, {
                list: '总销量排行'
            }, {
                list: '月销量排行'
            }, {
                list: '周销量排行'
            }, {
                list: '库存销量排行'
            }, ],
            weight: [{
                unitsID: '',
                unitsName: '吨',
            }, {
                unitsID: '',
                unitsName: '斤',
            }, ],
            price: [{
                unitsID: '',
                unitsName: '元',
            }, {
                unitsID: '',
                unitsName: '万',
            }, {
                unitsID: '',
                unitsName: '千',
            }, ],
            fatherList: [{
                fatherID: '111',
                fatherName: '蔬菜',
                fatherName2: '蔬菜',
                isEdit: 0,
                isShowChild: 0,
                childList: [{
                    isEdit: 0,
                    isAdd: 0,
                    isEmpty: 0,
                    childName: '鸡肉类',
                    childName2: '鸡肉类',
                    childID: '111',
                    fatherName: '鸡肉',
                    fatherID: '122',
                }, ],
            }, {
                fatherID: '111',
                fatherName: '蔬菜',
                isEdit: 0,
                isShowChild: 0,
                childList: [{
                    isEdit: 0,
                    childName: '鸡肉类',
                    childName2: '鸡肉类',
                    childID: '111',
                    fatherName: '鸡肉',
                    fatherID: '122',
                }, ],
            }, {
                fatherID: '111',
                fatherName: '蔬菜',
                isEdit: 0,
                isShowChild: 0,
                childList: [{
                    isEdit: 0,
                    childName: '鸡肉类',
                    childName2: '鸡肉类',
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
            childClassify: {
                childName: '鸡肉类',
                childID: '111',
                fatherName: '鸡肉',
                fatherID: '122',
            },
            nowPage: '1',
            maxPage: '12',
            salesList: [{
                productID: '', // 产品id
                productName: '', // 产品名称
                productType: '', // 产品类别
                totalSalesAmount: '1', // 总销量
                monthSalesAmount: '2', // 月销量
                weekSalesAmount: '3', // 周销量
                marketPrice: 0, // 市场价
                price: 0, // 价格
                cost: '', // 成本价
                storedValue: 0, //库存价值
                storedAmount: 0, // 库存数量
                weightUnit: '', //重量单位
                weightRange: '', // 重量范围
                singleWeight: '', // 单价重量
            }, {
                productID: '', // 产品id
                productName: '', // 产品名称
                productType: '', // 产品类别
                totalSalesAmount: '1', // 总销量
                monthSalesAmount: '2', // 月销量
                weekSalesAmount: '3', // 周销量
                marketPrice: 0, // 市场价
                price: 0, // 价格
                cost: '', // 成本价
                storedValue: 0, //库存价值
                storedAmount: 0, // 库存数量
                weightUnit: '', //重量单位
                weightRange: '', // 重量范围

            }, ],
            recycleList: [{
                productAmount: 0, // 产品数量
                productInfo: '', // 产品信息
                productID: '', // 产品id
                productName: '', // 产品名称
                productType: '', // 产品类别
                totalSalesAmount: '', // 总销量
                monthSalesAmount: '', // 月销量
                weekSalesAmount: '', // 周销量
                marketPrice: 0, // 市场价
                price: 0, // 价格
                cost: '', // 成本价
                storedValue: 0, //库存价值
                storedAmount: 0, // 库存数量
                weightUnit: '', //重量单位
                weightRange: '', // 重量范围
            }, ],
            speList: [{
                title: '', //添加规格
                price: '', // 价格
                weight: '', //重量
                Stock: '', //库存
                limitAmount: '', //限购数量
                valuationUnit: '', //计价单位
                weightUnit: '', // 重量单位
                marketPrice: '', //市场价
                costPrice: '', //成本价
                save: '', //保存
            }],
            speObject: {
                price: '', //价格
                weight1: '', //重量
                weight2: '', //重量
                stock: '', //库存
                limitAmount: '', //限购数量
                valuationUnit: '', //计价单位
                valuationUnitID: '', //计价单位id
                weightUnit: '', //重量单位
                weightUnitID: '', //重量单位id
                marketPrice: '', //市场价
                costPrice: '', //成本价
            }
        },
        created: function() {
            this.speList = [];
            this.recycleList = [];
            this.salesList = [];
            var self = this;
            $('body').on('click', function(e) {
                var target = $(e.target);
                if (target.closest('.onSortTap').length > 0) return;
                if (!self.isShowSelect) return;
                var target1 = $(e.target).closest('.ui-list__select');
                if (target1.length > 0) {
                } else {
                    self.isShowSelect = false;
                }
            });
            this.fatherList = [];
        },
        methods: {
            onCheckTap: function(index) {
                this.checkTop[this.checkIndex].isSelect = false;
                this.checkTop[index].isSelect = true;
                this.checkIndex = index;
                if (index == 0) {
                    this.isCheck = true;
                } else {
                    this.isCheck = false;
                }
                this.selectList();
            },
            onOneAddTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '产品管理',
                        },
                    },
                    name: 'product-oneAddProduct',
                    url: '../product/oneAddProduct.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            onAddFatherTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '产品管理',
                        },
                    },
                    name: 'product-addFatherType',
                    url: '../product/addFatherType.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            openStartTimePicker: function() {
                if (_g.isIOS) {
                    api.openPicker({
                        type: 'date_time',
                        title: '选择时间'
                    }, function(ret, err) {
                        if (ret) {
                            var year = ret.year;
                            var month = ret.month < 10 ? '0' + ret.month : ret.month;
                            var day = ret.day < 10 ? '0' + ret.day : ret.day;
                            var hour = ret.hour < 10 ? '0' + ret.hour : ret.hour;
                            var minute = ret.minute < 10 ? '0' + ret.minute : ret.minute;
                            var timeStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':00';
                            if (product.productAdd) product.productAdd.time1 = timeStr;
                            if (product.productDetail) product.productDetail.time1 = timeStr;
                        }
                    });
                }
            },
            openEndTimePicker: function() {
                if (_g.isIOS) {
                    api.openPicker({
                        type: 'date_time',
                        title: '选择时间'
                    }, function(ret, err) {

                        if (ret) {
                            var year = ret.year;
                            var month = ret.month < 10 ? '0' + ret.month : ret.month;
                            var day = ret.day < 10 ? '0' + ret.day : ret.day;
                            var hour = ret.hour < 10 ? '0' + ret.hour : ret.hour;
                            var minute = ret.minute < 10 ? '0' + ret.minute : ret.minute;
                            var timeStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':00';

                            if (product.productAdd) {
                                product.productAdd.time2 = timeStr;
                            }
                            if (product.productDetail) {

                                product.productDetail.time2 = timeStr;
                            }
                        }
                    });
                }
            },
            onSelectClassify: function() {
                this.isClassify = true;
                this.isShowClassify = true;
                this.isShowList = false;
                // this.fatherList = [];
                // getFatherData();
            },
            onSelectListTap: function() {
                setTimeout(function() {
                    product.isDelete = false;
                    product.currSaleListIndex = -1;
                    product.isShowClassify = false;
                    product.isShowList = true;
                    product.isShowSales = true;
                    product.isShowDetail = false;
                    product.isClassify = false;
                    product.isAddProduct = false;
                    product.isShowSelect = false;
                    product.isShowRecycleSales = false;
                    product.isAddSpecifications = false;
                    product.isHasSpe = 0;
                    page = 0;
                    next = true;
                    product.salesList = [];
                    setTimeout(function() {
                        getProductData();
                    }, 500);
                }, 0);
            },
            // by weihao 2017-4-22 15:11:03
            selectList: function() {
                this.isDelete = false;
                this.currSaleListIndex = -1;
                this.isShowClassify = false;
                this.isShowList = true;
                this.isShowSales = true;
                this.isShowDetail = false;
                this.isClassify = false;
                this.isAddProduct = false;
                this.isShowSelect = false;
                this.isShowRecycleSales = false;
                this.isAddSpecifications = false;
                product.isHasSpe = 0;
                page = 0;
                next = true;
                this.salesList = [];
                getProductData();
            },
            onRecycleTap: function() {
                this.isDelete = true
                this.isShowClassify = false;
                this.isShowList = true;
                this.isShowSales = false;
                this.isShowRecycleSales = true;
                this.isShowDetail = false;
                this.isClassify = false;
                this.isAddProduct = false;
                this.isShowSelect = false;
                this.isAddSpecifications = false;
                product.isHasSpe = 0;
                deletePage = 0;
                deleteNext = true;
                this.recycleList = [];
                getProductData();
            },
            onAddFather: function() {
                api && api.openFrame({
                    name: 'addFatherProduct',
                    url: '../popupbox/addFatherProduct.html',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: windowHeight,
                    },
                    pageParam: {},
                });
            },
            onChildListTap: function(index) {
                if (this.fatherList[index].isShowChild == 0) {
                    Http.ajax({
                        data: {
                            loginname: UserInfo.loginname,
                            agentid: UserInfo.agentid,
                            staffid: UserInfo.staffid,
                            fcpid: this.fatherList[index].fatherID,
                            token: UserInfo.token,
                        },
                        isSync: true,
                        url: '/jiekou/agentht/procate/getProcate2.aspx',
                        success: function(ret) {
                            if (ret.zt == 1) {
                                var dt = ret;
                                product.fatherList[index].childList = getChildValue(dt);
                                product.fatherList[index].childList[0].isAdd = 1;
                                product.fatherList[index].isShowChild = 1;
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
                                product.fatherList[index].isShowChild = 1;
                                product.fatherList[index].childList = [{
                                    isEdit: 0,
                                    isAdd: 1,
                                    isEmpty: 1,
                                    childName: '',
                                    childID: '',
                                    fatherName: '',
                                    fatherID: '',
                                }];
                                _g.toast(ret.msg);
                            }
                        },
                        error: function(err) {}
                    });
                } else {
                    this.fatherList[index].isShowChild = 0;
                }
            },
            onAddChild: function(fatherIndex) {
                var father = _g.j2s(product.fatherList);
                api && api.openFrame({
                    name: 'addChildProduct',
                    url: '../popupbox/addChildProduct.html',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: windowHeight,
                    },
                    pageParam: {
                        fatherList: father,
                        fatherName: product.fatherList[fatherIndex].fatherName,
                        fatherID: product.fatherList[fatherIndex].fatherID,
                    },
                });
            },
            onShowFatherListTap: function() {
                if (this.isShowFatherList == true) {
                    this.isShowFatherList = false;
                } else {
                    this.isShowFatherList = true;
                }
            },
            onShowCLtap: function() {
                if (this.isShowChildProduct == true) {
                    this.isShowChildProduct = false;
                } else {
                    this.isShowChildProduct = true;
                }
            },
            onEditFatherTap: function(index) {
                this.fatherList[index].isEdit = 1;
            },
            onDeleteFatherTap: function(index) {
                if (this.fatherList[index]) {
                    api.confirm({
                        msg: '确定要删除所选父产品吗?',
                        buttons: ['取消', '确定']
                    }, function(ret, err) {
                        if (ret.buttonIndex == 2) {
                            deleteFather(index);
                        }
                    });
                } else {
                    return;
                }
            },
            onFatherSubmit: function(index) {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        fcpid: this.fatherList[index].fatherID,
                        fcpnc: this.fatherList[index].fatherName,
                        token: UserInfo.token,
                    },
                    url: '/jiekou/agentht/fathercate/editFathercate.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            getFatherData();
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
            },
            onDeletSpeTap: function(index) {
                if (this.fatherList[index]) {
                    api.confirm({
                        msg: '确定删除所选规格吗?',
                        buttons: ['取消', '确定']
                    }, function(ret, err) {
                        if (ret.buttonIndex == 2) {
                            deleteSpe(index);
                        }
                    });
                } else {
                    return;
                }
            },
            onCancelFatherSelect: function(index) {
                this.fatherList[index].isEdit = false;
                this.fatherList[index].fatherName = this.fatherList[index].fatherName2;
            },
            onDeleteChildTap: function(fatherIndex, childIndex) {
                if (this.fatherList[fatherIndex].childList[childIndex]) {
                    api.confirm({
                        msg: '确定删除所选规格吗?',
                        buttons: ['取消', '确定']
                    }, function(ret, err) {
                        if (ret.buttonIndex == 2) {
                            deleteChild(fatherIndex, childIndex);
                        }
                    });
                }
            },
            onEditChildTap: function(fatherIndex, childIndex) {
                this.fatherList[fatherIndex].childList[childIndex].isEdit = 1;
            },
            selectChange: function() {
                _.each(this.fatherList, function(n, i) {
                    if (product.fatherID == n.fatherID) {
                        product.fatherName = n.fatherName;
                    }
                });
            },
            procateidChange: function() {
                setTimeout(function() {
                    _.each(product.fatherList, function(n, i) {
                        if (product.productAdd.fatherID == n.fatherID) {
                            product.productAdd.fatherName = n.fatherName;
                            Http.ajax({
                                data: {
                                    loginname: UserInfo.loginname,
                                    agentid: UserInfo.agentid,
                                    staffid: UserInfo.staffid,
                                    fcpid: n.fatherID,
                                    token: UserInfo.token,
                                },
                                isSync: true,
                                url: '/jiekou/agentht/procate/getProcate2.aspx',
                                success: function(ret) {
                                    if (ret.zt == 1) {
                                        product.childClassify = getChildClassifyValue(ret);
                                        product.productDetail.cate = product.childClassify[0].childName;
                                        product.productAdd.childName = product.childClassify[0].childName;
                                        product.productAdd.childID = product.childClassify[0].childID;
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
                        } else {
                            product.productAdd.childName = '';
                        }
                    });
                }, 300);
            },
            procateidDetailChange: function() {
                _.each(this.fatherList, function(n, i) {
                    if (product.productDetail.fatherID == n.fatherID) {
                        product.productDetail.fatherName = n.fatherName;
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                fcpid: n.fatherID,
                                token: UserInfo.token,
                            },
                            isSync: true,
                            url: '/jiekou/agentht/procate/getProcate2.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    var dt = ret;
                                    product.childClassify = getChildClassifyValue(dt);
                                    product.productAdd.childName = product.childClassify[0].childName;
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
                        })
                    }
                });
            },
            priceUnitsChange: function() {
                _.each(this.price, function(n, i) {
                    if (product.productAdd.priceID == n.unitsID) {
                        product.productAdd.priceUnits = n.unitsName;
                    }
                });
            },
            childClassifyChange: function() {
                _.each(this.childClassify, function(n, i) {
                    if (product.productAdd.childID == n.childID) {
                        product.productAdd.childName = n.childName;
                    }
                });
            },
            childClassifyDetailChange: function() {
                _.each(this.childClassify, function(n, i) {
                    if (product.productDetail.cateid == n.childID) {
                        product.productDetail.cate = n.childName;
                    }
                });
            },
            priceUnitsDetailChange: function() {
                _.each(this.price, function(n, i) {
                    if (product.productDetail.dw_id == n.unitsID) {
                        product.productDetail.dw = n.unitsName;
                    }
                })
            },
            priceSpeChange: function() {
                _.each(this.price, function(n, i) {
                    if (product.speObject.valuationUnitID == n.unitsID) {
                        product.speObject.valuationUnit = n.unitsName;
                    }
                });
            },
            weightUnitsChange: function() {
                _.each(this.weight, function(n, i) {
                    if (product.productAdd.weightID == n.unitsID) {
                        product.productAdd.weightUnits = n.unitsName;
                    }
                });
            },
            weightSpeChange: function() {
                _.each(this.weight, function(n, i) {
                    if (product.speObject.weightUnitID == n.unitsID) {
                        product.speObject.weightUnit = n.unitsName;
                    }
                });
            },
            weightUnitDetailChange: function() {
                _.each(this.weight, function(n, i) {
                    if (product.productDetail.zldw_id == n.unitsID) {
                        product.productDetail.zldw = n.unitsName;
                    }
                });
            },
            onChildSubmit: function(fatherIndex, childIndex) {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        cateid: product.fatherList[fatherIndex].childList[childIndex].childID,
                        catename: product.fatherList[fatherIndex].childList[childIndex].childName,
                        fcpid: product.fatherList[fatherIndex].fatherID,
                        token: UserInfo.token,
                    },
                    url: '/jiekou/agentht/procate/editProcate.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            var dt = ret;
                            product.fatherList[fatherIndex].childList[childIndex].isEdit = 0;
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
            },
            onCancelChildSelect: function(fatherIndex, childIndex) {
                this.fatherList[fatherIndex].childList[childIndex].isEdit = 0;
                this.fatherList[fatherIndex].childList[childIndex].childName = this.fatherList[fatherIndex].childList[childIndex].childName2;
            },
            onDeleteTap: function(index) {
                // by weihao 2017-4-22 11:37:22
                api.confirm({
                    msg: '确定删除所选产品吗?',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if (ret.buttonIndex == 2) {
                        deleteProduct(index);
                    }
                });
                // return
                // if (this.fatherList[index]) {
                //     api.confirm({
                //         msg: '确定删除所选产品吗?',
                //         buttons: ['取消', '确定']
                //     }, function(ret, err) {
                //         if (ret.buttonIndex == 2) {
                //             deleteProduct(index);
                //         }
                //     });
                // } else {
                //     return;
                // }
            },
            onDeleteRecycleTap: function(index) {
                // by weihao 2017-4-24 10:06:32
                api.confirm({
                    msg: '确定删除所选产品吗?',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if (ret.buttonIndex == 2) {
                        deleteRecycle(index);
                    }
                });
                // if (this.fatherList[index]) {
                //     api.confirm({
                //         msg: '确定删除所选产品吗?',
                //         buttons: ['取消', '确定']
                //     }, function(ret, err) {
                //         if (ret.buttonIndex == 2) {
                //             deleteRecycle(index);
                //         }
                //     });
                // } else {
                //     return;
                // }
            },
            onRecoverDeleteTap: function(index) {
                // by weihao 2017-4-24 10:05:09
                api.confirm({
                    msg: '确定恢复所选产品吗?',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if (ret.buttonIndex == 2) {
                        recoverDele(index);
                    }
                });
                // if (this.fatherList[index]) {
                //     api.confirm({
                //         msg: '确定恢复所选产品吗?',
                //         buttons: ['取消', '确定']
                //     }, function(ret, err) {
                //         if (ret.buttonIndex == 2) {
                //             recoverDele(index);
                //         }
                //     });
                // } else {
                //     return;
                // }
            },
            onSelectCheckTap: function(index) {
                this.checkTop[this.checkIndex].isSelect = false;
                this.checkTop[0].isSelect = true;
                this.checkIndex = 0;
                product.turnPageIndex = 0;
                if (this.isFirstSelect == -1) {
                    product.salesList = [];
                    // product.isAddSpecifications = false;
                }
                if (index == 0) {
                    this.isStoreData = false;
                    Http.ajax({
                        data: {
                            loginname: UserInfo.loginname,
                            agentid: UserInfo.agentid,
                            staffid: UserInfo.staffid,
                            param: 1,
                            token: UserInfo.token,
                        },
                        isSync: true,
                        url: '/jiekou/agentht/product/updateProRank.aspx',
                        success: function(ret) {
                            if (ret.zt == 1) {
                                product.turnPageIndex = 1;
                                product.isDelete = 0;
                                product.isFirstSelect = 1;
                                product.isShowSales = true;
                                product.isAddProduct = false;
                                product.isShowRecycleSales = false;
                                product.isShowDetail = false;
                                page = 0;
                                next = true;
                                getProductData();
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
                                product.turnPageIndex = 1;
                                product.isDelete = 0;
                                page = 0;
                                next = true;
                                getProductData();
                            }
                        },
                        error: function(err) {}
                    });
                } else if (index == 1) {
                    this.isStoreData = false;
                    Http.ajax({
                        data: {
                            loginname: UserInfo.loginname,
                            agentid: UserInfo.agentid,
                            staffid: UserInfo.staffid,
                            param: 2,
                            token: UserInfo.token,
                        },
                        isSync: true,
                        url: '/jiekou/agentht/product/updateProRank.aspx',
                        success: function(ret) {
                            if (ret.zt == 1) {
                                product.turnPageIndex = 1;
                                product.isDelete = 0;
                                product.isFirstSelect = 1;
                                product.isShowSales = true;
                                product.isAddProduct = false;
                                product.isShowRecycleSales = false;
                                product.isShowDetail = false;
                                page = 0;
                                next = true;
                                getProductData();
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
                                product.turnPageIndex = 1;
                                product.isDelete = 0;
                                page = 0;
                                next = true;
                                getProductData();
                            }
                        },
                        error: function(err) {}
                    });
                } else if (index == 2) {
                    _g.showProgress();
                    this.currSelectIndex = index;
                    this.isStoreData = false;
                    if (allNext) {
                        allPage++;
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                param: 1,
                                pageIndex: allPage,
                                pageSize: 30,
                                token: UserInfo.token,
                            },
                            // isSync: true,
                            url: '/jiekou/agentht/product/saleRank.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    var dt = ret.data;
                                    product.isFirstSelect = 1;
                                    product.isShowSales = true;
                                    product.isAddProduct = false;
                                    product.isShowRecycleSales = false;
                                    product.isShowDetail = false;
                                    setTimeout(function() {
                                        if (!ret.data && allPage == 1) {
                                            allNext = false;
                                        } else if (ret.data && allPage >= 1) {
                                            allNext = true;
                                            var list = getProductValue(dt);
                                            if (product.salesList) {
                                                product.salesList = product.salesList.concat(list);
                                            } else {
                                                product.salesList = list;
                                            }
                                        } else if (!ret.data && allPage > 1) {
                                            _g.toast('没有多余数据');
                                            allNext = false;
                                        }
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
                                    allNext = false;
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {}
                        });
                        this.isAddSpecifications = false;
                    }
                } else if (index == 3) {
                    _g.showProgress();
                    this.currSelectIndex = index;
                    this.isStoreData = false;
                    if (monthNext) {
                        monthPage++;
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                pageIndex: monthPage,
                                pageSize: 30,
                                param: 2,
                                token: UserInfo.token,
                            },
                            // isSync: true,
                            url: '/jiekou/agentht/product/saleRank.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    var dt = ret.data;
                                    product.isFirstSelect = 1;
                                    product.isShowSales = true;
                                    product.isAddProduct = false;
                                    product.isShowRecycleSales = false;
                                    product.isShowDetail = false;
                                    setTimeout(function() {
                                        if (!ret.data && monthPage == 1) {

                                            monthNext = false;
                                        } else if (ret.data && monthPage >= 1) {

                                            monthNext = true;
                                            var list = getProductValue(dt);
                                            if (product.salesList) {

                                                product.salesList = product.salesList.concat(list);

                                            } else {

                                                product.salesList = list;
                                            }
                                        } else if (!ret.data && monthPage > 1) {
                                            _g.toast('没有多余数据');

                                            monthNext = false;
                                        }
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
                                    monthNext = false;
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {}
                        });
                        this.isAddSpecifications = false;
                    }
                } else if (index == 4) {
                    _g.showProgress();
                    this.currSelectIndex = index;
                    this.isStoreData = false;
                    if (weekNext) {
                        weekPage++;
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                pageIndex: weekPage,
                                param: 3,
                                pageSize: 30,
                                token: UserInfo.token,
                            },
                            // isSync: true,
                            url: '/jiekou/agentht/product/saleRank.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    var dt = ret.data;
                                    product.isFirstSelect = 1;
                                    product.isShowSales = true;
                                    product.isAddProduct = false;
                                    product.isShowRecycleSales = false;
                                    product.isShowDetail = false;
                                    setTimeout(function() {
                                        if (!ret.data && weekPage == 1) {
                                            weekNext = false;
                                        } else if (ret.data && weekPage >= 1) {
                                            weekNext = true;
                                            var list = getProductValue(dt);
                                            if (product.salesList) {
                                                product.salesList = product.salesList.concat(list);
                                            } else {
                                                product.salesList = list;
                                            }
                                        } else if (!ret.data && weekPage > 1) {
                                            _g.toast('没有多余数据');
                                            weekNext = false;
                                        }
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
                                    weekNext = false;
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {}
                        });
                        this.isAddSpecifications = false;
                    }
                } else if (index == 5) {
                    _g.showProgress();
                    this.currSelectIndex = index;
                    this.isStoreData = true;
                    if (storeNext) {
                        storPage++;
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                pageIndex: storPage,
                                pageSize: 30,
                                token: UserInfo.token,
                            },
                            // isSync: true,
                            url: '/jiekou/agentht/product/kcRank.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    var dt = ret.data;
                                    product.isFirstSelect = 1;
                                    product.isShowSales = true;
                                    product.isAddProduct = false;
                                    product.isShowRecycleSales = false;
                                    product.isShowDetail = false;
                                    setTimeout(function() {
                                        if (!ret.data && storPage == 1) {
                                            storeNext = false;
                                        } else if (ret.data && storPage >= 1) {
                                            storeNext = true;
                                            var list = getProductValue(dt);
                                            if (product.salesList) {
                                                product.salesList = product.salesList.concat(list);
                                            } else {
                                                product.salesList = list;
                                            }
                                        } else if (!ret.data && storPage > 1) {
                                            _g.toast('没有多余数据');
                                            storeNext = false;
                                        }
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
                                    storeNext = false;
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {}
                        });
                        this.isAddSpecifications = false;
                    }
                }
                this.isShowSelect = false;
                // this.isAddSpecifications = false;
            },
            onAddProductTap: function() {
                this.isOpenProductDetail = false;
                this.isAddProduct = true;
                this.isShowSales = false;
                this.isShowDetail = false;
                this.isShowSelect = false;
                this.isShowRecycleSales = false;
                this.isAddSpecifications = false;
                product.isHasSpe = 0;
                product.turnPageIndex = -1;
                getWeightData();
                getPriceData();
            },
            /**
            onUploadMinTap: function(type) {
                if (this.isProductEdit && type == 'detailMin') {
                    _g.toast('请点击编辑商品');
                    return;
                } else {
                    _g.openPicActionSheet({
                        allowEdit: true,
                        suc: function(res) {
                            fs.getAttribute({
                                path: res.data
                            }, function(ret, err) {
                                if (ret.status) {
                                    // alert(JSON.stringify(ret));
                                    if (ret.attribute.size > 500 * 1024) {
                                        _g.toast('您所上传的图片超过500kb,请重新上传');
                                        return;
                                    }
                                } else {
                                    alert(JSON.stringify(err));
                                }
                            });
                            api.ajax({
                                url: CONFIG.HOST + '/jiekou/agentht/activity/editImage.aspx',
                                method: 'post',
                                data: {
                                    values: {
                                        loginname: UserInfo.loginname,
                                        agentid: UserInfo.agentid,
                                        staffid: UserInfo.staffid,
                                        token: UserInfo.token,
                                        param: 2,
                                    },
                                    files: {
                                        img_tx: res.data,
                                    }
                                }
                            }, function(ret, err) {
                                if (ret.zt == 1) {
                                    var dt = ret.tx;
                                    if (type == 'detailMin') {
                                        product.productDetail.image1 = dt;
                                        _g.toast(ret.msg);
                                    } else if (type == 'addMin') {
                                        product.productAdd.minImage = dt;
                                        _g.toast(ret.msg);
                                    }
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
                            });
                        }
                    });
                }
            },
            **/
            onUploadMaxTap: function(type) {
                if (this.isProductEdit && type == 'detailMax') {
                    _g.toast('请点击编辑商品');
                    return;
                } else {
                    _g.openPicActionSheet({
                        allowEdit: true,
                        suc: function(res) {
                            fs.getAttribute({
                                path: res.data
                            }, function(ret, err) {
                                if (ret.status) {
                                    // alert(JSON.stringify(ret));
                                    if (ret.attribute.size > 500 * 1024) {
                                        _g.toast('您所上传的图片超过500kb,请重新上传');
                                        return;
                                    }
                                } else {
                                    alert(JSON.stringify(err));
                                }
                            });
                            api.ajax({
                                url: CONFIG.HOST + '/jiekou/agentht/activity/editImage.aspx',
                                method: 'post',
                                data: {
                                    values: {
                                        loginname: UserInfo.loginname,
                                        agentid: UserInfo.agentid,
                                        staffid: UserInfo.staffid,
                                        token: UserInfo.token,
                                        param: 3,
                                    },
                                    files: {
                                        img_tx: res.data,
                                    }
                                }
                            }, function(ret, err) {
                                if (ret.zt == 1) {
                                    var dt = ret.tx;
                                    if (type == 'addMax') {
                                        product.productAdd.maxImage = dt;
                                        product.productAdd.minImage = dt;
                                        _g.toast(ret.msg);
                                    } else if (type == 'detailMax') {
                                       product.productDetail.image2 = dt;
                                       product.productDetail.image1 = dt;
                                        _g.toast(ret.msg);
                                    }
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
                            });
                        }
                    });
                }
            },
            startTimeChange: function() {
                if (_g.isAndroid) {
                    this.productAdd.time1 = this.startTime.replace('T', ' ') + ':00';
                    this.productDetail.time1 = this.startTime.replace('T', ' ') + ':00';
                    if (this.productAdd.time1 == ':00') {

                        this.productAdd.time1 = null;
                    }
                    if (this.productDetail.time1 == ':00') {

                        this.productDetail.time1 = null;
                    }
                }
            },
            endTimeChange: function() {
                if (_g.isAndroid) {
                    this.productAdd.time2 = this.endTime.replace('T', ' ') + ':00';
                    this.productDetail.time2 = this.endTime.replace('T', ' ') + ':00';
                    if (this.productAdd.time2 == ':00') {

                        this.productAdd.time2 = null;
                    }
                    if (this.productDetail.time2 == ':00') {

                        this.productDetail.time2 = null;
                    }
                } else {
                    this.productAdd.time2 = this.endTime.replace('T', ' ');
                    this.productDetail.time2 = this.endTime.replace('T', ' ');
                }
            },
            onSubmitAddProductTap: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        name: this.productAdd.productName, //产品名称
                        procateid: this.productAdd.childID, //子产品类别id
                        marketprice: this.productAdd.marketPrice, //市场价
                        price: this.productAdd.productPrice, //价格
                        descibe: this.productAdd.describe, //产品描述
                        weight1: this.productAdd.minWeight, //小重量
                        weight2: this.productAdd.maxWeight, //大重量
                        place: this.productAdd.place, //产地
                        procount: this.productAdd.procount, //库存量
                        image1: this.productAdd.minImage, //产品小图
                        image2: this.productAdd.maxImage, //产品大图
                        xgsl: this.productAdd.limitAmount, // 限购数量
                        dw_id: this.productAdd.priceID, // 计价单位id
                        costprice: this.productAdd.costPrice, // 成本价
                        ptnum: this.productAdd.productNum, //产品编号
                        ishot: changeData(this.productAdd.isHot), //是否为热卖（ 1 是， 0 否）
                        istop: changeData(this.productAdd.isTop), // 是否置顶（ 1 是， 0 否）
                        isweight: changeData(this.productAdd.isWeight), //是否论斤显示（ 1 是， 0 否）
                        ptbrand: this.productAdd.productBrand, //产品品牌名
                        rank: this.productAdd.rank, //产品序列号
                        zldw_id: this.productAdd.weightID, //重量单位id
                        issale: changeData(this.productAdd.isSales), //是否为特价（ 0 否， 1 是）
                        isnew: changeData(this.productAdd.isNew), //是否为新品（ 0 否， 1 是）
                        istime: changeData(this.productAdd.isTimeLimit), //是否限时（ 0 否， 1 是）
                        time1: this.productAdd.time1, //开始时间
                        time2: this.productAdd.time2, // 结束时间
                        fathercateid: this.productAdd.fatherID //新的需求传递的子产品ID和父产品ID字段
                    },
                    url: '/jiekou/agentht/product/addProduct.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            product.productID = ret.data.productid;
                            product.isHasSpe = 1;
                            //进入详情
                            product.isOpenProductDetail = true;
                            product.turnPageIndex = -1;
                            Http.ajax({
                                data: {
                                    loginname: UserInfo.loginname,
                                    agentid: UserInfo.agentid,
                                    staffid: UserInfo.staffid,
                                    productid: product.productID,
                                    token: UserInfo.token,
                                },
                                isSync: true,
                                url: '/jiekou/agentht/product/getProductDetail.aspx',
                                success: function(ret) {
                                    if (ret.zt == 1) {
                                        var dt = ret.data;
                                        if (dt.ischeck == 2)
                                            product.ischeckDetail = true;
                                        // product.chooseIndex = index;
                                        getProductDetailValue(dt);
                                        product.isShowSales = false;
                                        product.isShowDetail = true;
                                        product.isShowSelect = false;
                                        product.isHasSpe = 1;
                                        product.isAddProduct = false;
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
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            },
            onSalesDetailTap: function(index) {
                this.isOpenProductDetail = true;
                this.currSaleListIndex = index;
                this.productID = null;
                product.turnPageIndex = -1;
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        productid: this.salesList[index].productID,
                        token: UserInfo.token,
                    },
                    isSync: true,
                    url: '/jiekou/agentht/product/getProductDetail.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            var dt = ret.data;
                            if (dt.ischeck == 2)
                                product.ischeckDetail = true;
                                product.chooseIndex = index;
                                getProductDetailValue(dt);
                                product.isShowSales = false;
                                product.isShowDetail = true;
                                product.isShowSelect = false;
                                product.isHasSpe = 1;
                                setTimeout(function () {
                                    moveEnd($('#ProductName')[0]);
                                }, 100);
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
            },
            onQueryTap: function() {
                headerHeight = _g.getLS('appH').header;
                api && api.openFrame({
                    name: 'searchProduct',
                    url: '../product/searchProduct.html',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: windowHeight,
                    },
                });
            },
            onSortTap: function(e) {
                if (this.isShowSelect == false) {
                    this.isShowSelect = true;
                    this.isFirstSelect = -1;
                    allNext = true;
                    allPage = 0;
                    monthNext = true;
                    monthPage = 0;
                    weekNext = true;
                    weekPage = 0;
                    storeNext = true;
                    storPage = 0;
                } else {
                    this.isShowSelect = false;
                }
            },
            onAddSpecifications: function() {
                // this.speObject = {};
                if (this.isHasSpe == 1) {
                    // addSpe();

                    this.isAddSpecifications = true;
                    setTimeout(function() {
                        document.getElementById("addSpe").scrollIntoView();
                    }, 200);

                } else {
                    _g.toast('请先添加商品信息!');
                }
            },
            onEditProductTap: function() {
                this.isProductEdit = false;
                _g.toast('现在可以编辑商品了');
            },
            onSaveProductTap: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        productid: this.salesList[this.chooseIndex].productID, //产品id
                        name: this.productDetail.productName, //产品名称
                        cateid: this.productDetail.cateid, //子产品类别id
                        marketprice: this.productDetail.marketprice, //市场价
                        price: this.productDetail.price, //价格
                        // descibe: this.productDetail.descibe, //产品描述
                        weight1: this.productDetail.weight1, //小重量
                        weight2: this.productDetail.weight2, //大重量
                        place: this.productDetail.place, //产地
                        procount: this.productDetail.procount, //库存量
                        image1: this.productDetail.image1, //产品小图
                        image2: this.productDetail.image2, //产品大图
                        xgsl: this.productDetail.xgsl, //限购数量
                        dw_id: this.productDetail.dw_id, //计价单位id
                        costprice: this.productDetail.costprice, //成本价
                        ptnum: this.productDetail.ptnum, //产品编号
                        ishot: changeData(this.productDetail.ishot), //是否为热卖（ 1 是， 0 否）
                        istop: changeData(this.productDetail.istop), //是否置顶（ 1 是， 0 否）
                        isweight: changeData(this.productDetail.isweight), //是否论斤显示（ 1 是， 0 否）
                        ptbrand: this.productDetail.ptbrand, //产品品牌名
                        rank: this.productDetail.rank, //产品序列号
                        zldw_id: this.productDetail.zldw_id, //重量单位id
                        issale: changeData(this.productDetail.issale), //是否为特价（ 0 否， 1 是）
                        isnew: changeData(this.productDetail.isnew), //是否为新品（ 0 否， 1 是）
                        istime: changeData(this.productDetail.istime), //是否限时（ 0 否， 1 是）
                        time1: this.productDetail.time1, //开始时间
                        time2: this.productDetail.time2, //结束时间
                        fathercateid: this.productDetail.fatherID //新的需求传递的子产品ID和父产品ID字段
                    },
                    isSync: true,
                    url: '/jiekou/agentht/product/editProdect.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {

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
                product.isProductEdit = true;
            },
            onSaveSpe: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        productid: this.productID || this.salesList[this.currSaleListIndex].productID,
                        price: this.speObject.price,
                        weight1: this.speObject.weight1,
                        weight2: this.speObject.weight2,
                        procount: this.speObject.stock,
                        xgsl: this.speObject.limitAmount,
                        dw_id: this.speObject.valuationUnitID,
                        zldw_id: this.speObject.weightUnitID,
                        marketprice: this.speObject.marketPrice,
                        costprice: this.speObject.costPrice,
                    },
                    isSync: true,
                    url: '/jiekou/agentht/product/addGG.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            product.isAddSpecifications = false;
                            product.speList = [];
                            if (product.salesList[product.currSaleListIndex]) {
                                if (product.salesList[product.currSaleListIndex].productID) {
                                    product.onSalesDetailTap(product.currSaleListIndex);
                                }
                            } else {
                                // product.onSalesDetailTap(product.productID);
                                Http.ajax({
                                    data: {
                                        loginname: UserInfo.loginname,
                                        agentid: UserInfo.agentid,
                                        staffid: UserInfo.staffid,
                                        productid: product.productID,
                                        token: UserInfo.token,
                                    },
                                    isSync: true,
                                    url: '/jiekou/agentht/product/getProductDetail.aspx',
                                    success: function(ret) {
                                        if (ret.zt == 1) {
                                            var dt = ret.data;
                                            if (dt.ischeck == 2)
                                                product.ischeckDetail = true;
                                                getProductDetailValue(dt);
                                                product.isShowSales = false;
                                                product.isShowDetail = true;
                                                product.isShowSelect = false;
                                                product.isHasSpe = 1;
                                                setTimeout(function () {
                                                    moveEnd($('#ProductName')[0]);
                                                }, 100);
                                        } else {
                                            _g.toast(ret.msg);
                                        }
                                    },
                                    error: function(err) {}
                                });
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
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) { _g.toast(ret.msg); }
                });
            },
            onCancelSpe: function() {
                product.isAddSpecifications = false;
                product.speObject = {
                    price: '', //价格
                    weight1: '', //重量
                    weight2: '', //重量
                    stock: '', //库存
                    limitAmount: '', //限购数量
                    valuationUnit: '', //计价单位
                    valuationUnitID: '', //计价单位id
                    weightUnit: '', //重量单位
                    weightUnitID: '', //重量单位id
                    marketPrice: '', //市场价
                    costPrice: '', //成本价
                };
            }
        },
        filters: {
            'trans-date': function(time) {
                var date = new Date(time);
                date.Format("yyyy-MM-dd hh:mm:ss");
                return date;
            }
        }
    });
    function moveEnd(obj){
        obj.focus();
        var len = obj.value.length;
        if (document.selection) {
            var sel = obj.createTextRange();
            sel.moveStart('character',len); //设置开头的位置
            sel.collapse();
            sel.select();
        } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
            obj.selectionStart = obj.selectionEnd = len;
        }
    }
    var getFatherData = function() {
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
                        product.fatherList = getFatherValue(dt);
                        product.productAdd.fatherID = product.fatherList[0].fatherID;
                        product.productAdd.fatherName = product.fatherList[0].fatherName;
                        setTimeout(function() {
                            product.procateidChange();
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
                getChildData();
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
                fatherName2: object['father_' + i + '_name'] || '',
                isEdit: 0,
                isShowChild: 0,
                childList: [],
            })
        }
        return list;
    }
    var deleteFather = function(index) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                fcpid: product.fatherList[index].fatherID,
                token: UserInfo.token,
            },
            isSync: true,
            url: '/jiekou/agentht/fathercate/deleteFathercate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    getFatherData();
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
                    getFatherData();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    var deleteRecycle = function(index) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                productid: product.recycleList[index].productID,
                token: UserInfo.token,
                operate: 2,
            },
            isSync: true,
            url: '/jiekou/agentht/product/deleteProduct2.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        product.onRecycleTap();
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
                    getProductData();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }

    var recoverDele = function(index) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                productid: product.recycleList[index].productID,
                token: UserInfo.token,
                operate: 1,
            },
            isSync: true,
            url: '/jiekou/agentht/product/deleteProduct2.aspx',
            success: function(ret) {

                if (ret.zt == 1) {
                    // setTimeout(function() {
                    //     product.onRecycleTap();
                    // }, 0);
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
                    product.recycleList = [];
                    deleteNext = true;
                    deletePage = 0;
                    getProductData();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    var getChildData = function() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            url: '/jiekou/agentht/procate/getProcate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret;
                    product.childList = getChildValue(dt);
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
    var getChildValue = function(result) {
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
    var getChildClassifyValue = function(result) {
        var object = result.cates || {};
        var amount = result.catesl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                childName: object['cate_' + i + '_nc'] || '',
                childID: object['cate_' + i + '_id'] || '',
                fatherName: object['cate_' + i + '_fnc'] || '',
                fatherID: object['cate_' + i + '_fcpid'] || '',
            })
        }
        return list;
    }
    var deleteChild = function(fatherIndex, childIndex) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                cateid: product.fatherList[fatherIndex].childList[childIndex].childID,
                token: UserInfo.token,
            },
            isSync: true,
            url: '/jiekou/agentht/procate/deleteProcate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        getFatherData();
                    }, 200);
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
                    setTimeout(function() {
                        getFatherData();
                    }, 200);
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    var getProductData = function() {
        var status = 0;
        if (product.checkIndex == 0) {
            status = 1;
        } else if (product.checkIndex == 1) {
            status = 0;
        } else if (product.checkIndex == 2) {
            status = 2;
        }
        product.turnPageIndex = 1;
        if (product.isDelete) {
            if (deleteNext) {
                deletePage++;
                _g.showProgress();
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        pageIndex: deletePage,
                        isdelete: 1,
                        pageSize: 30,
                        token: UserInfo.token,
                    },
                    lock: false,
                    // isSync: true,
                    url: '/jiekou/agentht/product/getProduct.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            var dt = ret.data;
                            getWeightData();
                            setTimeout(function() {
                                if (!ret.data && deletePage == 1) {
                                    deleteNext = false;
                                } else if (ret.data && deletePage >= 1) {
                                    deleteNext = true;
                                    var list = getProductValue(dt);
                                    if (product.recycleList) {
                                        product.recycleList = product.recycleList.concat(list);
                                    } else {
                                        product.recycleList = list;
                                    }
                                } else if (!ret.data && deletePage > 1) {
                                    _g.toast('没有更多数据');
                                    deleteNext = false;
                                }
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
                            deleteNext = false;
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            }
        } else {
            if (next) {
                _g.showProgress();
                page++;
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        pageIndex: page,
                        isdelete: 0,
                        pageSize: 30,
                        token: UserInfo.token,
                        status: status,
                    },
                    // isSync: true,
                    url: '/jiekou/agentht/product/getProduct.aspx',
                    success: function(ret) {
                        if (ret.zt == 1) {
                            var dt = ret.data;
                            getWeightData();
                            setTimeout(function() {
                                if (!ret.data && page == 1) {
                                    next = false;
                                } else if (ret.data && page >= 1) {
                                    next = true;
                                    var list = getProductValue(dt);
                                    if (product.salesList) {
                                        product.salesList = product.salesList.concat(list);
                                    } else {
                                        product.salesList = list;
                                    }
                                } else if (!ret.data && page > 1) {
                                    _g.toast('没有多余数据');
                                    next = false;
                                }
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
                            next = false;
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {}
                });
            }
        }
    }
    var getProductValue = function(result) {
        var object = result.products || {};
        var amount = result.productsl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                productID: object['pro_' + i + '_id'] || '', // 产品id
                productName: object['pro_' + i + '_nc'] || '', // 产品名称
                productType: object['pro_' + i + '_lb'] || '', // 产品类别
                totalSalesAmount: object['pro_' + i + '_zxl'] || '', // 总销量
                monthSalesAmount: object['pro_' + i + '_yxl'] || '', // 月销量
                weekSalesAmount: object['pro_' + i + '_yzxl'] || '', // 周销量
                marketPrice: object['pro_' + i + '_scj'] || 0, // 市场价
                price: object['pro_' + i + '_je'] || 0, // 价格
                cost: object['pro_' + i + '_cbj'] || '', // 成本价
                storedValue: object['pro_' + i + '_kcjz'] || 　0, //库存价值
                storedAmount: object['pro_' + i + '_kcsl'] || 0, // 库存数量
                weightUnit: object['pro_' + i + '_zldw'] || 　'', //重量单位
                weightRange: object['pro_' + i + '_zlfw'] || '', // 重量范围
                singleWeight: object['pro_' + i + '_gg'] || '', // 单价重量
            })
        }
        return list;
    }
    var deleteProduct = function(index) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                productid: product.salesList[index].productID,
                token: UserInfo.token,
            },
            isSync: true,
            url: '/jiekou/agentht/product/deleteProduct.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    product.salesList = [];
                    next = true;
                    page = 0;
                    getProductData();
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
                    getProductData();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    var getWeightData = function() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            url: '/jiekou/agentht/product/findZldw.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret;
                    product.weight = getWeightValue(dt);
                    getPriceData();
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
                }
            },
            error: function(err) {}
        });
    }
    var getWeightValue = function(result) {
        var object = result.zldws || {};
        var amount = result.zldwsl || 0;
        var list = [{unitsID: '',unitsName: '',}];
        for (var i = 1; i <= amount; i++) {
            list.push({
                unitsID: object['zldw_' + i + '_id'] || '',
                unitsName: object['zldw_' + i + '_name'] || '',
            })
        }
        return list;
    }
    var getPriceData = function() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            url: '/jiekou/agentht/product/findDw.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret;
                    product.price = getPriceValue(dt);
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
    var getPriceValue = function(result) {
        var object = result.dws || {};
        var amount = result.dwsl || 0;
        var list = [{unitsID: '',unitsName: '',}];
        for (var i = 1; i <= amount; i++) {
            list.push({
                unitsID: object['dw_' + i + '_id'] || '',
                unitsName: object['dw_' + i + '_name'] || '',
            })
        }
        return list;
    }
    var getProductDetailValue = function(result) {
        var object = result || {};
        product.productDetail.productName = object.name || ''; //产品名称
        product.productDetail.fatherID = object.fathercateid || ''; //父产品类别id
        product.productDetail.fatherName = fatherChangToName(object.fathercateid) || ''; //父产品类别名字
        product.productDetail.cateid = object.cateid || ''; //子产品类别id
        product.productDetail.cate = changToName(object.cateid) || ''; //子产品类别名字
        product.productDetail.marketprice = object.marketprice || ''; // 市场价
        product.productDetail.price = object.price || ''; // 价格
        product.productDetail.descibe = object.descibe || ''; // 产品描述
        product.productDetail.weight1 = object.weight1 || ''; // 小重量
        product.productDetail.weight2 = object.weight2 || ''; // 大重量
        product.productDetail.place = object.place || ''; // 产地
        product.productDetail.procount = object.procount || ''; // 库存量
        product.productDetail.image1 = object.image1 || ''; // 产品小图
        product.productDetail.image2 = object.image2 || ''; // 产品大图
        product.productDetail.xgsl = object.xgsl || ''; // 限购数量
        product.productDetail.dw_id = object.dw_id || ''; // 计价单位id
        product.productDetail.dw = priceIDtoName(object.dw_id) || ''; // 计价单位
        product.productDetail.costprice = object.costprice || ''; // 成本价
        product.productDetail.ptnum = object.ptnum || ''; // 产品编号
        product.productDetail.ishot = changeData(object.ishot) || ''; // 是否为热卖（ 1 是， 0 否）
        product.productDetail.istop = changeData(object.istop) || ''; // 是否置顶（ 1 是， 0 否）
        product.productDetail.isweight = changeData(object.isweight) || ''; // 是否论斤显示（ 1 是， 0 否）
        product.productDetail.ptbrand = object.ptbrand || ''; // 产品品牌名
        product.productDetail.rank = object.rank || ''; // 产品序列号
        product.productDetail.zldw_id = object.zldw_id || ''; // 重量单位id
        product.productDetail.zldw = weightIDtoName(object.zldw_id) || ''; // 重量单位
        product.productDetail.issale = changeData(object.issale) || ''; // 是否为特价（ 0 否， 1 是）
        product.productDetail.isnew = changeData(object.isnew) || ''; // 是否为新品（ 0 否， 1 是）
        product.productDetail.istime = changeData(object.istime) || ''; // 是否限时（ 0 否， 1 是）
        product.productDetail.time1 = object.time1 || ''; // 开始时间
        product.productDetail.time2 = object.time2 || ''; // 结束时间
        product.productDetail.ggsl = object.ggsl || ''; // 规格数量
        product.productDetail.unpassReason = object.reason || '' // 未通过理由
        product.productDetail.ggs = getSpeData(object);
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
    var deleteSpe = function(index) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                ggid: product.productDetail.ggs[index].ggid,
            },
            isSync: true,
            url: '/jiekou/agentht/product/deleteGG.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    product.onSalesDetailTap(product.currSaleListIndex);
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
                }
            }
        });
    }
    var changeData = function(result) {
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
        //子类转名字
    var changToName = function(result) {
            var res;
            _.each(product.childList, function(n, i) {

                if (result == n.childID) {
                    res = n.childName;
                }
            });
            return res;
        }
        //父类转名字
    var fatherChangToName = function(result) {
        var res;
        _.each(product.fatherList, function(n, i) {

            if (result == n.fatherID) {
                res = n.fatherName;
            }
        });
        return res;
    }
    var weightIDtoName = function(result) {
        var res;
        _.each(product.weight, function(n, i) {
            if (result == n.unitsID) {
                res = n.unitsName;
            }
        });
        return res;
    }
    var priceIDtoName = function(result) {
        var res;
        _.each(product.price, function(n, i) {
            if (result == n.unitsID) {
                res = n.unitsName;
            }
        });
        return res;
    }
    function searchClass() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: 20,
                kind: product.kind,
                condition: product.classID,
            },
            isSync: true,
            url: '/jiekou/agentht/product/searchProductcate.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret.data;
                    if(pageIndex == 1) {
                        product.salesList = getProductValue(dt);
                    } else {
                        product.salesList = product.salesList.concat(getProductValue(dt));
                    }
                    product.isShowSales = true;
                    product.isAddProduct = false;
                    product.isShowRecycleSales = false;
                    product.isShowDetail = false;
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
    // 产品id或产品名称查找
    function searchProduct() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: 20,
                param: product.searchContent,
            },
            isSync: true,
            url: '/jiekou/agentht/product/searchProduct.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret.data;
                    if(pageIndex == 1) {
                        product.salesList = getProductValue(dt);
                    } else {
                        product.salesList = product.salesList.concat(getProductValue(dt));
                    }
                    product.isShowSales = true;
                    product.isAddProduct = false;
                    product.isShowRecycleSales = false;
                    product.isShowDetail = false;
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
    // function addSpe() {
    //     var entity = {
    //         title: '添加规格',
    //         price: '价格',
    //         weight: '重量',
    //         Stock: '库存',
    //         limitAmount: '限购数量',
    //         valuationUnit: '计价单位',
    //         weightUnit: '重量单位',
    //         marketPrice: '市场价',
    //         costPrice: '成本价',
    //         save: '保存',
    //     };
    //     product.speList = product.speList.concat(entity);
    // }

    getFatherData();
    getProductData();
    api.addEventListener({
        name: 'product-dataReresh'
    }, function(ret, err) {
        if (ret.value.data == 'father') {
            getFatherData();
        } else if (ret.value.data == 'child') {
            getFatherData();
        }
    });
    // 通过id和名字搜索
    api.addEventListener({
        name: 'search-product',
    }, function(ret, err) {
        pageIndex = 1;
        product.isSearch = 2;
        product.searchContent = ret.value.content;
        searchProduct();
    });
    // 通过父子类搜索
    api.addEventListener({
        name: 'product-product-searchClass',
    }, function(ret, err) {
        product.isSearch = 1;
        pageIndex = 1;
        product.classID = ret.value.classID;
        if(ret.value.type == 'father') {
            product.kind = 4;
        } else {
            product.kind = 5;
        }
        searchClass();
    });
    api.addEventListener({
        name: 'scrolltobottom',
    }, function(ret, err) {
        if(product.isSearch == 1) {
            pageIndex ++;
            searchClass();
        } else if(product.isSearch == 2) {
            pageIndex ++;
            searchProduct();
        } else {
            if (product.turnPageIndex == 1) {
                getProductData();
            } else if (product.turnPageIndex == 0) {
                product.onSelectCheckTap(product.currSelectIndex);
            } else {
                return;
            }
        }
    });
    api.addEventListener({
        name: 'backToList'
    }, function(ret, err) {
        if (product.isShowDetail == true) {
            product.selectList();
        } else {
            api.closeWin();
        }
    });

    module.exports = {};

});
