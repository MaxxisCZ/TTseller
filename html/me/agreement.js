define(function(require,exports,module) {
    var systemType = api.systemType;
    var UserInfo = _g.getLS("UserInfo");
    var Http = require('U/http');
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var docReader = api.require('docReader');
    var windowHeight = window.innerHeight;
    var agreement = new Vue({
        el:'#agreement',
        template:_g.getTemplate('me/agreement-main-V'),
        data:{
            post1: '请上传',
            post2: '请上传',
            post3: '请上传',
            post4: '请上传',
            post5: '请上传',
            post6: '正面上传',
            post7: '反面上传',
            isNoagreemment: false,
            isNotPass: false,
            isPass: false,
            isRead: false,
            agentname: '',
            licence: '',
            shopsign: '',
            licencepic: '',
            represent: '',
            idcard: '',
            idcardpic1: '',
            idcardpic2: '',
            attention: '',
            shoppic1: '',
            shoppic2: '',
            shoppic3: '',
            licencepicRoot: '',
            idcardpic1Root: '',
            idcardpic2Root: '',
            shopsignRoot: '',
            shoppic1Root: '',
            shoppic2Root: '',
            shoppic3Root: '',
            filePath: '',
            fileName: '',
            fileSize: '',
        },
        methods:{
            onPictureTap: function(param) {
                if(this.isNoagreemment == true) {
                    _g.openPicActionSheet({
                        allowEdit: true,
                        suc: function(ret) {
                            postImage(ret.data, param);
                        }
                    });
                }
            },
            onPostTap: function() {
                if(this.agentname == '') {
                    _g.toast('商家名称不能为空')
                    return
                }
                if(this.licence == '') {
                    _g.toast('营业执照号码不能为空')
                    return
                }
                if(this.licencepicRoot == '') {
                    _g.toast('营业执照照片不能为空')
                    return
                }
                if(this.represent == '') {
                    _g.toast('法定代表人姓名不能为空')
                    return
                }
                if(this.idcardpic1Root == '') {
                    _g.toast('法定代表人身份证照片不齐全')
                    return
                }
                if(this.idcardpic2Root == '') {
                    _g.toast('法定代表人身份证照片不齐全')
                    return
                }
                if(this.idcard == '') {
                    _g.toast('法人身份证号码不能为空')
                    return
                }
                if(this.shopsignRoot == '') {
                    _g.toast('门头/招牌招牌不能为空')
                    return
                }
                if(this.shoppic1Root == '') {
                    _g.toast('门店内景图至少要三张')
                    return
                }
                if(this.shoppic2Root == '') {
                    _g.toast('门店内景图至少要三张')
                    return
                }
                if(this.shoppic3Root == '') {
                    _g.toast('门店内景图至少要三张')
                    return
                }
                postAgreement();
            },
            onReadAgreementTap: function() {
                docReader.open({
                    path: 'fs://agreement/' + agreement.filePath
                }, function(ret, err) {
                    if (ret.status) {
                        // alert(JSON.stringify(ret));
                    } else {
                        if (err.code == -1) {
                            _g.toast('未知错误');
                        } else if(err.code == 1) {
                            _g.toast('文件不存在');
                        } else if(err.code == 2) {
                            _g.toast('文件格式不支持');
                        }
                    }
                });
            },
            onDownloadTap: function() {
                downloadData();
            },
            onSumbitTap: function() {
                if(agreement.isRead == false) {
                    agreement.isRead = true;
                } else {
                    agreement.isRead = false;
                }
            },
            onPostReadTap: function() {
                if(agreement.isRead == true) {
                    postRead();
                } else {
                    alert('未同意TT商家APP的相关条款');
                }
            },
        }
    });
    // 上传协议图片
    function postImage(path,type) {
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
                    param: 5,
                },
                files: {
                    img_tx: path
                }
            }
        }, function(ret, err) {
            if (ret.zt = 1) {
                if(type == 'licencepic') {
                    agreement.licencepicRoot = ret.tx;
                    agreement.post1 = '';
                } else if (type == 'shopsign') {
                    agreement.shopsignRoot = ret.tx;
                    agreement.post2 = '';
                } else if (type == 'idcardpic1') {
                    agreement.idcardpic1Root = ret.tx;
                    agreement.post6 = '';
                } else if (type == 'idcardpic2') {
                    agreement.idcardpic2Root = ret.tx;
                    agreement.post7 = '';
                } else if (type == 'shoppic1') {
                    agreement.shoppic1Root = ret.tx;
                    agreement.post3 = '';
                } else if (type == 'shoppic2') {
                    agreement.shoppic2Root = ret.tx;
                    agreement.post4 = '';
                } else if (type == 'shoppic3') {
                    agreement.shoppic3Root = ret.tx;
                    agreement.post5 = '';
                }
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
                api.alert({
                    msg: JSON.stringify(err)
                });
            }
            _g.hideProgress();
        });
    }
    // 保存协议
    function postAgreement() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
                agentname: agreement.agentname,
                licence: agreement.licence,
                licencepic: agreement.licencepicRoot,
                represent: agreement.represent,
                idcard: agreement.idcard,
                idcardpic1: agreement.idcardpic1Root,
                idcardpic2: agreement.idcardpic2Root,
                shopsign: agreement.shopsignRoot,
                shoppic1: agreement.shoppic1Root,
                shoppic2: agreement.shoppic2Root,
                shoppic3: agreement.shoppic3Root,
            },
            lock: false,
            isSync: true,
            url: '/jiekou/agentht/agent/editProtocol.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    agreement.isNoagreemment = false;
                    getAgreement();
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
    // 获取协议
    function getAgreement() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            isSync: true,
            url: '/jiekou/agentht/agent/getProtocol.aspx',
            success: function(ret) {
            //alert(ret.zt)
                if(ret.zt != 0) {
                    agreement.agentname = ret.data.agentname || '';
                    if(ret.zt == 1) {
                        agreement.isNoagreemment = true;
                    } else if(ret.zt == 2) {
                        agreement.isNotPass = true;
                        showPic(ret.data);
                    } else if(ret.zt == 3){
                        agreement.isNotPass = true;
                        showPic(ret.data);
                    } else if(ret.zt == 4) {
                        agreement.isPass = true;
                        showPic(ret.data);
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
                }
            },
            error: function(err) {}
        });
    }
    function downloadData() {
        api && api.openFrame({
            name: 'popupbox-downloadTip',
            url: '../popupbox/downloadTip.html',
            rect: {
                x: 0,
                y: headerHeight,
                w: 'auto',
                h: windowHeight,
            },
            pageParam: {
                filePath: agreement.filePath,
                fileName: agreement.fileName,
                fileSize: agreement.fileSize,
            }
        });
    }
    // 提交确认已读协议
    function postRead() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            isSync: true,
            url: '/jiekou/agentht/agent/setIsread.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    agreement.isNoagreemment = false;
                    agreement.isNotPass = false;
                    agreement.isPass = false;
                    getAgreement();
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
    // 获取协议内容
    function getData() {
        Http.ajax({
            data: {
                loginname: UserInfo.loginname,
                agentid: UserInfo.agentid,
                staffid: UserInfo.staffid,
                token: UserInfo.token,
            },
            lock: false,
            isSync: true,
            url: '/jiekou/agentht/agent/downloadProtocol2.aspx',
            success: function(ret) {
                if (ret.zt == 1) {
                    agreement.filePath = ret.data.filepath;
                    var filePath = ret.data.filepath;
                    if(systemType != 'ios') { // 安卓的情况
                        filePath = encodeURI(filePath); // encodeURI() 函数可把字符串作为 URI 进行编码
                    }
                    agreement.fileSize = ret.data.filesize;
                    agreement.fileName = ret.data.filename;
                    setTimeout(function() {
                        api.download({
                            url: filePath,
                            savePath: 'fs://agreement/' + ret.data.filepath,
                            report: true,
                            cache: true,
                            allowResume: true
                        }, function(ret, err) {

                        });
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
            error: function(err) {}
        });
    }
    // 展示图片
    function showPic(result) {
        agreement.agentname = result.agentname;  // 商家名称
        agreement.represent = result.represent;  // 法定代表人姓名
        agreement.idcard = result.idcard;  // 法定代表人身份证号码
        agreement.idcardpic1Root = result.idcardpic1;  // 身份证照片正面
        if(result.licencepic != '') {
            agreement.post6 = '';
        }
        agreement.idcardpic2Root = result.idcardpic2;  // 身份证照片反面
        if(result.licencepic != '') {
            agreement.post7 = '';
        }
        agreement.licence = result.licence;  // 营业执照号码
        agreement.licencepicRoot = result.licencepic;  // 营业执照图片
        if(result.licencepic != '') {
            agreement.post1 = '';
        }
        agreement.shopsignRoot = result.shopsign; // 门头/招牌照片
        if(result.shopsign != '') {
            agreement.post2 = '';
        }
        agreement.shoppic1Root = result.shoppic1;  // 门店内景图1
        if(result.licencepic != '') {
            agreement.post3 = '';
        }
        agreement.shoppic2Root = result.shoppic2;  // 门店内景图2
        if(result.shoppic2 != '') {
            agreement.post4 = '';
        }
        agreement.shoppic3Root = result.shoppic3;  // 门店内景图3
        if(result.shoppic3 != '') {
            agreement.post5 = '';
        }
    }

    api.addEventListener({
        name: 'me-agreement-attention'
    }, function(ret, err) {
        _g.openWin({
            header: {
                data: {
                    title: '注意事项',
                },
            },
            name: 'me-attention',
            url: '../me/attention.html',
            pageParam: {

            }
        });
    });

    getAgreement();
    getData();

    module.exports = {};
});
