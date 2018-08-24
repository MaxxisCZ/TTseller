define(function(require, exports, module) {
	var Http = require('U/http');
    var information = new Vue({
        el: '#information',
        template: _g.getTemplate('financeManage/information-main-V'),
        data: {
            
        },
        methods: {
            onNextTap: function(){
                _g.openWin({
                    header:{
                        data:{
                            title:'填写校验码'
                        }
                    },
                    name: 'financeManage-code',
                    url: '../financeManage/code.html',
                    bounces: false,
                    slidBackEnabled: false,
                    pageParam: {

                    }
                });
            }
        },
    });

    module.exports = {};

});