define(function(require, exports, module) {
    var myDate = new Date();
    var Http = require('U/http');
    var destroyOrder = new Vue({
        el: '#destroyOrder',
        template: _g.getTemplate('popupbox/destroyOrder-main-V'),
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
                    _g.closeWins(['orderManage-readyDestroyDetail-win']);
                }, 0);
                setTimeout(function(){
                    api && api.closeFrame();
                },500);
            }
        }
    });
    module.exports = {};
});