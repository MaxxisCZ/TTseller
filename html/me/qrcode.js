define(function(require, exports, module) {

    var Http = require('U/http');
    var UserInfo = _g.getLS('UserInfo');
    var trans = api && api.require('trans');

    var qrcode = new Vue({
        el: '#qrcode',
        template: _g.getTemplate('me/qrcode-V'),
        data: {
            sex: 1,
            name: '周杰伦',
            // province: '江苏',
            // city: '苏州',
            avatar: '',
            icon: '../../image/me/boy.png',
            qrcode: '',
            mobile: '',
            agent: '',
            show: true
        },
        methods: {

        }
    });

    $('#qrcode-container').qrcode({
        "size": 360,
        "color": "#3a3",
        // "background": "#fff",
        "quiet": 1,
        "text": 'http://139.196.27.119:88/view/agentht/staff/staffInformation1.aspx?staffid=' + UserInfo.staffid,
        // "image": '../../image/me/bg-qrcode.jpg'
    });
    var base64 = '';
    setTimeout(function(){
        var qrcode = $('#qrcode-container').find('canvas')[0];
        var canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 360;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 360, 360);
        ctx.drawImage(qrcode, 0, 0, 360, 360, 0, 0, 360, 360);
        base64 = canvas.toDataURL("image/jpeg");
    }, 0)
    function savaImage() {
        _g.showProgress();
        trans.saveImage({
            base64Str: base64.split(',')[1],
            album: true,
        }, function(ret, err){
            _g.hideProgress();
            if( ret.status ){
                _g.toast('成功保存到本地相册中!');
            }else{
                alert( JSON.stringify( err ) );
            }
        });
    }
    function getData() {
        if (_g.getLS('UserInfo')) {
            qrcode.name = UserInfo.name;
            // qrcode.sex = UserInfo.sex;
            qrcode.avatar = UserInfo.head;
          //  alert(UserInfo.head)
            qrcode.mobile = UserInfo.mobile;
            qrcode.agent = UserInfo.agentname;
        }else {
            return false;
        }
    }
    getData();
    api.addEventListener({
        name: 'me-qrcode-save'
    }, function(ret, err) {
        savaImage();
    });
    module.exports = {};
});
