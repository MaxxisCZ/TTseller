define(function(require, exports, module) {
    var myDate = new Date();
    var Http = require('U/http');
    var setUpSuccess = new Vue({
        el: '#setUpSuccess',
        template: _g.getTemplate('popupbox/setUpSuccess-main-V'),
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
                    _g.closeWins(['user-userTopUp-win']);
                }, 0);
                setTimeout(function(){
                    api && api.closeFrame();
                },500);
            }
        }
    });
    module.exports = {};
});