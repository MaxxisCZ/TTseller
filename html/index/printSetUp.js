define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var printSetUp = new Vue({
        el: '#printSetUp',
        template: _g.getTemplate('index/printSetUp-main-V'),
        data: {
            printtime: '',
            selected: 1,
        },
        created: function() {

        },
        methods: {
            onprintTap: function() {
                printData();
            }
        },
    });

    //获取订单打印次数和打印机台数
    function getData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            url: '/jiekou/agentht/settings/getPrinttime.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    printSetUp.printtime = ret.data.printtime;
                    printSetUp.selected = ret.data.printers;
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
            error: function(err) {},
        });
    }

    //设置订单打印次数和打印机台数
    function printData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                printers: printSetUp.selected,
                printtime: printSetUp.printtime,
            },
            url: '/jiekou/agentht/settings/setPrinttime.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
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
            },
            error: function(err) {},
        });
    }

    getData();

    module.exports = {};

});
