define(function(require,exports,module) {
    var bankList = new Vue({
        el:'#bankList',
        template:_g.getTemplate('me/bank-list-V'),
        data:{
            list:[{
                bankBg:'../../image/me/bank_bg.png',
                bankIcon:'../../image/me/bankIcon.png',
                bankName:'农业银行',
                card:'储蓄卡',
                bankNumber:'xxxx  xxxx  xxxx  6943'
            },{
                bankBg:'../../image/me/bank_bg1.png',
                bankIcon:'../../image/me/bankIcon1.png',
                bankName:'建设银行',
                card:'储蓄卡',
                bankNumber:'xxxx  xxxx  xxxx  1314'
            }]
        },
        methods:{

        }
    });

    function getdata() {

    }

    module.exports = {};
});
