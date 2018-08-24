define(function(require, exports, module) {

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
        this['me-agreement'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'me-agreement-attention',
                });
            },
        };
        this['index-receiptReward'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'index-receiptReward-delAllReward',
                });
            },
            onAddCouponTap: function() {
                api && api.sendEvent({
                    name: 'index-receiptReward-addReward',
                });
            }
        };
        this['me-money'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'me-money-selectDate',
                });
            }
        };
        this['me-qrcode'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'me-qrcode-save',
                });
            }
        };
        this['orderManage-orderStay'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'orderManage-orderStay-search',
                });
            }
        };
        this['orderManage-order'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'orderManage-order-search',
                });
            }
        };
        this['financeManage-payPassword'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                    name: 'financeManage-payPassWord-savePwd',
                });
            }
        };
        this['orderManage-orderList'] = {
            onTapLeftBtn: function() {
                api && api.closeWin();
            },
            onTapRightBtn: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '年月日销售统计'
                        },
                    },
                    name: 'orderCensus-yearMonthCensus',
                    url: '../orderCensus/yearMonthCensus.html?mod=dev',
                    bounces: false,
                    slidBackEnabled: false,
                });

            }
        };
        this['orderCensus-yearMonthCensus'] = {
            onTapRightBtn: function() {
                api && api.sendEvent({
                        name: 'orderCensus-yearMonthCensus'
                    })
                    // api && api.closeWin();
            }
        };
        this['orderManage-myAddress'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                },
                onTapRightBtn: function() {
                    _g.openWin({
                        header: {
                            data: {
                                title: '添加收货地址'
                            }
                        },
                        name: 'orderManage-addAddress',
                        url: '../orderManage/addAddress.html?mod=dev',
                        bounces: false,
                        slidBackEnabled: false,
                        softInputMode: 'resize',
                        pageParam: {
                            userid: this.userid
                        }
                    });
                }
            },
            this['user-couponNote'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['user-integral'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['user-purchaseHistory'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['user-shareFriend'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['user-sign'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['user-visitHistory'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            // this['user-addUser'] = {
            //     onTapLeftBtn: function() {
            //         api && api.closeWin();
            //     }
            // },
            this['user-addUser'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['user-downUserIntegral'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['user-downUserMoney'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['user-resetPsw'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['user-userTopUp'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['orderManage-addAddress'] = {
                onTapLeftBtn: function() {
                    api && api.closeWin();
                }
            },
            this['search-index'] = {
                onSearchInput: function() {
                    this.isSearchInput = !!this.searchText;
                    if (!this.isSearchInput) return;
                    // api && api.sendEvent({
                    //     name: 'index-search-nameList',
                    //     extra: {
                    //         goods_name: this.searchText
                    //     }
                    // });
                },
                onSearchClearTap: function() {
                    this.searchText = '';
                    this.isSearchInput = false;
                },
                onTapRightBtn: function() {
                    if (!this.isSearchInput) return;
                    api && api.sendEvent({
                        name: 'search-index-search',
                        extra: {
                            searchText: this.searchText
                        }
                    });
                }
            };
        this['setting-user'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'setting-user-save',
                });
            }
        };
        this['message-index'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'message-index-edit',
                });
            }
        };
        this['me-answer'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'me-answer-edit',
                });
            }
        };
        this['coupon-coupon'] = {

            onTapRightBtn: function() {
                if(this.isEdit){
                    this.isEdit = false;
                }else{
                    this.isEdit = true;
                }
                api && api.sendEvent({
                    name: 'coupon-coupon-onTapRightBtn',
                });
            },
            onAddCouponTap: function() {
                api.sendEvent({
                    name: 'coupon-coupon-addCoupon'
                });
            }
        };
        this['activity-activity'] = {
            onTapLeftBtn: function() {
                api && api.closeWin();
            },
            onTapRightBtn: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '添加活动'
                        },
                        template: 'common/header-base-V'
                    },
                    name: 'activity-activityAdd',
                    url: '../activity/activityAdd.html?mod=dev',
                    bounces: false,
                    slidBackEnabled: false,
                });
                // api && api.closeWin();
            }
        };
        this['financeManage-financeM'] = {
            onTapLeftBtn: function() {
                api && api.closeWin();
            },
            onTapRightBtn: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '我的银行卡'
                        },
                        template: 'common/header-add-V'
                    },
                    name: 'financeManage-myBankCard',
                    url: '../financeManage/myBankCard.html?mod=dev',
                    bounces: false,
                    slidBackEnabled: false,
                });
                // api && api.closeWin();
            }
        };
        this['financeManage-myBankCard'] = {
            onTapLeftBtn: function() {
                api && api.closeWin();
            },
            onTapRightBtn: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '添加银行卡'
                        },
                        // template: 'financeManage/header-base-V'
                    },
                    name: 'financeManage-addBankCard',
                    url: '../financeManage/addBankCard.html?mod=dev',
                    bounces: false,
                    slidBackEnabled: false,
                });
                // api && api.closeWin();
            }
        };
        this['financeManage-cash'] = {
            onTapLeftBtn: function() {
                api && api.closeWin();
            },
            onTapRightBtn: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '限制说明'
                        },
                        // template: 'financeManage/header-base-V'
                    },
                    name: 'financeManage-limitAccount',
                    url: '../financeManage/limitAccount.html?mod=dev',
                    bounces: false,
                    slidBackEnabled: false,
                });
                // api && api.closeWin();
            }
        };
        this['cost-costM'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'cost-menu',
                });
            }
        }
        this['orderManage-orderDetail'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'orderDetail-menu',
                });
            }
        }
        this['orderManage-readySendDetail'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'readySendDetail-menu',
                });
            }
        }
        this['orderManage-readyDestroyDetail'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'readyDestroyDetail-menu',
                });
            }
        }
        this['manageSetUp-managerList'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'managerList-menu',
                });
            }
        }
        this['user-user'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'user-menu',
                });
            }
        }
        this['user-userDetail'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'userDetail-menu',
                });
            }
        }
        this['orderCensus-yearMonthCensus'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    // name: 'yearMonthCensus-menu',
                    name: 'orderCensus-yearMonthCensus',
                });
            }
        }
        this['distribution-distribution'] = {
            onTapRightBtn: function() {
                api.sendEvent({
                    name: 'distribution-menu',
                });
            }
        }


    }

    Func.prototype = {
        get: function(page) {
            return this[page] || {}
        }
    };

    Func.prototype.constructor = Func;

    module.exports = new Func();

});
