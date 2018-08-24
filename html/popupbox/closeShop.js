define(function(require, exports, module) {
    var Http = require('U/http');
    var closeShop = new Vue({
        el: '#closeShop',
        template: _g.getTemplate('popupbox/closeShop-V'),
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
