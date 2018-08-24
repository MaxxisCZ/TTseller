define(function(require, exports, module) {
    var FNScanner = api.require('FNScanner');
    var UserInfo = _g.getLS('UserInfo');
    var Http = require('U/http');
    var scanBody = new Vue({
        el: '#scanBody',
        template: _g.getTemplate('scan/index-body-V'),
        data: {
            show: false
        },
        methods: {

        }
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
                scanBody.show = true;
            }, 1000);

            return;
        }
        // ios正常处理
        api.bringFrameToFront({
            from: 'scan-index-frame'
        });
        scanBody.show = true;
    }

    function matchContent(content) {
        // alert(content);
        // return
        // alert(win_name);
        // 校验是否网址
        var urlReg = /(http|https|ftp)/;
        if (urlReg.test(content)) {
            api.sendEvent({
                name: 'index-system-openUrl',
                extra: {
                    url: content
                }
            });
        } else {
            sendGoods(content);
        }
    }
    function sendGoods(orderid) {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                ddzt: 2,
                orderid: orderid,
            },
            lock: false,
            url: '/jiekou/agentht/order/editStatus.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    _g.toast(ret.msg);
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    
    module.exports = {};

});
