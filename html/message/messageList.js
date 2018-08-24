define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var pageIndex = 1;
    var pageSize = 30;
    var next = true;
    var messageList = new Vue({
        el: '#messageList',
        template: _g.getTemplate('message/messageList-V'),
        data: {
            isFirst: true,
            isShowFooter: false,
            selectNumber: 0,
            selectedIndexList: '',
            list: [{
                message_id: '',
                agent_id: '',
                message_title: '皮特和茱莉离婚的消息',
                message_time: '2016/2/1',
                message_content: 'Array构造器将',
                message_type: '',
                message_overview: 'Array构造器将',
                staff_id: '',
                isRead: 0,
                isSelected: false,
            }]
        },
        created: function() {
            this.list = [];
        },
        methods: {
            onDetailTap: function(item,event) {
                if($(event.target).closest('.ui-list__del').length > 0) {
                    messageList.isShowFooter = true;
                    if(item.isSelected == false) {
                        this.selectNumber ++;
                        item.isSelected = true;
                    } else {
                        this.selectNumber --;
                        item.isSelected = false;
                    }
                    if(this.selectNumber == 0) {
                        messageList.isShowFooter = false;
                        api.sendEvent({
                            name:'main-message-hiddenCancel'
                        });
                    } else {
                        messageList.isShowFooter = true;
                        api.sendEvent({
                            name:'main-message-showCancel'
                        });
                    }
                    
                } else {
                    var action = $(event.target).attr('data-action');
                    if (action == 'delete') {
                        deleteData(item);
                        return;
                    }
                    _g.openWin({
                        header: {
                            data: {
                                title: '消息',
                            }
                        },
                        name: 'message-messageDetail',
                        url: '../message/messageDetail.html',
                        pageParam: {
                            xx_id: item.message_id,
                            xx_nc: item.message_title,
                            xx_ms: item.message_content,
                            xx_gs: item.message_overview,
                            xx_sj: item.message_time,
                        }
                    });
                    alreadyRead(item.message_id);
                }
            },
            onReadTap: function() {
                getSelectedIndex();
                if(this.selectedIndexList.length == 0) {
                    alert('请选择要已读消息');
                    return
                }
                alreadySomeRead();
            },
            onDeleteTap: function() {
                getSelectedIndex();
                if(this.selectedIndexList.length == 0) {
                    alert('请选择要删除消息');
                    return
                }
                deleteSomeData();
            },
        },
    });
    //
    function getSelectedIndex() {
        if(messageList.list == '') return
        if(messageList.list[0].isSelected == true) {
            messageList.selectedIndexList = messageList.list[0].message_id;
        }
        for(var i = 1; i < messageList.list.length; i++) {
            if(messageList.list[i].isSelected == true) {
                messageList.selectedIndexList = messageList.selectedIndexList+ ',' + messageList.list[i].message_id ;
            }
        }
    }
    // 单个删除
    function deleteData(item) {
        Http.ajax({
            data: {
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                loginname: UserInfo.loginname,
                messageid: item.message_id
            },
            isSync: true,

            url: '/jiekou/agentht/message/deleteMs.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    api.sendEvent({
                        name:'main-message-showRedDot'
                    });
                    next = true;
                    pageIndex = 1;
                    // messageList.list = [];
                    messageList.selectedIndexList = '';
                    getData();
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
    }
    // 选择多个删除
    function deleteSomeData() {
        Http.ajax({
            data: {
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                loginname: UserInfo.loginname,
                messageids: messageList.selectedIndexList,
            },
            isSync: true,

            url: '/jiekou/agentht/message/deleteMs2.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        api.sendEvent({
                            name:'main-message-showRedDot'
                        });
                        next = true;
                        pageIndex = 1;
                        // messageList.list = [];
                        messageList.selectedIndexList = '';
                        getData();
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
                    setTimeout(function() {
                        _g.closeWins(['main-index-win'])
                    }, 1000)
                } else {
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    function getData(type) {
        if(_g.getLS('UserInfo')) {
            if(type != 'async') _g.showProgress();
            Http.ajax({
                data: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    token: UserInfo.token,
                    pageIndex: pageIndex,
                    pageSize: pageSize
                },
                isSync: false,
                lock: false,
                url: '/jiekou/agentht/message/getMs.aspx',

                success: function(ret) {
                    if (ret.zt == 1) {
                        setTimeout(function() {
                            messageList.isFirst = false;
                            if(ret.data) {
                                if(pageIndex == 1) {
                                    messageList.list = machData(ret.data);
                                } else {
                                    messageList.list = messageList.list.concat(machData(ret.data));
                                }
                            }
                            setTimeout(function() {
                                if(type != 'async') _g.hideProgress();
                            }, 500);
                            initListTool();
                        }, 0);
                    } else if(ret.zt == -1) {
                        if(type != 'async') _g.hideProgress();
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
                            messageList.list = [];
                        }
                        window.isNoMore = true;
                        if(type != 'async') _g.hideProgress();
                        messageList.isShowFooter = false;
                        if(messageList.isFirst == true) {
                            _g.toast(ret.msg);
                            messageList.isFirst = false;
                            api.sendEvent({
                                name:'main-index-noSelect'
                            });
                        }
                    }
                },
                error: function(err) {},
            });
        }
    }

    function machData(data) {
        var list = data ? data.xxnr : [];
        if(messageList.isShowFooter == false) {
            return _.map(list, function(item) {
                return {
                    message_id: item.xx_id || '',
                    agent_id: item.xx_agentid || '',
                    message_title: item.xx_nc || '',
                    message_time: item.xx_sj || '',
                    message_content: item.xx_ms || '',
                    message_type: item.xx_zl || '',
                    message_overview: item.xx_gs || '',
                    staff_id: item.xx_staffid || '',
                    isRead: item.xx_yd || 0,
                    isSelected: false,
                }
            });
        } else {
            return _.map(list, function(item) {
                return {
                    message_id: item.xx_id || '',
                    agent_id: item.xx_agentid || '',
                    message_title: item.xx_nc || '',
                    message_time: item.xx_sj || '',
                    message_content: item.xx_ms || '',
                    message_type: item.xx_zl || '',
                    message_overview: item.xx_gs || '',
                    staff_id: item.xx_staffid || '',
                    isRead: item.xx_yd || 0,
                    isSelected: true,
                }
            });
        }
    }
    // 单个已读
    function alreadyRead(message_id) {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                messageid: message_id
            },
            isSync: true,

            url: '/jiekou/agentht/message/setMs.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    api.sendEvent({
                        name:'main-message-showRedDot'
                    });
                    // messageList.list = [];
                    messageList.selectedIndexList = '';
                    pageIndex = 1;
                    getData();
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
    }
    // 选择多个已读
    function alreadySomeRead() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                messageids: messageList.selectedIndexList,
            },
            isSync: true,
            url: '/jiekou/agentht/message/setMs2.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    api.sendEvent({
                        name:'main-message-showRedDot'
                    });
                    // messageList.list = [];
                    messageList.selectedIndexList = '';
                    pageIndex = 1;
                    getData();
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
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    function initListTool() {
        var hammer = new Hammer($('.ui-list')[0], {});
        var $hammer_msg = null;
        var toolbar_width = 0;
        var hammer_allow = true;
        var hammer_end = false;
        hammer.on('panstart', function(ev) {
            $hammer_msg = $(ev.target).closest('.ui-list__item');
            toolbar_width = $hammer_msg.find('.ui-msgToolbar').width();
            hammer_end = false;
        });
        hammer.on('panmove', function(ev) {
            if (!hammer_allow) return;
            if ($hammer_msg.hasClass('is-active')) {
                if (ev.deltaX >= 0) {
                    $hammer_msg.find('.ui-list__itemBody').css({
                        'transition-duration': '0.2s',
                        '-webkit-transform': 'translate3d(0,0,0)'
                    });
                    hammer_allow = false;
                    setTimeout(function() {
                        $hammer_msg.removeClass('is-active');
                        hammer_end = true;
                    }, 200);
                }
            } else {
                if (ev.deltaX >= 20) {
                    ev.deltaX = 20;
                } else {
                    if (ev.deltaX < -toolbar_width - 20) {
                        ev.deltaX = -toolbar_width - 20;
                    }
                }
                $hammer_msg.find('.ui-list__itemBody').css({
                    '-webkit-transform': 'translate3d(' + ev.deltaX + 'px,0,0)',
                    'transition-duration': '0s'
                });
            }
        });
        hammer.on('panend', function(ev) {
            if (hammer_end) {
                hammer_allow = true;
                return;
            }
            if (ev.deltaX >= 0) {
                $hammer_msg.find('.ui-list__itemBody').css({
                    'transition-duration': '0.2s',
                    '-webkit-transform': 'translate3d(0,0,0)'
                });
                hammer_allow = false;
                setTimeout(function() {
                    $hammer_msg.removeClass('is-active');
                    hammer_allow = true;
                }, 200);

            } else if (ev.deltaX > -toolbar_width * 0.3 && ev.deltaX < 0) {
                $hammer_msg.find('.ui-list__itemBody').css({
                    'transition-duration': '0.2s',
                    '-webkit-transform': 'translate3d(0,0,0)'
                });
                hammer_allow = false;
                setTimeout(function() {
                    $hammer_msg.removeClass('is-active');
                    hammer_allow = true;
                }, 200);
            } else if (ev.deltaX <= -toolbar_width * 0.3) {
                $hammer_msg.find('.ui-list__itemBody').css({
                    'transition-duration': '0.2s',
                    '-webkit-transform': 'translate3d(' + (-toolbar_width) + 'px,0,0)'
                });
                hammer_allow = false;
                setTimeout(function() {
                    $hammer_msg.addClass('is-active');
                    hammer_allow = true;
                }, 200);
            }
        });
        hammer.on('pancancel panup', function(ev) {
            if (hammer_end) {
                hammer_allow = true;
                hammer_end = false;
                return;
            }
            if (ev.deltaX >= 0) {
                $hammer_msg.find('.ui-list__itemBody').css({
                    'transition-duration': '0.2s',
                    '-webkit-transform': 'translate3d(0,0,0)'
                });
                hammer_allow = false;
                setTimeout(function() {
                    $hammer_msg.removeClass('is-active');
                    hammer_allow = true;
                }, 200);

            } else if (ev.deltaX > -toolbar_width * 0.3 && ev.deltaX < 0) {
                $hammer_msg.find('.ui-list__itemBody').css({
                    'transition-duration': '0.2s',
                    '-webkit-transform': 'translate3d(0,0,0)'
                });
                hammer_allow = false;
                setTimeout(function() {
                    $hammer_msg.removeClass('is-active');
                    hammer_allow = true;
                }, 200);
            } else if (ev.deltaX <= -toolbar_width * 0.3) {
                $hammer_msg.find('.ui-list__itemBody').css({
                    'transition-duration': '0.2s',
                    '-webkit-transform': 'translate3d(' + (-toolbar_width) + 'px,0,0)'
                });
                hammer_allow = false;
                setTimeout(function() {
                    $hammer_msg.addClass('is-active');
                    hammer_allow = true;
                }, 200);
            }
        });
    }

    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getData();
    });
    api.addEventListener({
        name: 'message-messageList-readM',
    }, function(ret, err) {
        if(ret.value.isChange) {
            pageIndex = 1;
            getData();
        }
    });
    // 有新消息更新消息列表
    api.addEventListener({
        name: 'message-messageList-updata',
    }, function(ret, err) {
        setTimeout(function() {
            pageIndex = 1;
            // messageList.list = [];
            getData('async');
        }, 0);
    });
    // 全取消
    api && api.addEventListener({
        name: 'message-messageList-cancelAll'
    }, function(ret, err) {
        messageList.isShowFooter = false;
        messageList.selectNumber = 0;
        messageList.selectedIndexList = '';
        api.sendEvent({
            name:'main-message-hiddenCancel'
        });
        _.each(messageList.list, function(n, i) {
            n.isSelected = false;
        });
    });
    // 全选
    api && api.addEventListener({
        name: 'message-messageList-selectAll'
    }, function(ret, err) {
        messageList.isShowFooter = true;
        _.each(messageList.list, function(n, i) {
            n.isSelected = true;
        });
        api.sendEvent({
            name:'main-message-showCancel'
        });
    });
    // 隐藏‘已读’和‘删除’
    api && api.addEventListener({
        name: 'main-message-hideFooter'
    }, function(ret, err) {
        messageList.isShowFooter = false;
        messageList.selectNumber = 0;
        messageList.selectedIndexList = '';
        _.each(messageList.list, function(n, i) {
            n.isSelected = false;
        });
    });

    _g.setPullDownRefresh(function() {
        setTimeout(function() {
            pageIndex = 1;
            // messageList.list = [];
            messageList.isShowFooter = false;
            messageList.selectedIndexList = '';
            messageList.selectNumber = 0;
            api.sendEvent({
                name:'main-message-hiddenCancel'
            });
            setTimeout(function() {
                getData();
            }, 200);
        }, 0);
    });
    getData();
    module.exports = {};
});
