define(function(require, exports, module) {
    var xx_id = api && api.pageParam.xx_id;
    var xx_nc = api && api.pageParam.xx_nc;
    var xx_ms = api && api.pageParam.xx_ms;
    var xx_gs = api && api.pageParam.xx_gs;
    var xx_sj = api && api.pageParam.xx_sj;
    var Http = require('U/http');

    var messageDetail = new Vue({
        el: '#messageDetail',
        template: _g.getTemplate('message/messageDetail-V'),
        data: {
            message_id: '',
            message_title: '',
            message_time: '',
            message_overview: '',
            message_pic: '',
            message_content: '',
        },
        methods: {

        },
    });

    function machData() {
        messageDetail.message_id = xx_id;
        messageDetail.message_title = xx_nc;
        messageDetail.message_time = xx_sj;
        messageDetail.message_overview = xx_gs;
        messageDetail.message_content = xx_ms;
    }
    machData();
    module.exports = {};
});
