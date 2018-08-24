define(function(require, exports, module) {
    var desc = new Vue({
        el: '#desc',
        template: _g.getTemplate('me/desc-V'),
        data: {
            desc: '交通银行储蓄卡（尾号4104）',
            descMoney: '10,000',
            descDayMoney: '10,000',
            descMonthMoney: '200,000',
        },
        methods: {

        }
    });

    function getdata() {

    }

    module.exports = {};
});
