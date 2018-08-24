define(function(require, exports, module) {

    var opts = api && api.pageParam.opts;
    var Func = require('U/func');
    opts.header.methods = opts.header.methods || Func.get(opts.name);
    var header = _g.addHeader(opts.header);
    _g.addContent(opts);
    api && api.addEventListener({
        name: api.winName + '-updateTitle'
    }, function(ret, err) {
        setTimeout(function() {
            header.frameName = '';
            header.title = ret.value.title;
            if (ret.value.frameName) header.frameName = ret.value.frameName;
        }, 0);
    });

    api && api.addEventListener({
        name: api.winName + '-updateRightText'
    }, function(ret, err) {
        setTimeout(function() {
            header.rightText = ret.value.rightText;
        }, 0);
    });

    api && api.addEventListener({
        name: api.winName + '-updateHeaderData'
    }, function(ret, err) {
        setTimeout(function() {
            _.each(ret.value, function(val, key) {
                header[key] = val;
            });
        }, 0);
    });
    api && api.addEventListener({
        name: api.winName + '-hideRightBtn'
    }, function(ret, err) {
        setTimeout(function() {
            if (ret.value.isShow == 1) {
                $('.ui-header__rightBtn').find('span').addClass('ui-header__rightMenu');
            } else {
                $('.ui-header__rightBtn').find('span').removeClass('ui-header__rightMenu');
            }
        }, 0);
    });
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {

        if (api.winName == 'product-product-win') {
            api.sendEvent({
                name: 'backToList'
            });
        }else{
            api.closeWin();
        }
    });

    // 监听百度地图页面的按钮
    api.addEventListener({
        name: 'common-bMap-V-btn'
    }, function(ret, err) {
        if (api.winName == 'address-bMap-win') {
            header.isSearch = false;
        }
    });

    module.exports = {};

});
