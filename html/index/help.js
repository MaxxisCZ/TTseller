define(function(require, exports, module) {
    var pageSize = 20;
    var pageIndex = 1;
	var Http = require('U/http');
    var help = new Vue({
        el: '#help',
        template: _g.getTemplate('index/help-main-V'),
        data: {
            detail: [{
                title: '',
                note: '',
            }]
        },
        created: function() {
            this.detail = [];
        },
        methods: {
            
        },
    });
    function getData() {
        Http.ajax({
            data: {
                pageSize: pageSize,
                pageIndex: pageIndex,
            },
            url: '/jiekou/agentht/settings/getHelp.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    help.detail = getDetail(data);
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
            error: function(error) {},
        });
    }
    function getDetail(result) {
        var detail = result ? result.helps : [];
        return _.map(detail, function(data) {
            return {
                title: data.title || '',
                note: data.describe || '',
            }
        });
    }
    getData();

    module.exports = {};

});