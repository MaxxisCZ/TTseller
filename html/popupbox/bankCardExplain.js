define(function(require, exports, module) {
    var myDate = new Date();
    var Http = require('U/http');
    var bankCardExplain = new Vue({
        el: '#bankCardExplain',
        template: _g.getTemplate('popupbox/bankCardExplain-body-V'),
        data: {
        },
        created: function() {
        },
        methods: {
            onKnowTap: function() {
                api && api.closeFrame();
            }
        }
    });
    module.exports = {};
});