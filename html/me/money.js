define(function(require,exports,module) {
    var pageIndex = 1;
    var pageSize = 20;
    var UserInfo = _g.getLS('UserInfo');
    var myDate = new Date();
    var Http = require('U/http');
    // var totalMoney = new Vue({
    //     el:'#totalMoney',
    //     template:_g.getTemplate('me/money-totalMoney-V'),
    //     data:{
    //         money: 0,
    //     },
    //     methods:{
    //         onMonthBillTap: function() {
    //             _g.openWin({
    //                 header: {
    //                     data: {
    //                         title: '月账单',
    //                     },
    //                 },
    //                 name: 'me-monthBill',
    //                 url: '../me/monthBill.html',
    //                 bounces: false,
    //                 slidBackEnabled: false,
    //                 pageParam: {

    //                 }
    //             });
    //         }
    //     },
    // });

    // function getdata() {
    //     Http.ajax({
    //         data: {
    //             loginname: UserInfo.loginname,
    //             agentid: UserInfo.agentid,
    //             staffid: UserInfo.staffid,
    //             token: UserInfo.token,
    //         },
    //         lock: false,
    //         url: '/jiekou/agentht/agent/getBalance.aspx',
    //         success: function(ret) {
    //             if(ret.zt == 1) {
    //                 totalMoney.money = ret.data.balance;
    //                 _g.toast(ret.msg);
    //             } else {
    //                 _g.toast(ret.msg);
    //             }
    //         },
    //         error: function(err) {},
    //     });
    // }
    var moneyList = new Vue({
        el:'#moneyList',
        template:_g.getTemplate('me/money-totalMoney-V'),
        data:{
            money: 0,
            year: myDate.getFullYear(),
            month: myDate.getMonth() + 1,
            // month: 10,
            list:[{
                time:'今天',
                hour: '',
                isIncome: 0,
                isNegative: false,
                moneyDetail:'-xxxx',
                text:'xxxxxxxxxxx'
            } ]
        },
        created: function() {
            this.list = [];
        },
        methods:{
            onMonthBillTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '月账单',
                        },
                    },
                    name: 'me-monthBill',
                    url: '../me/monthBill.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {
                        year: moneyList.year,
                        month: moneyList.month
                    }
                });
            }
        }
    });

    function picker() {
        api.openPicker({
            type: 'date',
            // date: '2014-05',
            title: '选择时间'
        }, function(ret, err) {
            if (ret) {
                moneyList.year = ret.year;
                moneyList.month = ret.month;
                // moneyList.list = [];
                pageIndex = 1;
                getBillData();
            } else {
                alert(JSON.stringify(err));
            }
        });
    }

    function getdata() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            url: '/jiekou/agentht/agent/getBalance.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    moneyList.money = ret.data.balance;
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

    function getBillData() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                pageIndex: pageIndex,
                pageSize: pageSize,
                year: moneyList.year,
                month: moneyList.month,
            },
            lock: false,
            url: '/jiekou/agentht/agent/getCaiwujilu.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            moneyList.list = getMonthBillDetail(ret.data);
                        } else {
                            moneyList.list = moneyList.list.concat(getMonthBillDetail(ret.data));
                        }
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 800);
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
                        moneyList.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    function getMonthBillDetail(result) {
        var detail = result ? result.zcs : [];
        return _.map(detail, function(data) {
            return {
                time: compareTime(data.sj) || '',
                hour: outputDate(data.sj) || '',
                isIncome: data.je || '',
                isNegative: isNegative(data.je) || '',
                moneyDetail: data.je || 0,
                text: data.fukuanyuanyin || '',
            }
        });
    }

    //重组时间格式
    function changeTime(result) {
        var time = result.split(' ')[1];
        var date = result.split(' ')[0];
        var hour = time.split(':')[0];
        var minute = time.split(':')[1];
        var second = time.split(':')[2];
        var year = date.split('/')[0];
        var month = date.split('/')[1];
        var day = date.split('/')[2];
        var newTime = month + ' ' + day + ',' + year + ' ' + time;
        var dateObj = new Date();
        dateObj.setFullYear(year);
        dateObj.setMonth(month);
        dateObj.setDate(day);
        dateObj.setHours(hour);
        dateObj.setMinutes(minute);
        dateObj.setSeconds(second);
        return (dateObj);
    }

    //对比日期，显示星期，昨天
    function compareTime(param) {
        var date = param.split(' ')[0];
        var year = date.split('/')[0];
        var month = date.split('/')[1];
        var day = date.split('/')[2];
        var nowDay = myDate.getDate();
        var nowMonth = myDate.getMonth() +1;
        var nowYear = myDate.getFullYear();
        var getTime = changeTime(param);
        var week = getTime.getDay();
        var hour = getTime.getHours();
        var minute = getTime.getMinutes();
        var month = getTime.getMonth();
        var day = getTime.getDate();
        if(nowYear == year && nowMonth == month && nowDay == day) {
            return('今天');
        } else if(nowYear == year && nowMonth == month && nowDay - day == 1) {
            return('昨天');
        } else {
            if(week == 0) {
                return('周日');
            } else if(week == 1) {
                return('周一');
            } else if(week == 2) {
                return('周二');
            } else if(week == 3) {
                return('周三');
            } else if(week == 4) {
                return('周四');
            } else if(week == 5) {
                return('周五');
            } else if(week == 6) {
                return('周六');
            }
        }
    }

    //输出时间或日期
    function outputDate(param) {
        // alert(getTime.getMonth());
        var date = param.split(' ')[0];
        var year = date.split('/')[0];
        var month = date.split('/')[1];
        var day = date.split('/')[2];
        var nowDay = myDate.getDate();
        var nowMonth = myDate.getMonth() + 1;
        var nowYear = myDate.getFullYear();
        var getTime = changeTime(param);
        var week = getTime.getDay();
        var hour = getTime.getHours();
        var minute = getTime.getMinutes();
        // var month = getTime.getMonth();
        // var day = getTime.getDate();
        if(nowYear == year && nowMonth == month && nowDay == day) {
            // moneyList.list.hour = hour + ':' + minute;
            return (hour + ':' + minute);
        } else if(nowYear == year && nowMonth == month && nowDay - day == 1) {
            // moneyList.list.hour = hour + ':' + minute;
            return (hour + ':' + minute);
        } else {
            return (month + '-' + day);
        }
    }

    function isNegative(param) {
        if(param < 0) {
            return (true)
        }
    }

    // _g.setLoadmore(function(ret, err) {
    //     alert(111);
    //     pageIndex++;
    //     getBillData();
    // });
    api.addEventListener({
        name: 'scrolltobottom',
    },function(){
        pageIndex++;
        getBillData();
    });
    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            window.isNoMore = false;
            pageIndex = 1;
            totalMoney.money = 0;
            // moneyList.list = [];
            getdata();
            getBillData();
        }, 0);
    });

    api && api.addEventListener({
        name: 'me-money-selectDate',
    }, function(ret, err) {
        picker();
    });

    getBillData();
    getdata();
    module.exports = {};
});
