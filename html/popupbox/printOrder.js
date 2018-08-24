define(function(require, exports, module) {
    var printType = api && api.pageParam.printType;
    var Http = require('U/http');
    var printOrder = new Vue({
        el: '#printOrder',
        template: _g.getTemplate('popupbox/printOrder-main-V'),
        data: {
            isNetwork: false,
            text: '',
        },
        methods: {
            onCancelTap: function(){
                api&&api.closeFrame();
            },
            onSubmitTap: function() {
                api.sendEvent({
                    name: 'orderManage-readySendDetail-print',
                    extra: {
                        printType: printType
                    }
                });
                api&&api.closeFrame();
            }
        }
    });
    function bodyText(param) {
        if(param == 1) {
            printOrder.text = '确定打印订单？';
        } else if(param == 2){
            printOrder.text = '确定打印菜品标签？';
        }
    }
    bodyText(printType);
    module.exports = {};
});
