define(function(require, exports, module) {
    var myDate = new Date();
    var Http = require('U/http');
    var openPwd = new Vue({
        el: '#openPwd',
        template: _g.getTemplate('popupbox/openPwd-main-V'),
        data: {
        },
        created: function() {
        },
        methods: {
            // onCancelTap: function() {
            //     api && api.closeFrame();
            // },
            onKnowTap: function() {
                setTimeout(function(){
                    _g.closeWins(['index-payPwd-win','index-setUpPwd-win','index-inputCode-win','index-myOldPayPwd-win','index-setUpPayPwd-win']);
                }, 0);
                setTimeout(function(){
                    api && api.closeFrame();
                },500);
            }
        }
    });
    module.exports = {};
});