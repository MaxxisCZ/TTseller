define(function(require,exports,module) {
    var UserInfo = _g.getLS("UserInfo");
    var Http = require('U/http');
    var attention = new Vue({
        el:'#attention',
        template:_g.getTemplate('me/attention-main-V'),
        data:{
            content: '',
        },
        methods:{
            
        }
    });

    // 获取注意事项
    function getAttentionData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            url: '/jiekou/agentht/agent/getMatters.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    attention.content = ret.data.matters;
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

    getAttentionData();

    module.exports = {};
});
