define(function(require, exports, module) {

    var Http = require('U/http');
    var UIActionSelector = api && api.require('UIActionSelector');
    var Region = _g.getLS('Region');
    var area = _g.getLS('area');
    var UserInfo = _g.getLS('UserInfo');
    var editInfoList = new Vue({
        el: '#editInfoList',
        template: _g.getTemplate('me/editInfo-list-V'),
        data: {
            manager: 0,
            managerIndex: 0,
            detail: {
                avatar: '../../image/index/shop.png',
                name: '',
                sex: 1,
                birth: '',
                region: '',
                phone: '',
                agentName: '',
                province: '',
                city: '',
                cityId:'',
                county: '',
                addr: '',
                shop: 0,
                rent: 0,
                length: 0,
                width: 0,
                height: 0,
                money: 0,
                time: '',
                area: '',
                areaID: '',
                QQ: '',
                wechat: '',
                email: '',
            },
            checkList: [{
                text: '本人',
            }, {
                text: '亲朋',
            }, {
                text: '外聘',
            }],
            areaList: [{
                id:'',
                name: '棠下村'
            }, {
                id:'',
                name: '123'
            }]
        },
        created: function() {
            this.areaList = [];
        },
        methods: {
            onAvatarTap: function() {
                //上传店铺照片 // by weihao 2017-3-28 17:07:49
                _g.openPicActionSheet({
                    allowEdit: true,
                    suc: function(ret) {
                        postAvatar(ret.data);
                    }
                });
            },
            picker: function() {
                api.openPicker({
                    type: 'date',
                    // date: '2014-05-01 12:30',
                    title: '选择时间'
                }, function(ret, err) {
                    if (ret) {
                        editInfoList.detail.time = ret.year+'/'+ret.month+'/'+ret.day;
                        editInfoList.detail.birth = ret.year+'/'+ret.month+'/'+ret.day;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            onRegionTap: function(type) {
                switch (type) {
                    case 'region':
                        openRegionSelect(Region, 'region');
                        break;
                    case 'nowPlace':
                        openRegionSelect(Region, 'nowPlace');
                        break;
                }
            },
            onCheckTap: function(index) {
                this.manager = index;
                this.managerIndex = index + 1;
            },
            onSaveTap: function() {
                var emailReg=/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                if(!emailReg.test(this.detail.email)) {
                    _g.toast('邮箱格式不对');
                    return;
                }
                postDataList();
            }
        }
    });

    function openRegionSelect(data, type) {
        UIActionSelector.open({
            datas: data, //拿到后台省市县数据
            layout: {
                row: 5,
                col: 3,
                height: 30,
                size: 12,
                sizeActive: 14,
                rowSpacing: 5,
                colSpacing: 10,
                maskBg: 'rgba(0,0,0,0.2)',
                bg: '#fff',
                color: '#888',
                colorActive: '#f00',
                colorSelected: '#f00'
            },
            animation: true,
            cancel: {
                text: '取消',
                size: 12,
                w: 90,
                h: 35,
                bg: '#fff',
                bgActive: '#ccc',
                color: '#888',
                colorActive: '#fff'
            },
            ok: {
                text: '确定',
                size: 12,
                w: 90,
                h: 35,
                bg: '#fff',
                bgActive: '#ccc',
                color: '#888',
                colorActive: '#fff'
            },
            title: {
                text: '请选择',
                size: 12,
                h: 44,
                bg: '#eee',
                color: '#888'
            },
            // fixedOn: api.frameName
        }, function(ret, err) {
            if (ret.eventType == 'ok') {
                if (type == 'region') {
                    editInfoList.detail.region = ret.level1 + ' ' + ret.level2 + ' ' + ret.level3;
                } else {
                    editInfoList.detail.province = ret.level1;
                    editInfoList.detail.city = ret.level2;
                    editInfoList.detail.county = ret.level3;
                    api&&api.sendEvent({
                        name: 'sentCityId',
                        extra:{
                            cityId:ret.selectedInfo[0].id,
                            type:"editList"
                        }
                    });
                }
            }
        });
    }

    function getDataList() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token
            },
            isSync: true,

            url: '/jiekou/agentht/agent/getAgent.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        if (ret.data) {
                            editInfoList.detail = dataList(ret.data);
                            getAreaData();
                        }
                    }, 0);
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

    function dataList(result) {
        return {
            avatar: result.image || '../../image/index/shop.png',
            name: result.name || '',
            sex: result.sex || 0,
            birth: result.birth || '',
            region: result.place || '',
            phone: result.mobile || '',
            agentName: result.agentname || '',
            addr: result.addr || '',
            shop: result.shop || '',
            rent: result.rent || '',
            length: result.length || 0,
            width: result.width || 0,
            height: result.height || 0,
            money: result.investment || '',
            manager: result.managerIndex || 0,
            time: result.managetime || '',
            province: result.province || '',
            city: result.cityname || '',
            county: result.county || '',
            areaID: result.areaid || '',
            QQ: result.qq || '',
            wechat: result.weixin || '',
            email: result.email || '',
        }
    }

    function postDataList() {
        Http.ajax({
            data: {
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                name: editInfoList.detail.name,
                sex: editInfoList.detail.sex,
                birth: editInfoList.detail.birth,
                place: editInfoList.detail.region,
                mobile: editInfoList.detail.phone,
                loginname: UserInfo.loginname,
                agentname: editInfoList.detail.agentName,
                addr: editInfoList.detail.addr,
                shop: editInfoList.detail.shop,
                rent: editInfoList.detail.rent,
                length: editInfoList.detail.length,
                width: editInfoList.detail.width,
                height: editInfoList.detail.height,
                investment: editInfoList.detail.money,
                manager: editInfoList.managerIndex,
                managetime: editInfoList.detail.time,
                qq: editInfoList.detail.QQ,
                weixin: editInfoList.detail.wechat,
                email: editInfoList.detail.email,
                image: editInfoList.detail.avatar,
            },
            isSync: true,

            url: '/jiekou/agentht/agent/editAgent.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    getNewDataList();
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
            error: function(err) {
                _g.toast('网络连接失败');
            },
        });
    }

    function getNewDataList() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/agent/getAgent.aspx',

            success: function(ret) {
                if (ret.zt == 1) {
                    setTimeout(function() {
                        if (ret.data) {
                            editInfoList.detail = dataList(ret.data);
                        }
                    }, 0);
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
    function getAreaData() {
        Http.ajax({
            data:{
                id: editInfoList.detail.areaID
            },
            lock: false,
            url: '/jiekou/agentht/agent/getArea.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    editInfoList.areaList = getAreaDetail(data);
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
    function getAreaDetail(result) {
        var data = result ? result : [];
        // var areaNum = data.areasl;
        var newArray = [];
        for(var i = 0; i < data.areasl; i++) {
            newArray.push({
                name: data.areas['area_' + ( i +1 ) + '_name'] || '',
                id: data.areas['area_' + ( i +1 ) + '_id'] || '',
            });
        }
        return(newArray);
    }
    //获取头像  // by weihao 2017-3-28 17:07:49
    function postAvatar(path) {
        _g.showProgress();
        api.ajax({
            url: CONFIG.HOST + '/jiekou/agentht/activity/editImage.aspx',
            method: 'post',
            data: {
                values: {
                    loginname: UserInfo.loginname,
                    agentid: UserInfo.agentid,
                    staffid: UserInfo.staffid,
                    token: UserInfo.token,
                    param: 4,
                },
                files: {
                    img_tx: path
                },
            }
        }, function(ret, err) {
            if (ret.zt == 1) {
                setTimeout(function() {
                    editInfoList.detail.avatar = ret.tx;
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
                _g.toast(ret.msg);
            }
            _g.hideProgress();
        });
    };
    getDataList();
    //拿到区域数据
    api&&api.addEventListener({
        name:'app-sendEditData'
    },function(ret,err) {
        var area = _g.s2j(ret.value.areaData);
        editInfoList.areaList = area;
    });
    module.exports = {};
});
