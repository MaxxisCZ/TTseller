define(function(require, exports, module) {
    var Http = require('U/http');
    var cardHolder = new Vue({
        el: '#cardHolder',
        template: _g.getTemplate('popupbox/cardHolder-V'),
        data: {
            isNetwork: false,
        },
        methods: {
            onCancelTap: function(){
                api&&api.closeFrame({

                });
            },

        }
    });
    module.exports = {};
});
