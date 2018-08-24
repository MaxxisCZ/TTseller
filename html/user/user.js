define(function(require, exports, module) {
    var sortway = 1;
    var loginname = _g.getLS('UserInfo').loginname;
    var agentid = _g.getLS('UserInfo').agentid;
    var staffid = _g.getLS('UserInfo').staffid;
    var token = _g.getLS('UserInfo').token;
    var pageIndex = 1;
    var pageSize = 30;
    var Http = require('U/http');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var user = new Vue({
        el: '#user',
        template: _g.getTemplate('user/user-main-V'),
        data: {
            header1: '账号',
            header2: '累积消费额',
            header3: '最近消费时间',
            header4: '购买频率',
            userSum: '',
            isBalance: false,
            isRegister: false,
            searchText: '',
            topIndex: 0,
            topList: [{
                title: '全部',
                isSelect: 1
            }, {
                title: '注册时间',
                isSelect: 0
            }, {
                title: '消费金额',
                isSelect: 0
            }, {
                title: '消费时间',
                isSelect: 0
            }, {
                title: '余额',
                isSelect: 0
            }, {
                title: '购买频率',
                isSelect: 0
            }, ],
            list: [{
                account: 18666666667,
                sumConsume: 110.00,
                consumeTime: '2016/8/11 12:56:20',
                buyRate: 30,
                userID: '',
                register: '',
                balance: '',
                registerDate: '',
                registerTime: '',
                consumeDate: '',
                consumeTime: '',
            }, ]
        },
        created: function() {
            this.list = [];
        },
        methods: {
            onChangeTap: function(index) {
                if(user.topIndex == index) return
                setTimeout(function() {
                    pageIndex = 1;
                    user.list = [];
                    if (index == 0) {
                        sortway = 1;
                        user.header1 = '账号';
                        user.header2 = '累积消费额';
                        user.header3 = '最近消费时间';
                        user.header4 = '购买频率';
                        user.isBalance = false;
                        user.isRegister = false;
                    } else if (index == 1) {
                        sortway = 2;
                        user.header1 = '账号';
                        user.header2 = '累积消费额';
                        user.header3 = '注册时间';
                        user.header4 = '购买频率';
                        user.isBalance = false;
                        user.isRegister = true;
                    } else if (index == 2) {
                        sortway = 4;
                        user.header1 = '账号';
                        user.header2 = '累积消费额';
                        user.header3 = '最近消费时间';
                        user.header4 = '购买频率';
                        user.isBalance = false;
                        user.isRegister = false;
                    } else if (index == 3) {
                        sortway = 3;
                        user.header1 = '账号';
                        user.header2 = '累积消费额';
                        user.header3 = '最近消费时间';
                        user.header4 = '购买频率';
                        user.isBalance = false;
                        user.isRegister = false;
                    } else if (index == 4) {
                        sortway = 5;
                        user.header1 = '账号';
                        user.header2 = '余额';
                        user.header3 = '注册时间';
                        user.header4 = '购买频率';
                        user.isBalance = true;
                        user.isRegister = true;
                    } else if (index == 5) {
                        sortway = 6;
                        user.header1 = '账号';
                        user.header2 = '累积消费额';
                        user.header3 = '最近消费时间';
                        user.header4 = '购买频率';
                        user.isBalance = false;
                        user.isRegister = false;
                    }
                    user.topList[index].isSelect = true;
                    user.topList[user.topIndex].isSelect = false;
                    user.topIndex = index;
                    getUserData(sortway);
                }, 100);
            },
            onSearchTap: function() {
                pageIndex = 1;
                if(this.searchText != '') {
                    searchData();
                } else {
                    _g.toast('请输入需要搜索用户的用户名或用户账号');
                }
            },
            onUserDetailTap: function(index) {
                _.each(this.list, function(n, i) {
                    if (i == index) {
                        _g.openWin({
                            header: {
                                data: {
                                    title: '用户详情'
                                },
                                template: 'common/header-apostrophe-V'
                            },
                            name: 'user-userDetail',
                            url: '../user/userDetail.html',
                            bounces: false,
                            softInputMode: 'resize',
                            slidBackEnabled: false,
                            pageParam: {
                                userid: n.userID
                            }
                        });
                    }
                });
            }
        },
    });
    var getUserData = function(sortway) {
        _g.showProgress();
        Http.ajax({
            data: {
                sortway: sortway,
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            // isSync: true,
            url: '/jiekou/agentht/user/getUser.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        var list = arrAddObject(ret.data);
                        if(pageIndex == 1) {
                            user.list = arrAddObject(ret.data);
                        } else {
                            user.list = user.list.concat(list);
                        }
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 500);
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
                        user.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    function searchData() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                token: _g.getLS('UserInfo').token,
                param: user.searchText,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            isSync: true,
            url: '/jiekou/agentht/user/searchUser.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            user.list = arrAddObject(data);
                        } else {
                            user.list = user.list.concat(arrAddObject(data));
                        }
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 500);
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
                        user.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }
    var arrAddObject = function(result) {
        var data = result ? result : '';
        var users = data.users ? data.users : '';
        var newArray = [];
        for (var i = 0; i < data.usersl; i++)
            newArray.push({
                account: users['user_' + (i + 1) + '_zh'],
                sumConsume: users['user_' + (i + 1) + '_ljxfe'],
                consumeTime: users['user_' + (i + 1) + '_zjxfsj'] || '--',
                consumeDate: getDate(users['user_' + (i + 1) + '_zjxfsj']),
                consumeTime: getTime(users['user_' + (i + 1) + '_zjxfsj']),
                buyRate: users['user_' + (i + 1) + '_pl'],
                userID: users['user_' + ( i + 1 ) + '_id'],
                balance: users['user_' + ( i + 1 ) + '_ye'],
                register: users['user_' + ( i + 1 ) + '_zcsj'] || '--',
                registerDate: getDate(users['user_' + ( i + 1 ) + '_zcsj']),
                registerTime: getTime(users['user_' + ( i + 1 ) + '_zcsj']),
            });
        return (newArray);
    }
    var getSearchDetail = function(result) {
        var data = result ? result : '';
        var users = data.users ? data.users : '';
        var newArray = [];
        for (var i = 0; i < data.usersl; i++)
            newArray.push({
                account: users['user_' + (i + 1) + '_zh'],
                sumConsume: users['user_' + (i + 1) + '_ljxfe'],
                consumeTime: users['user_' + (i + 1) + '_zjxfsj'] || '--',
                consumeDate: getDate(users['user_' + (i + 1) + '_zjxfsj']),
                consumeTime: getTime(users['user_' + (i + 1) + '_zjxfsj']),
                buyRate: users['user_' + (i + 1) + '_pl'],
                userID: users['user_' + ( i + 1 ) + '_id'],
                balance: users['user_' + ( i + 1 ) + '_ye'],
                register: users['user_' + ( i + 1 ) + '_zcsj'] || '--',
                registerDate: getDate(users['user_' + ( i + 1 ) + '_zcsj']),
                registerTime: getTime(users['user_' + ( i + 1 ) + '_zcsj']),
            });
        return (newArray);
    }
    function getDate(param) {
        var date = param.substr(0, 10);
        return (date)
    }
    function getTime(param) {
        var time = param.substr(11, 8);
        return (time)
    }
    api.addEventListener({
        name: 'user-menu',
    }, function(ret, err) {
        if (!window.isMenuOpen) {
            _g.openMenuFrame({
                list: ['搜索', '给用户充值']
            });
        } else {
            api.sendEvent({
                name: 'global-menu-onBtnTap',
            });
        }

    });
    api.addEventListener({
        name: api.winName + '-menu-onItemTap',
    },function(ret,err){
        if(ret.value.index == 0){
            api && api.openFrame({
                name: 'popupbox-searchUser',
                url: '../popupbox/searchUser.html',
                rect: {
                    x: 0,
                    y: headerHeight,
                    w: 'auto',
                    h: windowHeight,
                },
            });
        }
        //  else if(ret.value.index == 1){
        //     _g.openWin({
        //         header:{
        //             data:{
        //                 title: '添加用户'
        //             },
        //             // template: ''
        //         },
        //         name: 'user-addUser',
        //         url: '../user/addUser.html',
        //         bounces: false,
        //         slidBackEnabled: false,
        //         pageParam: {

        //         }
        //     });
        // } else if(ret.value.index == 2){
        //     _g.openWin({
        //         header:{
        //             data:{
        //                 title: '重置密码'
        //             },
        //             // template: ''
        //         },
        //         name: 'user-resetPsw',
        //         url: '../user/resetPsw.html',
        //         bounces: false,
        //         slidBackEnabled: false,
        //         pageParam: {

        //         }
        //     });
        // } 
        else if(ret.value.index == 1){
            _g.openWin({
                header:{
                    data:{
                        title: '给用户充值'
                    },
                    // template: ''
                },
                name: 'user-userTopUp',
                url: '../user/userTopUp.html',
                bounces: false,
                slidBackEnabled: false,
                pageParam: {

                }
            });
        }
    });
    api && api.addEventListener({
        name: 'user-addUser-refresh'
    }, function(ret, err) {
        getUserData(sortway);
    });
    api && api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0
        }
    }, function(ret, err) {
        pageIndex ++;
        if(user.searchText != '') {
            searchData();
        } else {
            getUserData(sortway);
        }
    });
    api.addEventListener({
        name: 'user-user-searchUser',
    }, function(ret, err) {
        if(ret.value.text != '') {
            pageIndex = 1;
            Http.ajax({
                data: {
                    loginname: _g.getLS('UserInfo').loginname,
                    agentid: _g.getLS('UserInfo').agentid,
                    staffid: _g.getLS('UserInfo').staffid,
                    token: _g.getLS('UserInfo').token,
                    param: ret.value.text,
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                },
                url: '/jiekou/agentht/user/searchUser.aspx',
                success: function(ret) {
                    if(ret.zt == 1) {
                        var data = ret.data;
                        user.list = arrAddObject(data);
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
                            _g.closeWins(['main-index-win'])
                        }, 1000)
                    } else {
                        _g.toast(ret.msg);
                    }
                },
                error: function(err) {},
            });  
        } else {
            _g.toast('请输入需要搜索用户的用户名或用户账号');
        }
    });
    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            window.isNoMore = false;
            pageIndex = 1;
            // user.list = [];
            getUserData(sortway);
        }, 0);
    });
    getUserData(sortway);

    module.exports = {};

});
