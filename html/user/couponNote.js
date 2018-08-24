define(function(require, exports, module) {
    var userid = api && api.pageParam.userid;
    var account = api && api.pageParam.mobile;
    var pageIndex = 1;
    var pageSize = 30;
	var Http = require('U/http');
    var couponNote = new Vue({
        el: '#couponNote',
        template: _g.getTemplate('user/couponNote-main-V'),
        data: {
            isNetwork: false,
            logName: 'exome',
            detail: {
                account: account,
                list: [{
                    couponID: '',
                    couponGetData: '',
                    couponLostData: '',
                    couponLimit: '',
                    isCouponWork: '',
                    faceValue: '',
                    reason: '',
                }, ]
            }
        },
        created: function() {
            this.detail.list = [];
        },
        methods: { 
        }
    });
    var getcounponData = function() {
        _g.showProgress();
        Http.ajax({
            data: {
                loginname: _g.getLS('UserInfo').loginname,
                agentid: _g.getLS('UserInfo').agentid,
                staffid: _g.getLS('UserInfo').staffid,
                userid: userid,
                token: _g.getLS('UserInfo').token,
                pageIndex: pageIndex,
                pageSize: pageSize,
            },
            url: '/jiekou/agentht/user/getUserQuan.aspx',
            success: function(ret) {
                if(ret.zt == 1) {
                    setTimeout(function() {
                        if(pageIndex == 1) {
                            couponNote.detail.list = getcounponDetail(ret.data).list;
                        } else {
                            couponNote.detail.list = couponNote.detail.list.concat(getcounponDetail(ret.data).list);
                        }
                        setTimeout(function() {
                            _g.hideProgress();
                        }, 500);
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
                    if(pageIndex == 1) {
                        couponNote.detail.list = [];
                    }
                    window.isNoMore = true;
                    _g.hideProgress();
                    _g.toast(ret.msg);
                }
            },
            error: function(err) {},
        });
    }

    var getcounponDetail = function(result) {
        var item = result ? result : '';
        var detail = item.quans ? item.quans : '';
        var newArray = [];
        for(var i = 0; i < item.quansl; i++)
            newArray.push({
                couponID: detail['quan_'+(i+1)+'_id'] || '',
                couponGetData: detail['quan_'+(i+1)+'_getdate'] || '',
                couponLostData: detail['quan_'+(i+1)+'_lostdate'] || '',
                isCouponWork: effective(detail['quan_'+(i+1)+'_yx']) || '',
                faceValue: detail['quan_'+(i+1)+'_mz'] || '',
                reason: detail['quan_'+(i+1)+'_reason'] || '',
                couponLimit: detail['quan_'+(i+1)+'_limit'] || '',
            });
        return{
            account: item.account || '',
            list: newArray || [],
        }
    }
    function effective(param) {
        if(param == 0) {
            return('是');
        } else {
            return('否');
        }
    }
    _g.setLoadmore(function(ret, err) {
        pageIndex++;
        getcounponData();
    });
    _g.setPullDownRefresh(function() {
        window.isNoMore = false;
        pageIndex = 1;
        // couponNote.detail.list = [];
        getcounponData();
    });
    getcounponData();

    module.exports = {};

});