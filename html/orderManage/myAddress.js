define(function(require, exports, module) {
    var userid = api && api.pageParam.userid;
    var addrid = api && api.pageParam.addrid;
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var myAddress = new Vue({
        el: '#myAddress',
        template: _g.getTemplate('orderManage/myAddress-main-V'),
        data: {
            addressNum: '',
            detail: [{
                name: '刘建亮',
                phone: '18626253547',
                kind: '公司',
                city: '昆山市',
                Address: '恒龙五金城-a栋单元1017',
                addrid: ''
            }],
        },
        created: function() {
            this.detail = [];
        },
        methods: {
            onEditAddressTap: function(index) {
                _.each(this.detail, function(n,i) {
                    if(i == index) {
                        _g.openWin({
                            header:{
                                data:{
                                    title: '编辑收货地址'
                                },
                                template: '../html/main/header-V',
                            },
                            name: 'orderManage-editAddress',
                            url: '../orderManage/editAddress.html',
                            bounces: false,
                            slidBackEnabled: false,
                            softInputMode: 'resize',
                            pageParam: {
                                addrid: n.addrid
                            }
                        });
                    }
                });
            },
            onDeleteTap: function(index) {
                Http.ajax({
                    data: {
                        loginname: _g.getLS('UserInfo').loginname,
                        agentid: _g.getLS('UserInfo').agentid,
                        staffid: _g.getLS('UserInfo').staffid,
                        token: _g.getLS('UserInfo').token,
                        userid: userid,
                        addrid: myAddress.detail[index].addrid
                    },
                    isSync: true,
                    url: '/jiekou/agentht/order/deleteAddress.aspx',
                    success: function(ret) {
                        if(ret.zt == 1) {
                            pageIndex = 1;
                            // myAddress.detail = [];
                            getmyAddressData();
                        } else if(ret.zt == -1) {
                            _g.rmLS('UserInfo');
                            api && api.openWin({
                                name: 'account-login-win',
                                url: '../account/login.html',
                                pageParam: {
                                    from: 'root'
                                },
                                bounces: false,
                                slidBackEnabled: false,
                                animation: {
                                    type: 'none'
                                }
                            });
                            setTimeout(function() {
                                _g.closeWins(['main-index-win']);
                            }, 1000)
                        } else {
                            _g.toast(ret.msg);
                        }
                    },
                });
            }
            
        },
    });
    var getmyAddressData = function() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                userid: userid,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            url: '/jiekou/agentht/order/getAddress.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            myAddress.detail = getmyAddressDetail(data);
                        } else {
                            myAddress.detail = myAddress.detail.concat(getmyAddressDetail(data));
                        }
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 0)
                    }, 0);
                } else if(ret.zt == -1) {
                    _g.hideProgress();
                    _g.rmLS('UserInfo');
                    api && api.openWin({
                        name: 'account-login-win',
                        url: '../account/login.html',
                        pageParam: {
                            from: 'root'
                        },
                        bounces: false,
                        slidBackEnabled: false,
                        animation: {
                            type: 'none'
                        }
                    });
                    setTimeout(function() {
                        _g.closeWins(['main-index-win'])
                    }, 1000)
                } else {
                    if(pageIndex == 1) {
                        myAddress.detail = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
        });
    }
    var getmyAddressDetail = function(result) {
        var data = result ? result : '';
        var addrs = data.addrs ? data.addrs : '';
        var newDetail = [];
        for(var i = 0; i < data.addrsl; i++)
            newDetail.push({
                name: addrs['addr_'+(i+1)+'_shr'],
                phone: addrs['addr_'+(i+1)+'_mobile'],
                kind: addrType(addrs['addr_'+(i+1)+'_kind']),
                Address: addrs['addr_'+(i+1)+'_addr'],
                addrid: addrs['addr_'+(i+1)+'_id'],
            });
        return(newDetail);
    }
    var addrType = function(result) {
        if(result == 1) {
            return('公司');
        } else if(result == 2) {
            return('住宅');
        } else if(result == 3) {
            return('学校');
        } else {
            return('其他');
        }
    }
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getmyAddressData();
    });
    api.addEventListener({
        name: 'orderManage-myAddress-addRefresh',
    }, function(ret, err) {
        pageIndex = 1;
        // myAddress.detail = [];
        getmyAddressData();
    });
    api.addEventListener({
        name: 'orderManage-myAddress-editRefresh',
    }, function(ret, err) {
        pageIndex = 1;
        // myAddress.detail = [];
        getmyAddressData();
    });
    _g.setPullDownRefresh(function() {
        window.isNoMore = false;
        pageIndex = 1;
        // myAddress.detail = [];
        getmyAddressData();
    });
    getmyAddressData();
    module.exports = {};

});