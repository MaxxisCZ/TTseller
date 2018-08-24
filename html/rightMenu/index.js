define(function(require, exports, module) {
    var Http = require('U/http');
    var list = api.pageParam.list;
    var show = false;

    var orderDetailMenu = new Vue({
        el: '#content',
        template: _g.getTemplate('rightMenu/index-V'),
        data: {
            isNetwork: false,
            list: []
        },
        created: function() {
            this.list = list;
        },
        ready: function() {
            show = true;
        },
        methods: {
            onCancelTap: function() {
                // alert(111);
                hiddenFrame();
            },
            onShowTap: function(index) {
                // api && api.sendEvent({
                //     name: 'list-choose',
                //     extra: {
                //         index: index,
                //     }
                // });
               


                api && api.sendEvent({
                    name: api.winName + '-menu-onItemTap',
                    extra: {
                        index: index,
                    }
                });
                 api && api.setFrameAttr({
                    name: api.frameName,
                    hidden: true,
                });
            },

        }
    });

    function hiddenFrame() {
        show = false;
        api && api.setFrameAttr({
            name: api.frameName,
            hidden: true,
        });
    }

    function showFrame() {
        show = true;
        api && api.setFrameAttr({
            name: api.frameName,
            hidden: false,
        });
    }

    api.addEventListener({
        name: 'global-menu-onBtnTap',
    }, function(ret, err) {
        if (show) hiddenFrame();
        else showFrame();
    });
    api.addEventListener({
        name: 'global-menu-setList',
    }, function(ret, err) {
        orderDetailMenu.list = ret.value.list;
    });
    module.exports = {};
});
