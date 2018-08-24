define(function(require, exports, module) {
	var Http = require('U/http');
    var about = new Vue({
        el: '#about',
        template: _g.getTemplate('index/about-main-V'),
        data: {
            detail: {
                pic: '',
                text: '',
            }
        },
        created: function() {

        },
        methods: {

        },
    });
    function getData() {
        Http.ajax({
            url: '/jiekou/agentht/settings/aboutus.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    about.detail = getDetail(data);
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

						},
        });
    }
    function getDetail(result) {
        var detail = result ? result : {};
        return {
            pic: detail.imgurl || '',
            text: detail.banben || '',
        }
    }
    getData();

    module.exports = {};

});
