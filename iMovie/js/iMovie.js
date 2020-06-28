jQuery(function(){
 function launchFullScreen(element) {
        if(element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }
	try{
        launchFullScreen(document.documentElement);
	}catch(e){}
window.loadscript=function(url) {
    var script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
}
function checkLockState(lockCallback,unLockCallback){
	try{
window.cryptographer = new Jose.WebCryptographer();
cryptographer.setKeyEncryptionAlgorithm("A128KW");
cryptographer.setContentEncryptionAlgorithm("A128CBC-HS256");
window.shared_key = crypto.subtle.importKey("jwk", {"kty":"oct", "k":"XyFAP9qDYielJnUHOK1RtZ"}, {name: "AES-KW"}, true, ["wrapKey", "unwrapKey"]);
var lockKey=localStorage.getItem('$lock')||"";
var cookieToken=Cookies.get('MVORZ')||"";
if(lockKey==""||cookieToken==""){
	lockCallback();
	return ;
}
var decrypter = new Jose.JoseJWE.Decrypter(window.cryptographer, window.shared_key);
decrypter.decrypt(cookieToken).then(function(decrypted_plain_text) {
  if (decrypted_plain_text == lockKey) {
	unLockCallback();
  }else{
	lockCallback();
  }
}).catch(function(err) {
	lockCallback();
});
	}catch(e){
		lockCallback();
	}
}

if(mui.os.wechat){
loadscript("js/clock.js");
return ;
}
checkLockState(function(){
loadscript("js/lock.js");
return;
},function(){
loadscript("js/business.js");
});
});