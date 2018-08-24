define(function(require, exports, module) {
    var text =api && api.pageParam.text;
    var myDate = new Date();
    var Http = require('U/http');
    var setUpPwdFail = new Vue({
        el: '#setUpPwdFail',
        template: _g.getTemplate('popupbox/setUpPwdFail-main-V'),
        data: {
            text: text
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