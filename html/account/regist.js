define(function(require, exports, module) {
    var Http = require('U/http');
    var UIActionSelector = api && api.require('UIActionSelector');
    var Region = _g.getLS('Region');
    var iosMagicStatus = _g.getLS('iosMagicStatus');

    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var area = {};
    var registList = new Vue({
        el: '#registList',
        template: _g.getTemplate('account/regist-list-V'),
        data: {
            iosMagicStatus: iosMagicStatus,
            name: '',
            sex: 1,
            showSex: 1,
            QQ: '',
            wechat: '',
            email: '',
            birth: '',
            region: '',
            phone: '',
            account: '',
            password: '',
            confirmPwd: '',
            agentName: '',
            province: '',
            city: '',
            district: '',
            village: '',
            address: '',
            lat: '',
            lon: '',
            area: '',
            addr: '',
            shop: 0,
            rent: 0,
            length: 0,
            width: 0,
            height: 0,
            manager: 0,
            managerIndex: 1,
            money: 0,
            time: '',
            areaid: '',
            replayaim: '',
            areaList: [{
                id:'',
                area: ''
            },{
                id:'',
                area: ''
            }],
            checkList: [{
                text: '本人',
            }, {
                text: '亲朋',
            }, {
                text: '外聘',
            }]
        },
        created: function() {
            api && api.sendEvent({
                name: 'app-region-LS'
            });

            api && api.sendEvent({
                name: 'app-area-LS'
            });
        },
        ready: function() {
          
        },
        methods: {
            picker: function() {
                api.openPicker({
                    type: 'date',
                    // date: '2014-05-01 12:30',
                    title: '选择时间'
                }, function(ret, err) {
                    if (ret) {
                        registList.time = ret.year+'/'+ret.month+'/'+ret.day;
                        registList.birth = ret.year+'/'+ret.month+'/'+ret.day;
                    } else {
                        alert(JSON.stringify(err));
                    }
                });
            },
            onSexTap: function(type) {
                if(type == 1) {
                    this.sex = 1;
                    this.showSex = true;
                } else if(type == 2) {
                    this.sex = 2;
                    this.showSex = false;
                }
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
            /*
            //跳转百度地图定位页面
            onCityTap: function() {
                _g.openWin({
                    header: {
                        data: {
                            title: '',
                            city: '',
                            isSearch: true
                        },
                        template: 'common/header-bMap-V',
                    },
                    name: 'address-bMap',
                    url: '../address/bMap.html',
                    bounces: false,
                    slidBackEnabled: false,
                });
            },
            */
            onAreaTap: function() {
                if (_g.getLS('area')) {
                    registList.areaList.area = area.name;
                    // registList.areaList.area = area.name;
                }
            },
            onCheckTap: function(index) {
                this.manager = index;
                this.managerIndex = index+1;
            },
            onRegistTap: function() {
                postData();
            },
            onTextareaFocus: function() {
                $(window).scrollTop(target.offsetTop);
            }
        }
    });

    function openRegionSelect(data, type) {
        UIActionSelector.open({
            // datas: data, //拿到后台省市县数据
            datas: 'widget://res/Regions.json', //拿到APP原本省市县数据
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
                    registList.region = ret.level1 + ' ' + ret.level2 + ' ' + ret.level3;
                } else {
                    registList.province = ret.level1;
                    registList.city = ret.level2;
                    registList.district = ret.level3;
                    api&&api.sendEvent({
                        name: 'sentCityId',
                        extra:{
                            cityId:ret.selectedInfo[2].id,
                            type:"registList"
                        }
                    });
                }
            }
        });
    };

    //提交申请
    function postData() {
        // alert(_g.j2s(registList.areaList));
        // return
        setTimeout(function(){
            for(var i = 0; i < registList.areaList.length; i ++) {
                // alert(registList.areaList[i].name);
                if(registList.areaList[i].name == registList.area) {
                    registList.areaid = registList.areaList[i].id;
                }
            }
        }, 0);
        Http.ajax({
            data: {
                name: registList.name,
                sex: registList.sex,
                qq: registList.QQ,
                weixin: registList.wechat,
                email: registList.email,
                // birth: registList.birth,
                // place: registList.region,
                mobile: registList.phone,
                // loginname: registList.account,
                // password: registList.password,
                // agentname: registList.agentName,
                // areaid: registList.areaid,
                addr: registList.addr,
                // shop: registList.shop,
                // rent: registList.rent,
                // length: registList.length,
                // width: registList.width,
                // height: registList.height,
                // manager: registList.managerIndex,
                // investment: registList.money,
                // managetime: registList.time,
                province: registList.province,
                city: registList.city,
                county: registList.district,
                latitude: registList.lat,
                longitude: registList.lon,
                replayaim: registList.replayaim,
            },
            isSync: true,
            url: '/jiekou/agentht/agent/register.aspx',
            success: function(ret) {
              alert(JSON.stringify(ret))
                if (ret.zt == 1) {
                    setTimeout(function() {
                        api && api.openFrame({
                            name: 'popupbox-successApply',
                            url: '../popupbox/successApply.html',
                            pageParam: {
                                printType: 2,
                            },
                            rect: {
                                x: 0,
                                y: api.winHeight-api.frameHeight,
                                w: 'auto',
                                h: api.frameHeight,
                            },
                            pageParam: {
                                message: ret.msg,
                            }
                        });
                    }, 0);
                    setTimeout(function() {
                        api && api.closeWin();
                    }, 5000);
                } else {
                    api && api.openFrame({
                        name: 'popupbox-failApply',
                        url: '../popupbox/failApply.html',
                        pageParam: {
                            printType: 2,
                        },
                        rect: {
                            x: 0,
                            y: api.winHeight-api.frameHeight,
                            w: 'auto',
                            h: api.frameHeight,
                        },
                        pageParam: {
                            message: ret.msg,
                        }
                    });
                }
            },
            error: function(err) {},
        });
    }
    api && api.addEventListener({
        name: 'app-setRegion-LS'
    }, function(ret, err) {
        Region = _g.getLS('Region');
    });

    api && api.addEventListener({
        name: 'app-setArea-LS'
    }, function(ret, err) {
        area = _g.getLS('area');
    });
    //拿到区域数据
    api&&api.addEventListener({
        name:'app-sendData'
    },function(ret,err) {
        setTimeout(function() {
            // alert(_g.j2s(ret.value.areaData));
            // registList.areaList = [];
            var area = _g.s2j(ret.value.areaData);
            registList.areaList = area;
            if(registList.areaList.length) {
                registList.area = registList.areaList[0].name;
                registList.areaid = registList.areaList[0].id;
            } else {
                registList.area = '';
                registList.areaid = '';
            }
        }, 0);
    });

  //通过baiduLocation获取地址
  var bMap = api.require('bMap');
  function getLocationInfornation(){
    bMap.getLocation({
      accuracy: '100m',
      filter: 1,
      autoStop: true
    }, function(ret, err) {
        if (ret.status) {
        //  alert(JSON.stringify(ret));
          registList.lat=ret.lat;
          registList.lon=ret.lon;
          //停止定位
          //baiduLocation.stopLocation();
          //通过后台接口获取省市县信息
          getAddressInfornation(registList.lat,registList.lon);
        } else {
            alert(JSON.stringify(err));
        }
    });
  }

  function getAddressInfornation(lat,lon){
    Http.ajax({
      data:{
        lat:registList.lat,
        lng:registList.lon,
      },
      url:'/jiekou/qiantai/address/getAddressByCoordinate.aspx',
      success:function(ret){
        //alert(JSON.stringify(ret))
        registList.province=ret.data.province;
        registList.city=ret.data.city;
        registList.district=ret.data.district;
      },
      error:function(err){ }
    });
  }

    getLocationInfornation();
    module.exports = {};
});
