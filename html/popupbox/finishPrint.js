define(function(require, exports, module) {
    var Http = require('U/http');
    var finishPrint = new Vue({
        el: '#finishPrint',
        template: _g.getTemplate('popupbox/finishPrint-main-V'),
        data: {
            isNetwork: false,
        },
        methods: {
            onCancelTap: function(){
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            },

        }
    });
    module.exports = {};
});