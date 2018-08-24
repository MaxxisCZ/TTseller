define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
    var year = api && api.pageParam.year;
    var month = api && api.pageParam.month;
    var myDate = new Date();
	var Http = require('U/http');
    var monthBill = new Vue({
        el: '#monthBill',
        template: _g.getTemplate('me/monthBill-main-V'),
        data: {
            // year: myDate.getFullYear(),
            // month: myDate.getMonth() + 1,
            year: year,
            month: month,
            data: {
                orderNum: 0,
                orderPeople: 0,
                income: 0,
                transfer: 0,
                userRefund: 0,
                platformRefund: 0,
            },
            monthList: [{
                month: 0,
            }],
        },
        created: function(){
            
        },
        // read: function() {
        //     $("#monthSelect").change(function() {
        //         alert(111);
        //         return
        //         getData();
        //     });
        // },
        methods: {
            // onchangeTap:function(){
            //     getData();
            // }
        },
    });

    function getData() {
        monthBill.data.orderNum = 0;
        monthBill.data.orderPeople = 0;
        monthBill.data.income = 0;
        monthBill.data.transfer = 0;
        monthBill.data.userRefund = 0;
        monthBill.data.platformRefund = 0;
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                year: monthBill.year,
                month: monthBill.month,
            },
            lock: false,
            url: '/jiekou/agentht/agent/getMonthBill.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    monthBill.data = getDetail(data);
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
            error: function(err) {},
        });
    }

    function getDetail(result) {
        var detail = result ? result : '';
        return {
            orderNum: detail.xdsl || 0,
            orderPeople: detail.xdrs || 0,
            income: detail.income || 0,
            transfer: detail.transfer || 0,
            userRefund: detail.user_refund || 0,
            platformRefund: detail.refund || 0,
        }
    }

    function getMonthList() {
        var array = [];
        for(var i = 0; i < monthBill.month; i++) {
            array.push({'month':(i + 1)});
        }
        monthBill.monthList = array;
    }


    getData();
    getMonthList();

    module.exports = {};

});