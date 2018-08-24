define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var refund = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/refund-main-V'),
        data: {
            reason: '',
        },
        methods: {
            onCancelTap: function() {
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            },
            onSubmitTap: function() {
                api.sendEvent({
                    name: 'orderManage-readySendDetail-refund',
                    extra: {
                        reason: refund.reason
                    }
                });
                api.sendEvent({
                    name: 'orderManage-finishOrderDetail-refundReason',
                    extra: {
                        reason: refund.reason
                    }
                });
                api.sendEvent({
                    name: 'orderManage-applyRefundDetail-refundReason',
                    extra: {
                        reason: refund.reason
                    }
                });
                api.sendEvent({
                    name: 'orderManage-orderDetail-refundReason',
                    extra: {
                        reason: refund.reason
                    }
                });
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            }
        }
    });
    module.exports = {};
});