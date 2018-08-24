define(function(require, exports, module) {
    var Http = require('U/http');
    var UserInfo = _g.getLS("UserInfo");
    var filePath = encodeURI(api.pageParam.filePath);  // 格式转换
    var fileName = api.pageParam.fileName;
    var fileSize = api.pageParam.fileSize;
    // alert(filePath);
    var downloadTip = new Vue({
        el: '#content',
        template: _g.getTemplate('popupbox/downloadTip-body-V'),
        data: {
            isNetwork: false,
            fileName: fileName,
            filePath: filePath,
            fileSize: fileSize,
            sameName: false,
        },
        methods: {
            onCancelTap: function() {
                api && api.closeFrame({

                });
            },
            onDownloadTap: function() {
                downloadTip.sameName = false;
                // _g.setLS('downloadList',null);
                var downloadList = _g.getLS('downloadList') || [];
                if(downloadList.length > 0) {
                    _.each(downloadList, function(item, index) {
                        if(item.name == fileName) {
                            downloadTip.sameName = true;
                            return;
                        }
                    });
                }
                if(downloadTip.sameName) {
                    alert('已存在一样名字的文档');
                } else {
                    var downloadFile = {
                        name: fileName,
                        isDownload: false,
                        url:''
                    };
                    downloadList.push(downloadFile);
                    _g.setLS('downloadList',downloadList);
                    api.download({
                        url: filePath,
                        savePath: 'fs:/' + '/ttshengxian/' + fileName,
                        report: true,
                        cache: true,
                        allowResume: true,
                    }, function(ret, err) {
                        if (ret.state == 1) {
                            downloadList = _g.getLS('downloadList') || [];
                            _.each(downloadList, function(item, index) {
                                if(item.name == fileName) {
                                    item['url'] = '/ttshengxian/' + fileName;
                                    item['isDownload'] = true;
                                    downloadList[index] = item;
                                    _g.setLS('downloadList',downloadList);
                                }
                            });
                            setTimeout(function() {
                                _g.openWin({
                                    header: {
                                        data: {
                                            title: '文件管理',
                                        },
                                        // template:'common/header-menu-V'
                                    },
                                    name: 'file-file',
                                    url: '../file/file.html',
                                    bounces: false,
                                    slidBackEnabled: false,
                                });
                                setTimeout(function() {
                                    downloadTip.onCancelTap();
                                }, 500);
                            }, 0);
                        } else if(ret.state == 2) {
                            alert(_g.j2s(ret));
                            _g.toast('下载失败');
                        }
                    });
                }
            }
        }
    });
    module.exports = {};
});
