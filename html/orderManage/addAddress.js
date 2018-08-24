define(function(require, exports, module) {
    var userid =api && api.pageParam.userid;
    var UIActionSelector = api && api.require('UIActionSelector');
    var Region = _g.getLS('Region');
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var addAddress = new Vue({
        el: '#addAddress',
        template: _g.getTemplate('orderManage/addAddress-main-V'),
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
            }, ],
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
        }, function(ret, err) {
            if (ret) {
                if(ret.eventType == 'ok') {
                    addAddress.address.areaID = ret.selectedInfo[2].id;
                    addAddress.area.areaName = ret.selectedInfo[0].name;
                    addAddress.area.city = ret.selectedInfo[1].name;
                    addAddress.area.countrySide = ret.selectedInfo[2].name;
                    getVillageIdData(ret.selectedInfo[2].id);
                }
            } else {
                alert(JSON.stringify(err));
            }
        });
    }
    function submitSave() {
        var address = addAddress.area.areaName+'-'+addAddress.area.city+'-'+addAddress.area.countrySide+'['+addAddress.selected+'-'+addAddress.address.building+'栋'+addAddress.address.level+'单元'+addAddress.address.room+']';
        for (var i = 0; i < addAddress.options.length; i++) {
            if(addAddress.options[i].villageName == addAddress.selected) {
                addAddress.address.villageid = addAddress.options[i].value;
            }
        };
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                addrid: _g.getLS('UserInfo').addrid,
                token: _g.getLS('UserInfo').token,
                userid: userid,
                isdefault: selectDefault(addAddress.address.isdefault),
                shr: addAddress.address.peolpe,
                mobile: addAddress.address.mobile,
                areaid: addAddress.address.areaID,
                villageid: addAddress.address.villageid,
                kind: addAddress.address.kind,
                addr: address,
                building: addAddress.address.building,
                level: addAddress.address.level,
                room: addAddress.address.room,
            },
            isSync: true,
            url: '/jiekou/agentht/order/addAddress.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    api.sendEvent({
                        name: 'orderManage-myAddress-addRefresh'
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
    function selectDefault(result) {
        if(result == true) {
            return(1);
        } else {
            return(0);
        }
    }
    function getVillageIdData(areaid) {
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                // addrid: _g.getLS('UserInfo').addrid,
                token: _g.getLS('UserInfo').token,
                areaid: areaid,
            },
            url: '/jiekou/agentht/distribution/getVillage2.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    var data = ret.data;
                    addAddress.options = getVillageIdDetail(data);
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
        // var detail = item.villages ? item.villages : '';
        // var newArray = [];
        // for(var i = 0; i < item.villagesl; i++)
        //     newArray.push({
        //         villageName: detail['village_'+(i+1)+'_name'],
        //         value: detail['village_'+(i+1)+'_id'],
        //     });
        // return(newArray);
    }
    module.exports = {};

});