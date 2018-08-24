define(function(require, exports, module) {
    // var message = api.pageParam.message;
    var Http = require('U/http');
    var successApply = new Vue({
        el: '#successApply',
        template: _g.getTemplate('popupbox/successApply-main-V'),
        data: {
            isNetwork: false,
            // message: message,
        },
        methods: {
            onKnowTap: function(){
                api&&api.closeFrame();
            },

        }
    });
    module.exports = {};
});