define(function(require, exports, module) {
    var Http = require('U/http');
    var openShop = new Vue({
        el: '#openShop',
        template: _g.getTemplate('popupbox/openShop-V'),
        data: {
            isNetwork: false,
        },
        methods: {
            onCancelTap: function(){
                // alert(111);
                api&&api.closeFrame({

                });
            },

        }
    });
    module.exports = {};
});
