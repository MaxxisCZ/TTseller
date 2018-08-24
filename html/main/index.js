define(function(require, exports, module) {
    api.removeLaunchView();
    var Http = require('U/http');
    var headerHeight = 0;
    var footerHeight = 0;
    var windowHeight = api.winHeight || window.innerHeight;
    var messageRead = setInterval(getMessageRead, 300000);
    var systemType = api.systemType;
    var UserInfo = _g.getLS('UserInfo');
    var pageIndex = 1;
    var pageSize = 10;
    var unReadMsg = new Array();
    var header = new Vue({
        el: '#header',
        template: _g.getTemplate('common/header-base-V'),
        data: {
            cancel: '取消',
            select: '全选',
            hasMsg: true,
            isMessage: false,
            showCancel: false,
            active: 0,
            title: '应用',
            isHome: 1,
            list: [
                '应用',
                '消息',
                '客服',
                '我的',
            ],
        },
        methods: {
            onCancelBtn: function() {
                api.sendEvent({
                    name:'message-messageList-cancelAll'
                });
            },
            onSelectBtn: function() {
                if(header.hasMsg == true) {
                    api.sendEvent({
                        name:'message-messageList-selectAll'
                    });
                } else {
                    _g.toast('目前没有消息可选哦~');
                }
            }
        }
    });

    var footer = new Vue({
        el: '#footer',
        template: _g.getTemplate('main/footer-V'),
        data: {
            show: true,
            active: 0,
            homeIndex: 0,
            unreadNumber: 0,
            list: [{
                title: '应用',
                tag: 'appGreen',
            }, {
                title: '消息',
                tag: 'messageGreen'
            }, {
                title: '客服',
                tag: 'serviceGreen'
            }, {
                title: '我的',
                tag: 'meGreen'
            }]
        },
        methods: {
            onItemTap: function(index) {
                if (this.active == index) {
                    return;
                } else if(UserInfo.checkflag == false && index == 0) {
                    alert('代理商未通过审核');
                    return;
                } else if (index == 2) {
                    openService();
                    return;
                }
                if (index == 1) {
                    header.isMessage = true;
                } else {
                    header.isMessage = false;
                    header.showCancel = false;
                    api.sendEvent({
                        name:'main-message-hideFooter'
                    });
                }
                header.title = this.list[index].title;
                setFrameGroupIndex(index);
            },
        }
    });

    setTimeout(function() {
        openFrameGroup();
    }, 0);

    function openService() {
        var UserInfo = _g.getLS('UserInfo');
        //创建美洽
        var mq = api.require('meiQia');
        //配置初始化美洽需要的appkey
        var param = {
            appkey: "55d7fb206296d36073d0f46dfec4d743"
        };
        //初始化美洽
        mq.initMeiQia(param, function(ret, err) {
            if (ret) {
                var sex = '男';
                var age = 0;
                var date = new Date();
                if(UserInfo.sex = '0') {
                    sex = '女';
                }
                var birthYear = UserInfo.birth.substring(0,4);
                age = date.getFullYear() - parseInt(birthYear);
                //alert("初始化成功：\n\n" + JSON.stringify(ret) + "\n\n点击按钮继续");
                //===============启动美洽聊天  开始==================================
                //设置指定分配给某某客服
                //var scheduleParam = {
                //    agentId:"美洽客服的ID"
                //};
                //mq.setScheduledAgentOrAgentGroup(scheduleParam);
                //设置用户信息
                var infoParam = {
                    avatar: UserInfo.head, //头像 URL
                    age: age, //年龄
                    gender: sex, //性别
                    name: UserInfo.loginname, //名字
                    tel: UserInfo.mobile, //电话
                    comment: UserInfo.agentid + ',' + UserInfo.agentname + ',' + UserInfo.staffid, // 代理商id和名字,员工id
                };
                mq.setClientInfo(infoParam);

                //设置自定义用户Id
                var customizedIdParam = {
                    id: UserInfo.staffid
                };
                mq.setLoginCustomizedId(customizedIdParam);

                //设置美洽ID
                //var clientIdParam = {
                //    id:"9f0b2d3339edeec591a6e3be5dbafd64"
                //};
                //mq.setLoginMQClientId(clientIdParam);

                //设置标题栏背景颜色
                var titleBarColor = {
                    color: "#21b871"
                };
                mq.setTitleBarColor(titleBarColor);
                //设置title以及按钮颜色
                var titleColor = {
                    color: "#FFFFFE"
                };
                mq.setTitleColor(titleColor);
                //打开美洽客服界面
                mq.show();
                //===============启动美洽聊天  开始==================================
            } else {
                alert("初始化失败：\n\n" + JSON.stringify(err));
            }
        })
    }

    function getMessageRead() {
        if(_g.getLS('UserInfo')) {
            Http.ajax({
                data: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    token: UserInfo.token,
                    pageIndex: 1,
                    pageSize: 20,
                },
                // isSync: true,
                lock: false,
                url: '/jiekou/agentht/message/getMs2.aspx',
                success: function(ret) {
                    if (ret.zt == 1) {
                        setTimeout(function() {
                            if(ret.data.xxnr.length>0) {
                                footer.show = true;
                            }else {
                                footer.show = false;
                            }
                            unReadMsg = [];
                            _.each(ret.data.xxnr, function(n, i) {
                                if (n.xx_yd == 0) {
                                    unReadMsg.push(n.xx_nc);
                                }
                            });
                        },0);
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
                    } else {
                        footer.show = false;
                    }
                },
                error: function() {},
            });
        }
    }

    getMessageRead();

    function openFrameGroup() {
        if(UserInfo.checkflag == false) {
            footer.homeIndex = 3;
            // alert(footer.homeIndex);
        }
        headerHeight = $('#header').offset().height;
        footerHeight = $('#footer').height();
        _g.setLS('appH', {
            'header': headerHeight,
            'footer': footerHeight,
            'win': windowHeight
        });
        api && api.openFrameGroup({
            name: 'main-group',
            scrollEnabled: false,
            rect: {
                x: 0,
                y: headerHeight,
                w: 'auto',
                h: windowHeight - headerHeight - footerHeight
            },
            index: footer.homeIndex,  // 进入主页面的第几个下标值
            preload: 1,
            frames: [{
                name: 'index-home-frame',
                url: '../index/home.html',
                bounces: false,
                bgColor: '#ededed',
            }, {
                name: 'message-home-frame',
                url: '../message/messageList.html',
                bounces: false,
                bgColor: '#ededed',
            }, {
                // name: 'index-service-frame',
                // url: '../index/service.html',
                // bounces: false,
                // bgColor: '#ededed',

            }, {
                name: 'me-index-frame',
                url: '../me/index.html',
                bounces: false,
                bgColor: '#ededed',
            }]
        }, function(ret, err) {
            footer.active = ret.index;
        });
    }

    function setFrameGroupIndex(index) {
        api && api.setFrameGroupIndex({
            name: 'main-group',
            index: index,
            scroll: false
        });
    }

    api && api.addEventListener({
        name: 'main-message-showRedDot'
    }, function(ret, err) {
        getMessageRead();
    });
    // 页面打开完成
    api && api.addEventListener({
        name: 'viewappear'
    }, function(ret, err) {
        _g.closeWins(['account-system-win']);
    });

    // 监听安卓返回按钮事件
    api && api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        // api.closeWidget();
        api.toLauncher();
    });

    // 监听消息列表是否有消息，全选不能点击
    api && api.addEventListener({
        name: 'main-index-noSelect'
    }, function(ret, err) {
        header.hasMsg = false;
    });

    function checkNotificationTime() {
        var sendNotificationTime_old = _g.getLS('sendNotificationTime');
        if (!sendNotificationTime_old) return true;
        var sendNotificationTime_now = new Date().getTime();
        if (Number(sendNotificationTime_now) - Number(sendNotificationTime_old) > 3 * 60 * 60 * 1000) {
            return true;
        } else {
            return false;
        }
    }
    // 新的订单消息给清除
    function cleanUpMessage() {
        Http.ajax({
            data: {
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                loginname: UserInfo.loginname,
                msflag: 0,
            },
            isSync: false,
            url: '/jiekou/agentht/staff/setMsflag.aspx',
            success: function(ret) {
                if (ret.zt == 1) {

                }
            },
            error: function(err) {},
        });
    }
    // 获取是否有新的消息
    function findUpdata() {
    //  alert('1')
        Http.ajax({
            data: {
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                loginname: UserInfo.loginname,
            },
            isSync: false,
            url: '/jiekou/agentht/staff/getMsflag.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    if(ret.data.msflag == 1) {
                        var sound = 'default';
                        if(systemType == 'ios') {
                            sound = 'widget://res/sound/newOrder.mp3';
                        }
                        // 新消息在状态栏显示
                        api.notification({
                            vibrate: [500, 600],
                            sound: sound,
                            light: true,
                            notify: {
                                title: '',
                                updateCurrent: true,
                                content: "您有新的订单啦！",
                                extra: {
                                    pageStyle: "willRec"
                                }
                            },
                        }, function(ret, err) {
                            // cleanUpMessage();
                            // alert(_g.j2s(ret));
                        });
                    } else if(ret.data.msflag == 2) {
                        var sound = 'default';
                        if(systemType == 'ios') {
                            sound = 'widget://res/sound/chargeback.mp3';
                        }
                        // 新消息在状态栏显示
                        api.notification({
                            vibrate: [500, 600],
                            sound: sound,
                            light: true,
                            notify: {
                                title: '',
                                updateCurrent: true,
                                content: "您有用户申请退款，请及时处理哦！",
                                extra: {
                                    pageStyle: "willPay"
                                }
                            },
                        }, function(ret, err) {
                            // cleanUpMessage();
                            // alert(_g.j2s(ret));
                        });
                    }
                    api && api.sendEvent({
                        name: 'message-messageList-updata',
                    });
                }
            },
            error: function(err) {},
        });
    }
    // 30秒检查是否有新通知
    setInterval(function() {
        findUpdata();
    }, 30000);

    api.removeEventListener({
        name: 'pause'
    });
    api.addEventListener({
        name: 'pause'
    }, function(ret, err) {
        if (!unReadMsg) return;
        if (unReadMsg.notification <= 0) {
            return;
        } else {
            if (!checkNotificationTime()) return;
            var sendNotificationTime = new Date().getTime();
            _g.setLS('sendNotificationTime', sendNotificationTime);
            getUnreadData();
        }
    });
    function getUnreadData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            // isSync: true,
            lock: false,
            url: '/jiekou/agentht/message/getMscount2.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    if(ret.data.messagecount == 0) {
                        return
                    } else {
                        setTimeout(function() {
                            footer.unreadNumber = ret.data.messagecount;
                            // 在通知栏提示
                            api.notification({
                                vibrate: [500, 500],
                                sound: 'default',
                                light: false,
                                notify: {
                                    title: '',
                                    updateCurrent: true,
                                    content: "你有" + footer.unreadNumber + "条未读消息~",
                                    extra: {
                                        pageStyle: "messageList"
                                    }
                                },
                            }, function(ret, err) {

                            });
                        }, 0)
                    }
                }
            },
            error: function() {},
        });
    }

    api.addEventListener({
        name: 'resume'
    }, function(ret, err) {
        getMessageRead();
    });

    api.addEventListener({
        name: 'noticeclicked'
    }, function(ret, err) {
        if(ret.value.pageStyle == "messageList") {
            _g.openWin({
                header: {
                    data: {
                        title: '消息'
                    }
                },
                name: 'message-messageList',
                url: '../message/messageList.html',
                pageParam: {

                }
            });
        } else if(ret.value.pageStyle == "willRec") {
            _g.openWin({
                header: {
                    data: {
                        title: '待接单'
                    }
                },
                name: 'orderManage-orderStay',
                url: '../orderManage/orderStay.html',
                pageParam: {
                    ddzt: 1
                }
            });
        } else if(ret.value.pageStyle == "willPay") {
            _g.openWin({
                header: {
                    data: {
                        title: '申请退款'
                    }
                },
                name: 'orderManage-order',
                url: '../orderManage/order.html',
                pageParam: {
                    ddzt: 4
                }
            });
        }
    });

    api.addEventListener({
        name: 'main-message-showRedDot'
    }, function(ret, err) {
        getMessageRead();
    });

    api.addEventListener({
        name: 'main-message-showCancel'
    }, function(ret, err) {
        header.showCancel = true;
    });
    api.addEventListener({
        name: 'main-message-hiddenCancel'
    }, function(ret, err) {
        header.showCancel = false;
    });
    // 状态栏通知被用户点击后的回调，字符串类型
    api.addEventListener({
        name:'noticeclicked'
    },function(ret,err){
        cleanUpMessage();
    });

    module.exports = {};

});
