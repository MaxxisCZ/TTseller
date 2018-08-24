define(function(require, exports, module) {
    var message = api.pageParam.message;
    var Http = require('U/http');
    var failRefund = new Vue({
        el: '#failRefund',
        template: _g.getTemplate('popupbox/failRefund-main-V'),
        data: {
            isNetwork: false,
            message: message,
        },
        methods: {
            onKnowTap: function(){
                api&&api.closeFrame();
            },

        }
    });
    module.exports = {};
});