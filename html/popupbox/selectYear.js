define(function(require, exports, module) {
    var myDate = new Date();
    var Http = require('U/http');
    var selectYear = new Vue({
        el: '#selectYear',
        template: _g.getTemplate('popupbox/selectYear-V'),
        data: {
            selected:myDate.getFullYear(),
            isNetwork: false,
            options: [{
                text: myDate.getFullYear(),
                value: myDate.getFullYear(),
            }, {
                text: myDate.getFullYear()-1,
                value: myDate.getFullYear()-1,
            }, {
                text: myDate.getFullYear()-2,
                value: myDate.getFullYear()-2,
            }, {
                text: myDate.getFullYear()-3,
                value: myDate.getFullYear()-3,
            }, {
                text: myDate.getFullYear()-4,
                value: myDate.getFullYear()-4,
            } ],
        },
        methods: {
            onCancelTap: function() {
                api && api.closeFrame();
            },
            onSumbitTap: function() {
                setTimeout(function() {
                    api && api.sendEvent({
                        name: 'popupbox-selectYear-chooseYear',
                        extra: {
                            year: selectYear.selected,
                        }
                    });
                    setTimeout(function() {
                        api && api.closeFrame();
                    }, 500);
                }, 0);
            }

        }
    });
    module.exports = {};
});
