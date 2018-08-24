define(function(require, exports, module) {
    var myDate = new Date();
    var page = 1;
    var next = true;
    var pageIndex = 1;
    var Http = require('U/http');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var UserInfo = _g.getLS("UserInfo");
    var maxPageIndex = api && api.pageParam.pageIndex;
    var costM = new Vue({
        el: '#content',
        template: _g.getTemplate('cost/costM-body-V'),
        data: {
            searchNext: true,
            isSearch: false,
            selectY: '',
            selectM: '',
            year: '',
            month: '',
            filePath: '',
            fileName: '',
            fileSize: '',
            list: [{
                costID: '111',
                costRecordTime: '',
                costMoney: '100.00',
                costReason: 'none',
                costAgentID: '',
            }],
            optionY: [{
                text: '',
                value: '',
            } ],
            optionM: [{
                text: '',
                value: '',
            }]
        },
        created: function() {
            this.list = [];
        },
        methods: {
            onYearChange: function() {
                Http.ajax({
                    data: {
                        loginname: UserInfo.loginname,
                        agentid: UserInfo.agentid,
                        staffid: UserInfo.staffid,
                        token: UserInfo.token,
                        year: this.selectY,
                    },
                    lock: false,
                    url: '/jiekou/agentht/cost/getMonth.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            var data = ret.data;
                            costM.optionM = getMonthDetail(data);
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                    error: function(err) {},
                });
            },
            onsearchTap: function() {
                if (costM.selectY == '') {
                    _g.toast('请选择年份');
                    return;
                }
                if (costM.selectM == '') {
                    _g.toast('请选择月份');
                    return;
                }
                getSearchData();
            },
            onDeleteTap: function(index) {
                api.confirm({
                    title: '注意',
                    msg: '您确定要删除这条记录吗？',
                    buttons: ['取消', '确定']
                }, function(ret, err) {
                    if(ret.buttonIndex == 2) {
                        Http.ajax({
                            data: {
                                loginname: UserInfo.loginname,
                                agentid: UserInfo.agentid,
                                staffid: UserInfo.staffid,
                                costid: costM.list[index].costID,
                                token: UserInfo.token,
                            },
                            url: '/jiekou/agentht/cost/deleteCost.aspx',
                            success: function(ret) {
                                if (ret.zt == 1) {
                                    setTimeout(function() {
                                        page = 1;
                                        getData();
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
                                    _g.toast(ret.msg);
                                }
                            },
                            error: function(err) {
                                _g.toast("删除失败");
                            }
                        });
                    }
                });
            },
        }
    });
    function getYearData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/cost/getYear.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    costM.optionY = getYearDetail(data);
                    costM.selectY = costM.optionY[0].text;
                    setTimeout(function() {
                        getMonthData();
                        setTimeout(function() {
                           costM.selectM = costM.optionM[costM.optionM.length-1].text; 
                       }, 500);
                    }, 500);
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
    function getMonthData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                year: costM.selectY,
            },
            lock: false,
            url: '/jiekou/agentht/cost/getMonth.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    costM.optionM = getMonthDetail(data);
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
    function getSearchData() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: page,
                pageSize: 30,
                Time: costM.selectY + '-' + costM.selectM,
            },
            lock: false,
            url: '/jiekou/agentht/cost/searchCost.aspx',
            success: function(ret) {
                setTimeout(function() {
                    if (ret.zt == 1) {
                        setTimeout(function() {
                            if(page == 1) {
                                costM.list = getDataValue(ret.data);
                            } else {
                                costM.list = costM.list.concat(getDataValue(ret.data));
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
                        if(page == 1) {
                            costM.list = [];
                        }
                        window.isNoMore = true;
                        _g.toast(ret.msg);
                    }
                    setTimeout(function() {
                        _g.hideProgress();
                    }, 500);
                }, 0);
                
            }
        });
    }
    function getData() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                pageIndex: page,
                pageSize: 30,
                token: UserInfo.token,
            },
            // isSync: true,
            url: '/jiekou/agentht/cost/getCost.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var list = ret.data;
                    setTimeout(function() {
                        if(page == 1) {
                            costM.list = getDataValue(list);
                        } else {
                            costM.list = costM.list.concat(getDataValue(list));
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
                    if(page == 1) {
                        costM.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {}

        });
    }
    function getDataValue(result) {
        var object = result.costs || {};
        var amount = result.costsl || 0;
        var list = [];
        for (var i = 1; i <= amount; i++) {
            list.push({
                costID: object['cost_' + i + '_id'] || '',
                costRecordTime: object['cost_' + i + '_fbrq'] || '',
                costMoney: object['cost_' + i + '_cb'] || '',
                costReason: object['cost_' + i + '_yy'] || '',
                costAgentID: object['cost_' + i + '_agentid'] || '',
            });
        }
        return list;
    }
    function getYearDetail(result) {
        var detail = result ? result : [];
        return _.map(detail, function(data) {
            return {
                text: data || [],
                value: data || [],
            }
        });
    }
    function getMonthDetail(result) {
        var detail = result ? result : [];
        return _.map(detail, function(data) {
            return {
                text: data || [],
                value: data || [],
            }
        });
    }
    getYearData();
    getData();

    api.addEventListener({
        name: 'cost-menu',
    }, function(ret, err) {
        if (!window.isMenuOpen) {
            _g.openMenuFrame({
                list: ['导出记录', '记录成本']
            });
        } else {
            api.sendEvent({
                name: 'global-menu-onBtnTap',
            });
        }

    });

    function getFilePath() {
        //获取记录文件的地址
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                year: costM.selectY,
                month: costM.selectM,
            },
            url: '/jiekou/agentht/cost/costData2.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var dt = ret.data;
                    costM.filePath = dt.filepath;
                    costM.fileName = dt.filename;
                    costM.fileSize = dt.filesize;
                    api && api.openFrame({
                        name: 'popupbox-downloadTip',
                        url: '../popupbox/downloadTip.html',
                        rect: {
                            x: 0,
                            y: headerHeight,
                            w: 'auto',
                            h: windowHeight,
                        },
                        pageParam: {
                            filePath: costM.filePath,
                            fileName: costM.fileName,
                            fileSize: costM.fileSize,
                        }
                    });
                }
            }
        });
    }
    api.addEventListener({
        name: api.winName + '-menu-onItemTap',
    }, function(ret, err) {
        if (ret.value.index == 0) {
            //导出记录
            if (costM.selectY && costM.selectM) {
                getFilePath();
            } else {
                _g.toast('请选择年份和月份');
            }
        } else if (ret.value.index == 1) {
            //添加成本记录
            api && api.openFrame({
                name: 'popupbox-costRecord',
                url: '../popupbox/costRecord.html',
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    h: windowHeight,
                },
            });
        }
    });
    //监听拿到的年份
    api.addEventListener({
        name: 'getYear'
    }, function(ret, err) {
        costM.year = ret.value.year;
    });
    //刷新点中年份的成本列表
    api.addEventListener({
        name: 'updateCostRecord',
    }, function(ret, err) {
        page = 1;
        next = true;
        // costM.list = [];
        getData();
    });
    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            page = 1;
            next = true;
            // costM.list = [];
            getData();
        }, 0);
    });
    api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0
        },
    }, function(ret, err) {
        page ++;
        if(costM.selectY != '' && costM.selectM != '') {
            getSearchData();
        } else {
            getData();
        }
    });
    module.exports = {};
});
