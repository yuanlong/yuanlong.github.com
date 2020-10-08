"use strict";
(function () {
    window.addEventListener("load", function () {
        if ("serviceWorker" in window.navigator && !/; wv(;|\)).+ Chrome\/.+ Mobile/g.test(window.navigator.userAgent)) {
            var version = "20201007";
            var swJsURL = "/tv/sw.js?" + version;
            var isRegistered = false;
            if (!isRegistered) {
                isRegistered = true;
                navigator.serviceWorker.register(swJsURL, { scope: '/tv/' }).then(function (registration) {
                    //registration.update();
                }).catch(function (e) {
                    //console.log("[SW]: Error during service worker registration:", e);
                });
            }
        }
    });
})();