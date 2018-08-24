define(function(require, exports, module) {
    var Http = require('U/http');
    var province = [];
    var city = [];
    var county = [];
    var area = [];
    api && api.setFullScreen({
        fullScreen: false
    });

    api && api.setStatusBarStyle({
        style: 'light'
    });

    if (window.APPMODE == 'dev' && !window.location.host) {
        api.clearCache();
        api.removeLaunchView();

        var path = _g.getLS('DEV_PATH');

        if (path) {
            api.confirm({
                title: '提示',
                msg: '使用历史记录地址',
                buttons: ['确定', '取消']
            }, function(ret, err) {
                if (ret.buttonIndex == 1) {
                    openDev(path);
                } else {
                    inputPath();
                }
            });
        } else {
            inputPath();
        }

        // var config = require('config');
        // var url = 'http://' + config.host + ':' + config.port;

        function openDev(path) {
            api.openWin({
                name: 'dev-win',
                url: path + '/index.html?isApp=1',
                bounces: false,
                slidBackEnabled: false,
                pageParam: { key: 'value' },
                animation: { type: 'none' }
            });
        }

        function inputPath() {
            api.prompt({
                buttons: ['确定', '取消']
            }, function(ret, err) {
                if (ret.buttonIndex == 1) {
                    path = 'http://' + ret.text;
                    _g.setLS('DEV_PATH', path);
                    openDev(path);
                } else {
                    api.closeWidget({
                        silent: true
                    });
                }
            });
        }

        return
    }

    // _g.rmLS('isFirstStart');
    // _g.rmLS('UserInfo');

    // 如果是第一次打开app, 启动引导页
    // if (!_g.getLS('isFirstStart')) {
    //     api && api.openWin({
    //         name: 'leading-index-win',
    //         url: './html/leading/index.html',
    //         bounces: false,
    //         slidBackEnabled: false
    //     });
    //     return
    // }

    var startTime = new Date().getTime();
    var LastTime = _g.getLS('LastTime');
    if (!LastTime) _g.setLS('LastTime', startTime);
    if (startTime - LastTime > 7 * 24 * 60 * 60 * 1000) {
        _g.rmLS('UserInfo');
    }
    _g.setLS('LastTime', startTime);

    // 获取ios审核状态
    var iosMagicStatus = _g.getLS('iosMagicStatus');
    if (!iosMagicStatus) {
        if (api.systemType == 'ios') {
            var Http = require('U/http');
            fetchIosMagicStatus();
        } else if (api.systemType == 'android') {
            _g.setLS('iosMagicStatus', 'true');
        }
    }

    function fetchIosMagicStatus() {
        Http.ajax({
            data: {},
            lock: false,
            url: '/jiekou/apple/getCheck.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    var version = ret.data.version;
                    var status = ret.data.checkStatus;
                    if (status == 1) {
                        // 审核中
                        if (api.appVersion > '0.0.0' && api.appVersion < version) {
                            // 已审核过的版本
                            _g.setLS('iosMagicStatus', 'true');
                        }
                    } else if (status == 2) {
                        // 已审核
                        _g.setLS('iosMagicStatus', 'true');
                    }
                }
            },
            error: function(err) {}
        });
    }

    function getRegionList() {
        Http.ajax({
            data: {},
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/agent/getCity.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    // 转换成显示的省市区数据
                    // matchRegion(ret.data);
                    // 缓存省市区数据
                    _g.setLS('Region', ret.data.cities);
                    // alert(_g.j2s(_g.getLS('Region')));
                    api && api.sendEvent({
                        name: 'app-setRegion-LS'
                    })
                } else {
                    // _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    function postLogin() {
        var UserInfo = _g.getLS('UserInfo');
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/agent/getAgent.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    if(ret.data.checkflag == 1) {
                        UserInfo.checkflag = 1;
                        //缓存用户资料
                        _g.setLS('UserInfo', UserInfo);
                    }
                }
            },
            error: function(err) {

            }
        });
    }

    function getAreaList(id, type) {
        Http.ajax({
            data: {
                id: id
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/agent/getArea.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    // 转换成显示的区的数据
                    matchArea(ret.data);
                    // 缓存区数据
                    _g.setLS('area', ret.data);
                    //区别不同页面的城市id
                    var turnName = "";
                    if (type == "editList") {
                        turnName = "app-sendEditData"
                    } else {
                        turnName = "app-sendData"
                    }
                    // 分别把拿到的数据发给不同的页面
                    api && api.sendEvent({
                        name: turnName,
                        extra: {
                            areaData: _g.j2s(area)
                        }
                    });
                } else {
                    _g.setLS('area', null);
                    // _g.toast(ret.msg);
                    //区别不同页面的城市id
                    var turnName = "";
                    if (type == "editList") {
                        turnName = "app-sendEditData"
                    } else {
                        turnName = "app-sendData"
                    }
                    //分别把拿到的数据发给不同的页面
                    api && api.sendEvent({
                        name: turnName,
                        extra: {
                            areaData: _g.j2s(area)
                        }
                    });
                }
            },
            error: function(err) {},
        });
    }

    function matchArea(data) {
        for (var i = 0; i <= data.areasl; i++) {
            area.push({
                id: data.areas['area_' + (i + 1) + '_id'] || '',
                name: data.areas['area_' + (i + 1) + '_name'] || ''
            });
        }
    }
    // getAreaList();
    getRegionList();

    api && api.addEventListener({
        name: 'app-region-LS'
    }, function(ret, err) {
        getRegionList();
    });

    if (_g.getLS('UserInfo')) {
        openMainPage();
        postLogin();
    } else {
        openLoginPage();
    }
    function openMainPage() {
        api && api.openWin({
            name: 'main-index-win',
            url: './html/main/index.html',
            bounces: false,
            slidBackEnabled: false,
            animation: {
                type: 'none'
            }
        });
    }

    function openLoginPage() {
        api && api.openWin({
            name: 'account-login-win',
            url: './html/account/login.html',
            pageParam: {
                from: 'root'
            },
            bounces: false,
            slidBackEnabled: false,
            animation: {
                type: 'none'
            }
        });
    }

    api.addEventListener({
        name: 'shake'
    }, function(ret, err) {
        if (window.APPMODE == 'pub') return;
        api.alert({
            title: '当前代码版本为:',
            msg: window.VERSION,
        }, function(ret, err) {

        });
    });
    //监听城市id
    api.addEventListener({
        name: 'sentCityId'
    }, function(ret, err) {
        area = [];
        getAreaList(ret.value.cityId, ret.value.type);
    });
    module.exports = {};

});
