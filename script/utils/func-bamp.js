define(function(require, exports, module) {

    // baseWin头部操作事件

    function Func() {
        this['address-bMap'] = {
            onTapCity: function() {
                api.sendEvent({
                    name: 'address-bMap-city',
                    // extra: {
                    //     searchContent: searchContent
                    // }
                });
            },
            onTapSearch: function(searchContent) {
                if(searchContent) {
                    this.isSearch = false;
                    api.sendEvent({
                        name: 'address-bMap-searchAddr',
                        extra: {
                            searchContent: searchContent
                        }
                    });
                } else {
                    _g.toast('搜索内容不能为空');
                }
            },
            onTapConfirm: function(searchContent) {
                api.sendEvent({
                    name: 'address-bMap-confirm',
                    extra: {
                        searchContent: searchContent
                    }
                });
                this.isSearch = true;
            }
        };
        this['me-monthDetail'] = {
            onTapRightBtn: function() {
                api.execScript({
                    name: 'me-monthDetail-win',
                    frameName: 'me-monthDetail-frame',
                    script: 'window.month()'
                });
            }
        };
        this['cart-cart'] = {
            onTapRightBtn: function() {
                api.execScript({
                    name: 'cart-cart-win',
                    frameName: 'cart-cart-frame',
                    script: 'window.del()'
                });
            }
        };
        this['search-index'] = {
            onTapRightBtn: function(param) {
                api.sendEvent({
                    name: 'search-index-search',
                    extra: {
                        searchContent: param
                    }
                });
            },
            onSearchInput: function() {
                if(this.searchContent == '') {
                    api.sendEvent({
                        name: 'search-index-null',
                    });
                }
            }
        };
        this['address-manage'] = {
            onTapRightBtn: function() {
                api.execScript({
                    name: 'address-manage-win',
                    frameName: 'address-manage-frame',
                    script: 'window.addAddress()'
                });
            }
        };
        this['address-default'] = {
            onTapRightBtn: function() {
                api.execScript({
                    name: 'address-default-win',
                    frameName: 'address-default-frame',
                    script: 'window.addAddress()'
                });
            }
        };
        this['market-market'] = {
            onTapAddressBtn: function() {
                api.execScript({
                    name: 'market-market-win',
                    frameName: 'market-market-frame',
                    script: 'window.openAddress()'
                });
            },
            onTapSearchBtn: function() {
                api.execScript({
                    name: 'market-market-win',
                    frameName: 'market-market-frame',
                    script: 'window.openSearch()'
                });
            }
        };
        this['market-marketNew'] = {
            onTapAddressBtn: function() {
                // api.sendEvent({
                //     name: 'marketNew-marketNew-address',
                // });
                api.execScript({
                    name: 'market-marketNew-win',
                    frameName: 'market-marketNew-frame',
                    script: 'window.openAddress()'
                });
            },
            onTapSearchBtn: function() {
                api.execScript({
                    name: 'market-marketNew-win',
                    frameName: 'market-marketNew-frame',
                    script: 'window.openSearch()'
                });
                // api.sendEvent({
                //     name: 'marketNew-marketNew-search',
                // });
            }
        };
    }

    Func.prototype = {
        get: function(page) {
            return this[page] || {}
        }
    };

    Func.prototype.constructor = Func;

    module.exports = new Func();

});
