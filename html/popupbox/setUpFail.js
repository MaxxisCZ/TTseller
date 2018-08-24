define(function(require, exports, module) {
    var myDate = new Date();
    var message = api.pageParam.message;
    var Http = require('U/http');
    var setUpFail = new Vue({
        el: '#setUpFail',
        template: _g.getTemplate('popupbox/setUpFail-main-V'),
        data: {
            message: message,
        },
        created: function() {
        },
        methods: {
            // onCancelTap: function() {
            //     api && api.closeFrame();
            // },
            onKnowTap: function() {
                // setTimeout(function(){
                //     _g.closeWins(['user-userTopUp-win']);
                // }, 0);
                setTimeout(function(){
                    api && api.closeFrame();
                },500);
            }
        }
    });
    module.exports = {};
});