define(function(require, exports, module) {
    var UserInfo = _g.getLS('UserInfo');
	  var Http = require('U/http');
    var radiationSetUp = new Vue({
        el: '#radiationSetUp',
        template: _g.getTemplate('index/radiationSetUp-main-V'),
        data:{
          range:'',
        },
        created: function() {

        },
        methods:{
          onradiationTap:function(){
              //设置辐射距离
              setRadiation();
          }
        }
    });

    //获取辐射距离
    function getRadiation(){
      Http.ajax({
        data: {
            loginname: UserInfo.loginname,
            agentid: UserInfo.agentid,
            staffid: UserInfo.staffid,
            token: UserInfo.token,
        },
        url: '/jiekou/agentht/agent/getRadiationRange.aspx',
        success:function(ret){
          if(ret.zt == 1){
              radiationSetUp.range=ret.data.range;
          }else if(ret.zt == 0){
              _g.toast(ret.msg);
          }else if(ret.zt == -1){
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
      })
    }
   // 设置辐射距离
   function setRadiation(){
     Http.ajax({
       data:{
         loginname: UserInfo.loginname,
         agentid: UserInfo.agentid,
         staffid: UserInfo.staffid,
         token: UserInfo.token,
         range:radiationSetUp.range,
       },
       url:'/jiekou/agentht/agent/setRadiationRange.aspx',
       success:function(ret){
         if(ret.zt == 1) {
             _g.toast(ret.msg);
         }else if (ret.zt == 0) {
            _g.toast(ret.msg);
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
     })
   }



    getRadiation();
    module.exports = {};

});
