define(function(require, exports, module) {
    var message = api.pageParam.message;
    var Http = require('U/http');
    var failApply = new Vue({
        el: '#failApply',
        template: _g.getTemplate('popupbox/failApply-main-V'),
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