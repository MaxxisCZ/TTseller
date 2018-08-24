define(function(require, exports, module) {
    var periodSelector = api.require('periodSelector');
    var Http = require('U/http');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var sNext = true;
    var sPage = 0;
    var tNext = true;
    var tPage = 0;
    var vNext = true;
    var vPage = 0;
    var UserInfo = _g.getLS("UserInfo");
    var distribution = new Vue({
        el: '#content',
        template: _g.getTemplate('distribution/distribution-body-V'),
        data: {
            isNetwork: false,
            isSelect1: true,
            isSelect2: false,
            isSelect3: false,
            checkIndex: 0,
            villageName: '',
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
            shopperList: [{
                shopperID: '1',
                shopperName: '小工',
                shopperPhone: 1231231231,

            }, {
                shopperID: '1',
                shopperName: '小工',
                shopperPhone: 1231231231,

            }, {
                shopperID: '1',
                shopperName: '小工',
                shopperPhone: 1231231231,

            }, ],
            timeList: [{
                timeID: '1',
                timePeriod: '2-3',

            }, {
                timeID: '2',
                timePeriod: '3-4',

            }, {
                timeID: '3',
                timePeriod: '4-5',

            }, ],
            villagesList: [{
                villagesID: '1',
                villagesName: '大学城',
                villagesFirstLetter: '',
            }, {
                villagesID: '1',
                villagesName: '大学城',
                villagesFirstLetter: '',
            }, {
                villagesID: '1',
                villagesName: '大学城',
                villagesFirstLetter: 'V',
            }, ]
        },
        created: function() {
            this.shopperList = [];
            this.timeList = [];
            this.villagesList = [];
        },
        methods: {
            onChangeTap1: function(index) {
                setTimeout(function() {
                    distribution.villageName = '';
                    distribution.shopperList = [];
                    distribution.timeList = [];
                    distribution.villagesList = [];
                    sNext = true;
                    sPage = 0;
                    distribution.isSelect1 = true;
                    distribution.isSelect2 = false;
                    distribution.isSelect3 = false;
                    getShopperData();
                }, 0);
            },
            onChangeTap2: function(index) {
                setTimeout(function() {
                    distribution.villageName = '';
                    distribution.shopperList = [];
                    distribution.timeList = [];
                    distribution.villagesList = [];
                    tNext = true;
                    tPage = 0;
                    distribution.isSelect1 = false;
                    distribution.isSelect2 = true;
                    distribution.isSelect3 = false;
                    getTimeData();
                }, 0);
            },
            onChangeTap3: function(index) {
                setTimeout(function() {
                    distribution.villageName = '';
                    // distribution.shopperList = [];
                    // distribution.timeList = [];
                    // distribution.villagesList = [];
                    vNext = true;
                    vPage = 0;
                    distribution.isSelect1 = false;
                    distribution.isSelect2 = false;
                    distribution.isSelect3 = true;
                    getVillageData();
                }, 0);
            },
            onCheckTap: function(index) {
                distribution.villageName = '';
                this.checkTop[this.checkIndex].isSelect = false;
                this.checkTop[index].isSelect = true;
                this.checkIndex = index;
                if(index == 0) {
                    this.isCheck = true;
                } else {
                    this.isCheck = false;
                }
                vNext = true;
                vPage = 0;
                // distribution.villagesList = [];
                setTimeout(function() {
                    getVillageData();
                }, 500);
            },
            onSearchTap: function() {
                if(this.villageName == '') {
                    alert('请输入要搜索关键字');
                    return
                } else {
                    vNext = true;
                    vPage = 0;
                    // distribution.villagesList = [];
                    setTimeout(function() {
                        searchData();
                    }, 500);
                }
            },
            onDeleteStaffTap: function(index) {
                api.confirm({
                    title: '注意',
                    msg: '确定删除该配送员',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if(ret.buttonIndex == 2) {
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                token: UserInfo.token,
                                shopperid: distribution.shopperList[index].shopperID,
                            },
                            url: '/jiekou/agentht/distribution/deleteShopper.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    sPage = 0;
                                    // distribution.shopperList = [];
                                    getShopperData();
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
                                    // getShopperData();
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {}
                        });
                    }
                });
            },
            onDeleteTimeTap: function(index) {
                api.confirm({
                    title: '注意',
                    msg: '确定删除该时段',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if(ret.buttonIndex == 2) {
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                token: UserInfo.token,
                                timeid: distribution.timeList[index].timeID
                            },
                            url: '/jiekou/agentht/distribution/deleteTime.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    tPage = 0;
                                    // distribution.timeList = [];
                                    getTimeData();
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
                                    // getTimeData();
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {}
                        });
                    }
                });
            },
            onDeleteVillagesTap: function(index) {
                api.confirm({
                    title: '注意',
                    msg: '确定删除该小区',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if(ret.buttonIndex == 2) {
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                token: UserInfo.token,
                                villageid: distribution.villagesList[index].villagesID,
                            },
                            url: '/jiekou/agentht/distribution/deleteVillage.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    vPage = 0;
                                    // distribution.villagesList = [];
                                    getVillageData();
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
                                    // getVillageData();
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {}
                        });
                    }
                });
            },
            onShopperDetailTap: function(index) {
                api && api.openFrame({
                    name: 'popupbox-shopperDetail',
                    url: '../popupbox/shopperDetail.html',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: windowHeight,
                    },
                    pageParam: {
                        shopperID: this.shopperList[index].shopperID,
                    }
                });
                // alert(this.shopperList[index].shopperID);
            },
            onTimeDetailTap: function(index) {
                api && api.openFrame({
                    name: 'popupbox-timeDetail',
                    url: '../popupbox/timeDetail.html',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: windowHeight,
                    },
                    pageParam: {
                        timeID: this.timeList[index].timeID,
                    }
                });
            },
            onVillagesDetailTap: function(index) {
                var unCheck = false;
                if(this.checkIndex == 2) {
                    unCheck = true;
                }
                api && api.openFrame({
                    name: 'popupbox-villageDetail',
                    url: '../popupbox/villageDetail.html',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: windowHeight,
                    },
                    pageParam: {
                        villagesID: this.villagesList[index].villagesID,
                        unCheck: unCheck,
                    }
                });
            },
        }
    });
    function searchData() {
        if (vNext) {
            _g.showProgress();
            vPage++;
            Http.ajax({
                data: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    token: UserInfo.token,
                    pageIndex: vPage,
                    pageSize: 30,
                    param: distribution.villageName,
                },
                // isSync: true,
                lock: false,
                url: '/jiekou/agentht/distribution/searchVillage.aspx',
                success: function(ret) {
                    if (ret.zt == 1) {
                        var dt = ret.data;
                        setTimeout(function() {
                            if (!ret.data && vPage == 1) {
                                vNext = false;
                            } else if (ret.data && vPage == 1) {
                                vNext = true;
                                var list = getVillageValue(dt);
                                distribution.villagesList = list;
                            } else if (ret.data && vPage > 1) {
                                vNext = true;
                                var list = getVillageValue(dt);
                                if (distribution.villagesList) {
                                    distribution.villagesList = distribution.villagesList.concat(list);
                                } else {
                                    distribution.villagesList = villagesList;
                                }
                            } else if (!ret.data && vPage > 1) {
                                _g.toast("没有更多数据");
                                vNext = false;
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
                        if(vPage == 1) {
                            distribution.villagesList = [];
                        }
                        _g.hideProgress();
                        _g.toast(ret.msg);
                    }
                },
                error: function(err) {}
            });
        }
    }
    var getShopperData = function() {
        sPage ++;
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: sPage,
                pageSize: 30,
            },
            // isSync: true,
            lock: false,
            url: '/jiekou/agentht/distribution/getShopper.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        var dt = ret.data;
                        var list = getShopperValue(dt);
                        if(sPage == 1) {
                            distribution.shopperList = list;
                        } else {
                            distribution.shopperList = distribution.shopperList.concat(list);
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
                    if(sPage == 1) {
                        distribution.shopperList = [];
                    }
                    _g.hideProgress();
                    window.isNoMore = true;
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {
                _g.toast(ret.msg);
            }
        });
    }
    var getTimeData = function() {
        tPage ++;
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: tPage,
                pageSize: 30,
            },
            // isSync: true,
            lock: false,
            url: '/jiekou/agentht/distribution/getTime.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function(){
                        var dt = ret.data;
                        if(tPage == 1) {
                            distribution.timeList = getTimeValue(dt)
                        } else {
                            distribution.timeList = distribution.timeList.concat(getTimeValue(dt));
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
                    }, 1000);
                } else {
                    if(tPage == 1) {
                        distribution.timeList = [];
                    }
                    _g.hideProgress();
                    window.isNoMore = true;
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    var getVillageData = function() {
        var status = 1;
        if(distribution.checkIndex == 0) {
            status = 1;
        } else if(distribution.checkIndex == 1) {
            status = 0;
        } else if(distribution.checkIndex == 2) {
            status = 2;
        }
        vPage ++;
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: vPage,
                pageSize: 30,
                status: status
            },
            // isSync: true,
            lock: false,
            url: '/jiekou/agentht/distribution/getVillage.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        var dt = ret.data;
                        var list = getVillageValue(dt);
                        if(vPage == 1) {
                            distribution.villagesList = list;
                        } else {
                            distribution.villagesList = distribution.villagesList.concat(list);
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
                    if(vPage == 1) {
                        distribution.villagesList = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}
        });
    }
    var getShopperValue = function(result) {
        var object = result.shoppers || {};
        var amount = result.shoppersl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                shopperID: object['shopper_' + i + '_id'] || '',
                shopperName: object['shopper_' + i + '_name'] || '小工',
                shopperPhone: object['shopper_' + i + '_sj'] || '1231231231',

            })
        }
        return list;
    }
    var getTimeValue = function(result) {
        var object = result.times || {};
        var amount = result.timesl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                timeID: object['time_' + i + '_id'] || '',
                timePeriod: object['time_' + i + '_period'] || '',
            })
        }
        return list;

    }

    var getVillageValue = function(result) {
        var object = result.villages || {};
        var amount = result.villagesl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                villagesID: object['village_' + i + '_id'] || '',
                villagesName: object['village_' + i + '_name'] || '',
                villagesFirstLetter: object['village_' + i + '_szm'] || '',
            })
        }
        return list;
    }
    getShopperData();

    api.addEventListener({
        name: 'distribution-menu',
    }, function(ret, err) {
        if (!window.isMenuOpen) {
            _g.openMenuFrame({
                list: ['添加配送员', '添加配送时段', '添加配送小区', '配送时间段设置']
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
        if (ret.value.index == 0) {
            api && api.openFrame({
                name: 'popupbox-addShopper',
                url: '../popupbox/addShopper.html',
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    h: windowHeight,
                },
            });
        } else if (ret.value.index == 1) {
            setTimeout(function() {
                api && api.openFrame({
                    name: 'popupbox-addTime',
                    url: '../popupbox/addTime.html',
                    rect: {
                        x: 0,
                        y: headerHeight,
                        w: 'auto',
                        h: windowHeight,
                    },
                });
            }, 0);
        } else if (ret.value.index == 2) {
            api && api.openFrame({
                name: 'popupbox-addVillage',
                url: '../popupbox/addVillage.html',
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    h: windowHeight,
                },
            });
        } else if (ret.value.index == 3) {
            api && api.openFrame({
                name: 'popupbox-setSendingTime',
                url: '../popupbox/setSendingTime.html',
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    h: windowHeight,
                },
            });
        }
    });
    api.addEventListener({
        name: 'refresh-data',
    }, function(ret, err) {
        if (ret.value.index == 0) {
            // distribution.shopperList = [];
            sNext = true;
            sPage = 0;
            getShopperData();
            distribution.isSelect1 = true;
            distribution.isSelect2 = false;
            distribution.isSelect3 = false;
        } else if (ret.value.index == 1) {
            // distribution.timeList = [];
            tNext = true;
            tPage = 0;
            getTimeData();
            distribution.isSelect1 = false;
            distribution.isSelect2 = true;
            distribution.isSelect3 = false;
        } else if (ret.value.index == 2) {
            // distribution.villagesList = [];
            vNext = true;
            vPage = 0;
            getVillageData();
            distribution.isSelect1 = false;
            distribution.isSelect2 = false;
            distribution.isSelect3 = true;
        }

    });
    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            window.isNoMore = false;
            sNext = true;
            sPage = 0;
            tNext = true;
            tPage = 0;
            vNext = true;
            vPage = 0;
            distribution.villageName = '';
            // distribution.shopperList = [];
            // distribution.timeList = [];
            // distribution.villagesList = [];
            setTimeout(function() {
                if(distribution.isSelect1 == true) {
                    getShopperData();
                } else if(distribution.isSelect2 == true) {
                    getTimeData();
                } else if (distribution.isSelect3 == true) {
                    getVillageData();
                }
            }, 500);
        }, 0);
    });
    api.addEventListener({
        name: 'scrolltobottom',
    }, function(ret, err) {
        if(distribution.villageName == '') {
            if (distribution.isSelect1 == true) {
                getShopperData();
            } else if (distribution.isSelect2 == true) {
                getTimeData();
            } else if (distribution.isSelect3 == true) {
                getVillageData();
            }
        } else {
            searchData();
        }
    });
    module.exports = {};
});
