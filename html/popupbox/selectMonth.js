define(function(require, exports, module) {
    var myDate = new Date();
    var Http = require('U/http');
    var selectMonth = new Vue({
        el: '#selectMonth',
        template: _g.getTemplate('popupbox/selectMonth-V'),
        data: {
            selected: myDate.getMonth(),
            isNetwork: false,
            options: [],
        },
        created: function() {
            var monthArr = [];
            for (var i = 0; i < 12; i++) {
                monthArr.push({
                    text: (i+1),
                    value: (i+1),
                })
            };
            this.options = monthArr;
            setTimeout(function(){
                $('.ui-choose > select > option').eq(myDate.getMonth()).attr('selected', 'selected');
            }, 0)
        },
        methods: {
            onCancelTap: function() {
                api && api.closeFrame();
            },
            onSumbitTap: function() {
                setTimeout(function() {
                    api && api.sendEvent({
                        name: 'popupbox-selectYear-chooseMonth',
                        extra: {
                            month: selectMonth.selected,
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
