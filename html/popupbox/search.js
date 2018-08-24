define(function(require, exports, module) {
    var Http = require('U/http');
    var search = new Vue({
        el: '#search',
        template: _g.getTemplate('popupbox/search-V'),
        data: {
            mobile: '',
        },
        methods: {
            onCancelTap:function(){
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            },
            onSearchTap: function(){
                api.sendEvent({
                    name: 'orderManage-order-searchText',
                    extra: {
                        mobile: this.mobile
                    }
                });
                api&&api.closeFrame();
            },

        }
    });
    module.exports = {};
});