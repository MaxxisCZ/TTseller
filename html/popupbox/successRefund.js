define(function(require, exports, module) {
    var Http = require('U/http');
    var successRefund = new Vue({
        el: '#successRefund',
        template: _g.getTemplate('popupbox/successRefund-main-V'),
        data: {
            isNetwork: false,
        },
        methods: {
            onKnowTap: function(){
                    api && api.closeFrame();
            },

        }
    });
    module.exports = {};
});