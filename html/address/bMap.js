define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
    var bMap = api.require('bMap');
    var Http = require('U/http');
    var baidu = new Vue({
        el: '#bMap',
        template: _g.getTemplate('address/bMap-main-V'),
        data: {
            hasSelect: false,
            lon: '',
            lat: '',
            baiduLon: '',
            baiduLat: '',
            listIndex: 0,
            province: '',
            city: '',
            district: '',
            village: '',
            list: [{
                name: '广州',
                address: '天河区',
                lon: '',
                lat: '',
                isSelect: true,
            }, {
                name: '北京',
                address: '朝阳区',
                lon: '',
                lat: '',
                isSelect: false,
            }]
        },
        created: function() {
            this.list = [];
        },
        methods: {
            onSelectTap: function(index) {
                // alert(this.list[index].lon);
                if(this.hasSelect == false) {
                    this.listIndex = index;
                    this.list[index].isSelect = true;
                    baidu.lon = this.list[index].lon;
                    baidu.lat = this.list[index].lat;
                    this.hasSelect = true;
                } else {
                    if(this.listIndex != index) {
                        this.list[index].isSelect = true;
                        this.list[this.listIndex].isSelect = false;
                        this.listIndex = index;
                        baidu.lon = this.list[index].lon;
                        baidu.lat = this.list[index].lat;
                    }
                }
                baidu.village = this.list[index].name;
                setTimeout(function() {
                    selectAddress();
                }, 200);
            }
        },
    });
    // 获取用户当前经纬度
    function getLocationServices() {
         //开始定位
        bMap.getLocation({
            accuracy: '100m',
            autoStop: true,
            filter: 1
        }, function(ret, err) {
            if (ret.status) {
              //alert(JSON.stringify(ret));
                baidu.lon = ret.lon;
                baidu.lat = ret.lat;
                openBaiduMap();
            } else {
                 alert('未开启定位功能');
            }
        });
    }
    // 打开百度地图
    function openBaiduMap() {
        bMap.open({
            rect: {
                x: 0,
                y: 0,
                // 比如： 320,若当前环境为 window 中，则值和 winWidth 相同
                w: api.frameWidth,
                h: api.frameHeight / 2,
            },
            center: {
                lon: baidu.lon,
                lat: baidu.lat
            },
            zoomLevel: 18,
            showUserLocation: true,
            fixedOn: api.frameName,
            fixed: true
        }, function(ret) {
          //alert(JSON.stringify(ret))
            if (ret.status) {
                getNameFromCoords();
                // 监听地图相关事件
                // 点击事件
                bMap.addEventListener({
                    name: 'click'
                }, function(ret) {
                    if (ret.status) {
                        baidu.lon = ret.lon;
                        baidu.lat = ret.lat;
                        setCenter ();
                    }
                });
                /**
                setTimeout(function() {
                    api.sendEvent({
                        name:'common-bMap-V-city',
                        extra: {
                        city: baidu.district
                       }
                    });
                }, 300);
                **/
                // alert('地图打开成功');
            }
        });
    }
    // 根据经纬度设置百度地图中心点
    function setCenter () {
        setTimeout(function() {
            bMap.setCenter({
                coords: {
                    lon: baidu.lon,
                    lat: baidu.lat
                },
                animation: true
            });
            baidu.hasSelect = false;
            addAnnotations();
            getNameFromCoords();
        }, 0);
    }
    // 根据经纬度查找地址信息
    function getNameFromCoords() {
        bMap.getNameFromCoords({
            lon: baidu.lon,
            lat: baidu.lat
        }, function(ret, err) {
          alert(baidu.lon+""+baidu.lat)
            if (ret.status) {
              //  alert(JSON.stringify(ret));
                baidu.province = ret.province;
                baidu.city = ret.city;
                baidu.district = ret.district;
                baidu.list = getAddrDetail(ret.poiList);
            }else{
              alert(JSON.stringify(err))
            }
        });
    }
    // 获取地址详情
    function getAddrDetail(data) {
        return _.map(data, function(item) {
            return {
                name: item.name || '',
                address: item.address || '',
                lon: item.coord.lon || '',
                lat: item.coord.lat || '',
                isSelect: false,
            }
        });
    }
    // 在地图上添加标注信息
    function addAnnotations() {
        bMap.addAnnotations({
            annotations: [{
                id: 1,
                lon: baidu.lon,
                lat: baidu.lat
            }],
            icon: 'widget://',
            draggable: true
        }, function(ret) {
            if (ret) {
                // alert(ret.id);
            }
        });
    }
    // 根据单个关键字在圆形区域内搜索兴趣点
    function searchNearby(searchContent) {
        bMap.searchInCity({
            city: baidu.district,
            keyword: searchContent,
            pageIndex: 0,
            pageCapacity: 20
        }, function(ret, err) {
            if (ret.status) {
                // alert(JSON.stringify(ret));
                baidu.list = getAddressData(ret.results);
                baidu.lon = ret.results[0].lon;
                baidu.lat = ret.results[0].lat;
                setTimeout(function() {
                    bMap.setCenter({
                        coords: {
                            lon: baidu.lon,
                            lat: baidu.lat
                        },
                        animation: true
                    });
                    addAnnotations();
                }, 100);
            }
        });
    }
    // 获取搜索地址详情
    function getAddressData(data) {
        return _.map(data, function(item) {
            return {
                name: item.name || '',
                address: item.address || '',
                lon: item.lon || '',
                lat: item.lat || '',
                isSelect: false,
            }
        });
    }
    // 选择定地址
    function selectAddress() {
        bMap.setCenter({
            coords: {
                lon: baidu.lon,
                lat: baidu.lat
            },
            animation: true
        });
        addAnnotations();
        api.sendEvent({
           name:'common-bMap-V-btn',
        });
    }
    // 确认提交选择的地址
    function sumbitAddress() {
        if(baidu.hasSelect == true) {
            api.sendEvent({
                name:'address-add-address',
                extra: {
                    province: baidu.province,
                    city: baidu.city,
                    district: baidu.district,
                    village: baidu.village,
                    lon: baidu.lon,
                    lat: baidu.lat,
                }
            });
            api.closeWin({});
        } else {
            _g.toast('请选择地址');
        }
    }
    // 选择城市模块
    function selectCity() {
        var UIActionSelector = api.require('UIActionSelector');
        UIActionSelector.open({
            datas: 'widget://res/Regions.json',
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
            fixedOn: api.frameName
        }, function(ret, err) {
            if (ret) {
                // alert(JSON.stringify(ret));
                if(ret.eventType != 'cancel') {
                    setTimeout(function() {
                        baidu.province = ret.level1;
                        baidu.city = ret.level2;
                        baidu.district = ret.level3;
                        api.sendEvent({
                            name:'common-bMap-V-city',
                            extra: {
                            city: ret.level3
                           }
                        });
                    }, 0);
                    UIActionSelector.hide();
                }
            } else {
                alert(JSON.stringify(err));
            }
        });
    }
    // 选择城市
    api.addEventListener({
        name: 'address-bMap-city'
    }, function(ret, err) {
        setTimeout(function() {
            selectCity();
        }, 0);
    });
    // 关键字搜索
    api.addEventListener({
        name: 'address-bMap-searchAddr'
    }, function(ret, err) {
        var param = ret.value.searchContent;
        searchNearby(param);
    });
    // 提交选择地址
    api.addEventListener({
        name: 'address-bMap-confirm'
    }, function(ret, err) {
        setTimeout(function() {
            sumbitAddress();
        }, 0);
    });

    getLocationServices();

    module.exports = {};
});
