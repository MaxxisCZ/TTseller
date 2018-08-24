define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
	var Http = require('U/http');
    var limitAccount = new Vue({
        el: '#limitAccount',
        template: _g.getTemplate('financeManage/limitAccount-main-V'),
        data: {
            detail: {
                limit: '',
            }
        },
        created: function() {
            this.detail.limit = '';
        },
        methods: {
        },
    });
    function getData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            url: '/jiekou/agentht/caiwujilu/getLimitations.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    limitAccount.detail.limit = getDetail(data);
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
        var limit = result ? result.limit : '';
        return(limit);
    }
    getData();

    module.exports = {};

});
