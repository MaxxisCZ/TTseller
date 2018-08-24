define(function(require, exports, module) {
    var pageIndex = 1;
    var pageSize = 30;
    var myDate = new Date();
	var Http = require('U/http');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var yearMonthCensus = new Vue({
        el: '#yearMonthCensus',
        template: _g.getTemplate('orderCensus/yearMonthCensus-main-V'),
        data: {
            timeTitle: '日期',
            timeType: 1,
            year: myDate.getFullYear(),
            month: myDate.getMonth() + 1,
            isSelect: false,
            topList: [{
                title: '日销售额',
                time: '日期',
                isSelect: true
            }, {
                title: '月销售额',
                time: '月份',
                isSelect: false
            }, {
                title: '年销售额',
                time: '年份',
                isSelect: false
            }, ],
            detail: [{
                number: 0,
                time: '',
                saleSum: 0,
                orderSum: 0,
                orderPeople: 0,
            }],
            options: [{
                text: myDate.getFullYear(),
                value: 0,
            }, {
                text: myDate.getFullYear()-1,
                value: 1,
            }, {
                text: myDate.getFullYear()-2,
                value: 2,
            }, {
                text: myDate.getFullYear()-3,
                value: 3,
            }, {
                text: myDate.getFullYear()-4,
                value: 4,
            } ],
        },
        created: function() {
            this.detail = [];
        },
        methods: {
            onTimeTypeTap: function(index) {
                if(this.timeType == index + 1) {
                    return
                }
                setTimeout(function() {
                    pageIndex = 1;
                    // yearMonthCensus.detail = [];
                    yearMonthCensus.isSelect = false;
                    yearMonthCensus.timeType = index + 1;
                    _.each(yearMonthCensus.topList, function(n,i) {
                        if(i == index) {
                            n.isSelect = true;
                        } else {
                            n.isSelect = false;
                        }
                    });
                    getSaleData(yearMonthCensus.timeType);
                    yearMonthCensus.timeTitle = changeTimeType(yearMonthCensus.timeType);
                }, 100);
            }
        },
    });
    var getSaleData = function(timeType) {
        _g.showProgress();
        if(timeType == 3) {
            // alert("年");
            Http.ajax({
                data: {
                    loginname: _g.getLS('UserInfo').loginname,
                    agentid: _g.getLS('UserInfo').agentid,
                    staffid: _g.getLS('UserInfo').staffid,
                    token: _g.getLS('UserInfo').token,
                    year: yearMonthCensus.year,
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                },
                isSync: true,
                url: '/jiekou/agentht/order/ordertj11.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            setTimeout(function() {
                                if(pageIndex == 1) {
                                    yearMonthCensus.detail = getYearDetail(ret.data);
                                } else {
                                    yearMonthCensus.detail = yearMonthCensus.detail.concat(getYearDetail(ret.data));
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
                            if(pageIndex == 1) {
                                yearMonthCensus.detail = [];
                            }
                            window.isNoMore = true;
                            _g.hideProgress();
                            _g.toast(ret.msg);
                        }
                    },
                });
            api.sendEvent({
                name:'orderCensus-yearMonthCensus-win-hideRightBtn',
                extra:{
                    isShow:0
                }
            });
        } else if(timeType == 2) {
            // alert("月");
            var year = '';
            if(yearMonthCensus.isSelect == true) {
                year = yearMonthCensus.year;
            }
            Http.ajax({
                data: {
                    loginname: _g.getLS('UserInfo').loginname,
                    agentid: _g.getLS('UserInfo').agentid,
                    staffid: _g.getLS('UserInfo').staffid,
                    token: _g.getLS('UserInfo').token,
                    // year: yearMonthCensus.year,
                    year: year,
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                },
            url: '/jiekou/agentht/order/ordertj12.aspx',
                success: function(ret) {
                    if(ret.zt == 1) {
                        setTimeout(function() {
                            if(pageIndex == 1) {
                                yearMonthCensus.detail = getMonthDetail(ret.data);
                            } else {
                                yearMonthCensus.detail = yearMonthCensus.detail.concat(getMonthDetail(ret.data));
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
                            yearMonthCensus.detail = [];
                        }
                        window.isNoMore = true;
                        _g.hideProgress();
                        _g.toast(ret.msg);
                    }
                },
            });
            api.sendEvent({
                name:'orderCensus-yearMonthCensus-win-hideRightBtn',
                extra:{
                    isShow:1
                }
            });
        } else if(timeType == 1) {
            // alert("日");
            Http.ajax({
                data: {
                    loginname: _g.getLS('UserInfo').loginname,
                    agentid: _g.getLS('UserInfo').agentid,
                    staffid: _g.getLS('UserInfo').staffid,
                    token: _g.getLS('UserInfo').token,
                    year: yearMonthCensus.year,
                    month: yearMonthCensus.month,
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                },
            url: '/jiekou/agentht/order/ordertj13.aspx',
                success: function(ret) {
                    if(ret.zt == 1) {
                        setTimeout(function() {
                            if(pageIndex == 1) {
                                yearMonthCensus.detail = getDayDetail(ret.data);
                            } else {
                                yearMonthCensus.detail = yearMonthCensus.detail.concat(getDayDetail(daret.datata));
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
                            yearMonthCensus.detail = [];
                        }
                        window.isNoMore = true;
                        _g.hideProgress();
                        _g.toast(ret.msg);
                    }
                },
            });
            api.sendEvent({
                name:'orderCensus-yearMonthCensus-win-hideRightBtn',
                extra:{
                    isShow:1
                }
            });
        }
    }
    var getYearDetail = function(result) {
        var data = result ? result : '';
        var detail = data.sales ? data.sales : '';
        var newArry = [];
        for(var i =0; i < data.salesl; i++)
            newArry.push({
                number: detail['sale_'+(i+1)+'_num'],
                time: detail['sale_'+(i+1)+'_sj'],
                saleSum: detail['sale_'+(i+1)+'_shze'],
                orderSum: detail['sale_'+(i+1)+'_ddsl'],
                orderPeople: detail['sale_'+(i+1)+'_rs'],
            });
        return(newArry);
    }
    var getMonthDetail = function(result) {
        var data = result ? result : '';
        var detail = data.sales ? data.sales : '';
        var newArry = [];
        for(var i =0; i < data.salesl; i++)
            newArry.push({
                number: detail['sale_'+(i+1)+'_num'],
                time: detail['sale_'+(i+1)+'_month'],
                saleSum: detail['sale_'+(i+1)+'_shze'],
                orderSum: detail['sale_'+(i+1)+'_ddsl'],
                orderPeople: detail['sale_'+(i+1)+'_rs'],
            });
        return(newArry);
    }
    var getDayDetail = function(result) {
        var data = result ? result : '';
        var detail = data.sales ? data.sales : '';
        var newArry = [];
        for(var i =0; i < data.salesl; i++)
            newArry.push({
                number: detail['sale_'+(i+1)+'_num'],
                time: detail['sale_'+(i+1)+'_sj'],
                saleSum: detail['sale_'+(i+1)+'_shze'],
                orderSum: detail['sale_'+(i+1)+'_ddsl'],
                orderPeople: detail['sale_'+(i+1)+'_rs'],
            });
        return(newArry);
    }
    var changeTimeType = function(result) {
        if(result == 1) {
            return('日期');
        } else if(result == 2) {
            return('月份');
        } else if(result == 3) {
            return('年份');
        }
    }
    api && api.addEventListener({
        name: 'orderCensus-yearMonthCensus'
    }, function(ret, err) {
        if(yearMonthCensus.timeType == 1){
            if(!window.isMenuOpen) {
                _g.openMenuFrame({
                    list: ['年份','月份']
                });
            } else {
                api.sendEvent({
                    name:'global-menu-setList',
                    extra:{
                        list: ['年份','月份']
                    }
                });
                api.sendEvent({
                    name: 'global-menu-onBtnTap',
                });
            }
        } else if(yearMonthCensus.timeType == 2){
            if(!window.isMenuOpen) {
                _g.openMenuFrame({
                    list: ['年份']
                });
            } else {
                api.sendEvent({
                    name:'global-menu-setList',
                    extra:{
                        list: ['年份']
                    }
                });
                api.sendEvent({
                    name: 'global-menu-onBtnTap',
                });
            }
        } else {
            return;
        }
    });
    api.addEventListener({
        name: api.winName + '-menu-onItemTap',
    },function(ret,err) {
        if(ret.value.index == 0) {
            api && api.openFrame({
                name: 'popupbox-selectYear',
                url: '../popupbox/selectYear.html',
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    h: windowHeight,
                },
            });
        } else if(ret.value.index == 1) {
            api && api.openFrame({
                name: 'popupbox-selectMonth',
                url: '../popupbox/selectMonth.html',
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    h: windowHeight,
                },
            });
        }
    });
    api && api.addEventListener({
        name: 'popupbox-selectYear-chooseYear'
    }, function(ret,err) {
        yearMonthCensus.isSelect = true;
        yearMonthCensus.year = ret.value.year;
        // yearMonthCensus.detail = [];
        pageIndex = 1;
        getSaleData(yearMonthCensus.timeType);
    });
    api && api.addEventListener({
        name: 'popupbox-selectYear-chooseMonth'
    }, function(ret,err) {
        yearMonthCensus.month = ret.value.month;
        // yearMonthCensus.detail = [];
        pageIndex = 1;
        getSaleData(yearMonthCensus.timeType);
    });
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getSaleData(yearMonthCensus.timeType);
    });
    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            pageIndex = 1;
            // yearMonthCensus.detail = [];
            getSaleData(yearMonthCensus.timeType);
        }, 0);
    });
    getSaleData(yearMonthCensus.timeType);

    module.exports = {};

});
