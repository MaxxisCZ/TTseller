define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var popupbox = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/productQuery-body-V'),
        data: {
            isNetwork: false,
            productNameOrID: '',
        },
        methods: {
            onCancelTap: function() {
                api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
                this.productNameOrID = '';
            },
            onSearchNameTap: function() {
                api.sendEvent({
                    name: 'search-product',
                    extra: {
                        content: this.productNameOrID
                    }
                });

                setTimeout(function() {
                    popupbox.productNameOrID = '';
                    api.setFrameAttr({
                        name: api.frameName,
                        hidden: true,
                    });
                }, 250);
                // Http.ajax({
                //     data:{
                //         loginname: UserInfo.loginname,
                //         agentid: UserInfo.agentid,
                //         staffid: UserInfo.staffid,
                //         token: UserInfo.token,
                //         pageIndex: 1,
                //         param: this.productID || this.productName,
                //     },
                //     url: '/jiekou/agentht/product/searchProduct.aspx',
                //     success: function(ret){
                //         if(ret.zt == 1){

                //         } else{
                //             _g.toast(ret.msg);
                //         }
                //     },
                //     error: function(err){}
                // });
            }

        }
    });
    module.exports = {};
});
