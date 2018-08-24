define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var searchUser = new Vue({
        el: '#searchUser',
        template: _g.getTemplate('popupbox/searchUser-main-V'),
        data: {
            isNetwork: false,
            searchText: '',
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
                    name: 'user-user-searchUser',
                    extra: {
                        text: this.searchText,
                    },
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