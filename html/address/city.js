define(function(require, exports, module) {
    var Http = require('U/http');
    var city = new Vue({
        el: '#city',
        template: _g.getTemplate('address/city-main-V'),
        data: {
            list: [{
                city: '江苏省-苏州市-昆山',
            }, {
                city: '江苏省-苏州市-昆山',
            }, {
                city: '江苏省-苏州市-昆山',
            }, ]
        },
        methods: {
            onSelectTap: function(index) {
                // alert(index);
                setTimeout(function() {
                    api && api.closeWin();
                }, 500);
            }
        },
    });

    module.exports = {};
});
