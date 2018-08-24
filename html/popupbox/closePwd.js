define(function(require, exports, module) {
    var myDate = new Date();
    var Http = require('U/http');
    var closePwd = new Vue({
        el: '#closePwd',
        template: _g.getTemplate('popupbox/closePwd-main-V'),
        data: {
        },
        created: function() {
        },
        methods: {
            onKnowTap: function() {
                setTimeout(function(){
                    _g.closeWins(['index-setUpPwd-win','index-myOldPayPwd-win']);
                }, 0);
                setTimeout(function(){
                    api && api.closeFrame();
                },500);
            }
        }
    });
    module.exports = {};
});