define(function(require, exports, module) {
    var myDate = new Date();
    var Http = require('U/http');
    var addCouponSuccess = new Vue({
        el: '#addCouponSuccess',
        template: _g.getTemplate('popupbox/addCouponSuccess-main-V'),
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
                    _g.closeWins(['user-resetPsw-win']);
                }, 0);
                setTimeout(function(){
                    api && api.closeFrame();
                },500);
            }
        }
    });
    module.exports = {};
});