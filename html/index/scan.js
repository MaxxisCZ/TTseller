define(function(require, exports, module) {
    var FNScanner = api.require('FNScanner');
	var Http = require('U/http');
    var scan = new Vue({
        el: '#scan',
        template: _g.getTemplate('index/scan-main-V'),
        data: {
            show: false
        },
        methods: {

        },
    });

    setTimeout(function() {
        openScanner();
    }, 100);

    api.addEventListener({
        name: 'openScanner'
    }, function(ret, err) {
        openScanner();
    });

    api.addEventListener({
        name: 'hideScanner'
    }, function(ret, err) {
        hideScanner();
    });

    function openScanner() {
        // FNScanner.openScanner({
        //     autorotation: true
        // }, function(ret, err) {
        //     if (ret) {
        //         alert(JSON.stringify(ret));
        //     } else {
        //         alert(JSON.stringify(err));
        //     }
        // });
        FNScanner.openView({
            rect: {
                x: 0,
                y: api.winHeight - api.frameHeight,
            }
        }, function(ret) {
            if (ret.eventType == 'show') {
                showScanner();
            } else if (ret.eventType == 'success') {
                matchContent(ret.content);
            } else if (ret.eventType == 'fail') {

            }
        });
    }

    function showScanner() {
        // 安卓优化
        if (api.systemType == 'android') {
            setTimeout(function() {
                api.bringFrameToFront({
                    from: 'scan-index-frame'
                });
            }, 500);

            setTimeout(function() {
                scan.show = true;
            }, 1000);

            return;
        }
        // ios正常处理
        api.bringFrameToFront({
            from: 'scan-index-frame'
        });
        scan.show = true;
    }

    function matchContent(content) {
        // alert(win_name);
        if (Number(content) + '' != 'NaN') {
            // 扫描结果是数字
            // if (win_name == 'shop-inventoryCheckeditorSearch-win' || win_name == 'shop-inventorycheck-win' || win_name == 'shop-inventorycheckeditor-win') {
            //     getInventory(content);
            //     //如果窗口的名字是库存成本查询，
            // } else if (win_name == 'shop-goodsCostCheck-win') {
            //     getGoodsCostCheck(content);
            // } else if (win_name == 'shop-commodityflowqueryGoodsList-win') {
            //     getGoodFlowForScan(content);
            // }
        } else {
            // 校验是否网址
            // var urlReg = /^(http|https|ftp)\:\/\/)$/;
            var urlReg = /(http|https|ftp)/;
            if (urlReg.test(content)) {
                if (content.indexOf('company_id') < 0 || content.indexOf('id') < 0) {
                    _g.toast('没有匹配的商品信息');
                } else {
                    // var params = content.split('?')[1].split('&');
                    // var business_area_id = 0;
                    // var goods_id = 0;
                    // _.each(params, function(item) {
                    //     var param = item.split('=');
                    //     if (param[0] == 'company_id') business_area_id = param[1];
                    //     if (param[0] == 'id') goods_id = param[1];
                    // });
                    // if (business_area_id && goods_id) {
                    //     openDetailPage(business_area_id, goods_id);
                    // } else {
                    //     _g.toast('没有匹配的商品信息');
                    // }
                }
            } else {
                _g.toast('没有匹配的商品信息');
            }
        }
    }
    
    module.exports = {};

});