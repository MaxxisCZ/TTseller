define(function(require, exports, module) {
    var addrid =api && api.pageParam.addrid;
    var UIActionSelector = api && api.require('UIActionSelector');
    var Region = _g.getLS('Region');
    var pageIndex = 1;
    var pageSize = 30;
    var Http = require('U/http');
    var editAddress = new Vue({
        el: '#editAddress',
        template: _g.getTemplate('orderManage/editAddress-main-V'),
        data: {
            selected: '',
            address: {
                isdefault: false,
                peolpe: '',
                mobile: '',
                token: '',
                village: '',
                villageid: '',
                kind: 1,
                addr: '',
                region: '',
                province: '',
                areaID: '',
                building: '',
                level: '',
                room: '',
            },
            area: {
                areaName: '',
                city: '',
                countrySide: '',
            },
            options: [{
                villageName: '',
                value: 0
            }, {
                villageName: '',
                value: 0
            }, ],
            addrKind: [{
                type: '公司',
                kind: 1,
                isSelect: 1
            }, {
                type: '住宅',
                kind: 2,
                isSelect: 0
            }, {
                type: '学校',
                kind: 3,
                isSelect: 0
            }, {
                type: '其他',
                kind: 4,
                isSelect: 0
            }, ]
        },
        methods: {
            onDefaultTap: function() {
                if(this.address.isdefault == true) {
                    this.address.isdefault = false;
                } else {
                    this.address.isdefault = true;
                }
            },
            onSelectTap: function(index) {
                this.address.kind = index + 1;
                _.each(this.addrKind, function(n,i) {
                    if(i == index) {
                        n.isSelect = 1;
                    } else {
                        n.isSelect = 0;
                    }
                });
            },
            onAreaTap: function() {
                openRegionSelect(Region);
                
            },
            onSubmitTap: function() {
                if(this.address.peolpe === '') {
                    _g.toast('收货人不能为空');
                    return
                }
                if(this.address.mobile === '') {
                    _g.toast('联系电话不能为空');
                    return
                }
                if(this.address.areaID === '') {
                    _g.toast('城市不能为空');
                    return
                }
                if(this.selected === '') {
                    _g.toast('区域不能为空');
                    return
                }
                submitSave();
            },
        },
    });
    function openRegionSelect(data) {
        // alert(_g.j2s(data)); 显示整个独居对象
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
            fixedOn: api.frameName,
        }, function(ret, err) {
            if (ret) {
                if(ret.eventType == 'ok') {
                    editAddress.address.areaID = ret.selectedInfo[2].id;
                    editAddress.area.areaName = ret.selectedInfo[0].name;
                    editAddress.area.city = ret.selectedInfo[1].name;
                    editAddress.area.countrySide = ret.selectedInfo[2].name;
                    getVillageIdData(ret.selectedInfo[2].id);
                }
            } else {
                alert(JSON.stringify(err));
            }
        });
    }
    function submitSave() {
        var address = editAddress.area.areaName+'-'+editAddress.area.city+'-'+editAddress.area.countrySide+'['+editAddress.selected+'-'+editAddress.address.building+'栋'+editAddress.address.level+'单元'+editAddress.address.room+']';
        for (var i = 0; i < editAddress.options.length; i++) {
            if(editAddress.options[i].villageName == editAddress.selected) {
                editAddress.address.villageid = editAddress.options[i].value;
            }
        };
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                addrid: _g.getLS('UserInfo').addrid,
                token: _g.getLS('UserInfo').token,
                addrid: addrid,
                isdefault: selectIsDefault(editAddress.address.isdefault),
                shr: editAddress.address.peolpe,
                mobile: editAddress.address.mobile,
                areaid: editAddress.address.areaID,
                villageid: editAddress.address.villageid,
                kind: editAddress.address.kind,
                addr: address,
                building: editAddress.address.building,
                level: editAddress.address.level,
                room: editAddress.address.room,
            },
            isSync: true,
            url: '/jiekou/agentht/order/editAddress.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    api.sendEvent({
                        name: 'orderManage-myAddress-editRefresh'
                    });
                    api && api.closeWin();
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
            error: function(err) {}
        });
    }
    function getAddrData() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                addrid: addrid,
                token: _g.getLS('UserInfo').token,
            },
            isSync: true,
            lock: false,
            url: '/jiekou/agentht/order/getAddress2.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    editAddress.address = getAddrDetail(data);
                    setTimeout(function() {
                        getVillage(editAddress.address.villageid);
                    }, 500);
                    addrKind(editAddress.address.kind);
                    setTimeout(function() {
                        getAreaData();
                    }, 1000);
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
            error: function(err) {}
        });
    }
    function getAddrDetail(result) {
        var data = result ? result : '';
        return{
            isdefault: isDefault(data.isdefault) || '',
            peolpe: data.shr || '',
            mobile: data.mobile || '',
            areaID: data.areaid || '',
            villageid: data.villageid || '',
            kind: data.kind || '',
            addr: data.addr || '',
            building: data.building || '',
            level: data.level || '',
            room: data.room || '',
        }
    }
    function addrKind(result) {
        index = result - 1;
        _.each(editAddress.addrKind, function(n,i) {
            if(i == index) {
                n.isSelect = 1;
            } else {
                n.isSelect = 0;
            }
        });
    }
    function isDefault(result) {
        if(result == 1) {
            return(true);
        } else if(result == 0) {
            return(false);
        }
    }
    function addrType(result) {
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
    function selectIsDefault(result) {
        if(result == true) {
            return(1);
        } else {
            return(0);
        }
    }
    function getVillageIdData() {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                addrid: _g.getLS('UserInfo').addrid,
                token: _g.getLS('UserInfo').token,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            url: '/jiekou/agentht/distribution/getVillage.aspx',
            lock: false,
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    editAddress.options = getVillageIdDetail(data);
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
    function getVillageIdDetail(result) {
        var data = result ? result.villages : '';
        return _.map(data, function(detail) {
            return{
                villageName: detail.village_name || '',
                value: detail.village_id || '',
            }
        });
    }
    function getVillage(param) {
        for (var i = 0; i < editAddress.options.length; i++) {
            if(param == editAddress.options[i].value) {
                editAddress.selected = editAddress.options[i].villageName;
            }
        }
    }
    function getAreaData() {
        Http.ajax({
            data: {

            },
            url: '/jiekou/agentht/agent/getCity.aspx',
            lock: false,
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    getAreaDetail(data);
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
                }
            },
            error: function(err) {},
        });
    }
    function getAreaDetail(result) {
        var detail = result ? result.cities : '';
        for(var i = 0; i < result.citysl; i++) {
            if(editAddress.address.areaID == detail['city_' + (i+1) + '_id']) {
                editAddress.area.areaName = detail['city_' + (i+1) + '_province'];
                editAddress.area.city = detail['city_' + (i+1) + '_name'];
                editAddress.area.countrySide = detail['city_' + (i+1) + '_county'];
            }
        }
    }
    getAddrData();
    getVillageIdData();

    module.exports = {};

});