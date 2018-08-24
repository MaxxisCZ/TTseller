define(function(require, exports, module) {
    var Http = require('U/http');
    var addCardSuccess = new Vue({
        el: '#addCardSuccess',
        template: _g.getTemplate('popupbox/addCardSuccess-V'),
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
