define(function(require, exports, module) {
    var headerHeight = _g.getLS('appH').header;
    var footerHeight = 0;
    var windowHeight = window.innerHeight;
    var downloadList = _g.getLS("downloadList") || [];
    var UserInfo = _g.getLS("UserInfo");
    var docReader = api.require('docReader');
    var fs = api.require('fs');
	var Http = require('U/http');
    var file = new Vue({
        el: '#file',
        template: _g.getTemplate('file/file-main-V'),
        data: {
            list:[]
        },
        created: function() {

        },
        methods: {
            onReadTap: function(param,event,index) {
                if($(event.target).closest('.ui-list__del').length > 0) {
                    api.confirm({
                        title: '注意',
                        msg: '确定删除该文档',
                        buttons: ['取消', '确定']
                    }, function(ret, err) {
                        if(ret.buttonIndex == 2) {
                            fs.remove({
                                path: 'fs:/'+param
                            }, function(ret, err) {
                                if (ret.status) {
                                    setTimeout(function() {
                                        file.list.splice(index,1);
                                        setTimeout(function() {
                                            _g.setLS('downloadList',file.list);
                                        }, 1000);
                                    }, 0);
                                } else {
                                    alert(JSON.stringify(err));
                                }
                            });
                        }
                    });
                } else {
                   docReader.open({
                        path: 'fs:/'+param
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
               }
            },
        },
    });
    
    function getList() {
        // _g.setLS('downloadList',[]);
        // alert(downloadList.length);
        // alert(_g.j2s(downloadList));
        if(downloadList.length > 0) {
            _.each(downloadList, function(item, index) {
                if(item.isDownload == true) {
                    file.list.push(item);
                }
            });
        }
    }

    getList();
    
    module.exports = {};

});
