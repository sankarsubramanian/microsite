var sdkSessionId, sdkAccessToken, sdkCallTimer, sdkSessionTimeout, sdkOauthURL, phone;

/*document.addEventListener("DOMContentLoaded", function() {*/
window.addEventListener("load", function() {
	
    window.addEventListener("unload", sdkCleanupSession);
    document.getElementById("sdkDialButton").addEventListener("click", sdkValidation);
    document.getElementById("sdkCancelButton").addEventListener("click", function() {phone.cancel()});
    document.getElementById("sdkEndButton").addEventListener("click", function() {phone.hangup()});
    /*document.getElementById("sdkMessage").innerHTML = "Enter a phone number above to make a call.";*/
    document.getElementById("sdkCalleeInput").placeholder = "Enter Phone Number";
    document.getElementById("sdkCalleeInput").maxLength = "10";
});

function sdkValidation() {
    if (ATT.browser.hasWebRTC() !== "Supported") {
        document.getElementById("sdkMessage").innerHTML =  "Your browser is not supported.";
        sdkCalleeInput.disabled = true;
        sdkDialButton.disabled = true;
    } else if (typeof phone !== "object") {
        phone = ATT.rtc.Phone.getPhone();
        sdkRegisterEvents();
    } else {
        sdkStartCall();
    }
}

function sdkRegisterEvents() {
    phone.on('error', sdkError); 
    phone.on('session:ready', sdkSessionReady);
    phone.on('session:disconnected', sdkSessionDisconnected);
    phone.on('session:expired', sdkSessionDisconnected);
    phone.on('call:connecting', sdkConnectingCall);
    phone.on('call:canceled', sdkCleanupCall);
    phone.on('call:connected', sdkConnectedCall);
    phone.on('call:disconnected', sdkCleanupCall);
    phone.on('call:rejected', sdkCleanupCall);
    sdkStartCall();
}

function sdkStartCall() {
    if (!sdkCalleeInput.value) {
        document.getElementById("sdkMessage").innerHTML =  "Please enter a phone number.";
    } else if (isNaN((sdkCalleeInput.value).substring(0,1))) {
            document.getElementById("sdkMessage").innerHTML =  "Please enter a 10-digit phone number. Ex:4251234567";
    } else {
        sdkCalleeInput.value = phone.cleanPhoneNumber(sdkCalleeInput.value);
        if ((sdkCalleeInput.value).length !== 10) {
            document.getElementById("sdkMessage").innerHTML =  "Please enter a 10-digit phone number. Ex:4251234567";
        } else {
            if (!sdkAccessToken) {
                sdkCreateAccessToken();
            } else if(!sdkSessionId) {
                phone.login({token: sdkAccessToken.access_token});
            } else {
                sdkDialCall("1" + sdkCalleeInput.value);
            }
        }
    }
}

function sdkCreateAccessToken() {
    document.getElementById("sdkMessage").innerHTML =  "Preparing your WebRTC session .....";
    var appHost = window.location.hostname;
    if (appHost == "developer.att.com") {
        sdkOauthURL = "https://lprod.code-api-att.com/webrtcsdk/token.php";
    } else if (appHost == "stg-devcentral.cingular.com") {
        sdkOauthURL = "https://ldev.code-api-att.com/webrtcsdk/token.php";
    } else {
        sdkOauthURL = "https://www.attwebrtc.com/portalapp/dhs/token.php";
    }
    var xhrToken = new XMLHttpRequest();

    //xhrToken.open("POST", sdkOauthURL);
    xhrToken.open("POST", tokenUrl);
    xhrToken.setRequestHeader("Content-Type", "application/json");
    xhrToken.onreadystatechange = function() {
        if (xhrToken.readyState == 4) {
            if (xhrToken.status == 200) {
                sdkAccessToken = (JSON.parse(xhrToken.responseText));
                if ("access_token" in sdkAccessToken) {
                    sdkUserId = "att" + (Date.now().toString()).substring(5);
                    phone.associateAccessToken({    
                        userId: sdkUserId,
                        token: sdkAccessToken.access_token,
                        success: function() {phone.login({token: sdkAccessToken.access_token})},
                        error: sdkError
                    });
                } else {
                    sdkError(sdkAccessToken);
                }
            } else {
                sdkError(xhrToken.responseText);
            }
        }
    }
  /*  xhrToken.send(JSON.stringify({request: "token"}));*/
    xhrToken.send(JSON.stringify({request: "token",app_scope: "ACCOUNT_ID"}));
}

function sdkDialCall(callee) {
    phone.dial({
        destination: callee,
        mediaType: "audio",
        localMedia: document.getElementById('sdkLocalMedia'),
        remoteMedia: document.getElementById('sdkRemoteMedia')
    });
    document.getElementById("sdkMessage").innerHTML = "Dialing ....."; 
}

function sdkError(data) {
    console.log(data);
    document.getElementById("sdkMessage").innerHTML = "I am sorry please try your call again."
    sdkCleanupSession();
}

function sdkSessionReady(data) {
    document.getElementById("sdkMessage").innerHTML = "WebRTC session ready .....";
    sdkSessionId = data;
    sdkStartSessionTimeout();
    sdkStartCall();
}

function sdkSessionDisconnected() {
    sdkSessionId = "";
    sdkCleanupCall();
    clearTimeout(sdkSessionTimeout);
}

function sdkConnectingCall() {
    document.getElementById("sdkMessage").innerHTML = "Connecting ....."; 
    document.getElementById("sdkRingBack").play();
    sdkDialButton.hidden = true;
    sdkCancelButton.hidden = false;
}        

function sdkCleanupCall() {
    document.getElementById("sdkRingBack").pause();
    document.getElementById("sdkMessage").innerHTML = "Enter a phone number above to make a call.";
    sdkLocalMedia.hidden = true;
    sdkRemoteMedia.hidden = true;
    sdkDialButton.hidden = false;
    sdkCancelButton.hidden = true;
    sdkEndButton.hidden = true;
    clearInterval(sdkCallTimer);
    sdkStartSessionTimeout();
}

function sdkConnectedCall(data) {
    document.getElementById("sdkRingBack").pause();
    sdkCancelButton.hidden = true;
    sdkEndButton.hidden = false;
    if (data.mediaType == "video") {
        sdkLocalMedia.hidden = false;
        sdkRemoteMedia.hidden = false;
    } 
    sdkStartCallTimer();
    clearTimeout(sdkSessionTimeout);
}

function sdkStartCallTimer() {
    var endCallTime = Date.now() + (3*60*1000); // 3 Minutes
    sdkCallTimer = setInterval(function() {
        var timeLeft = endCallTime - Date.now();
        if (timeLeft > 0) {
            var timeLeftTotalSeconds = Math.floor(timeLeft/1000);
            var timeLeftMinutes = Math.floor(timeLeftTotalSeconds/60);
            var timeLeftSeconds = timeLeftTotalSeconds - timeLeftMinutes * 60;
            if (timeLeftSeconds < 10) {
                timeLeftSeconds = "0" + timeLeftSeconds;
            }
            var timerMessage = "Call Timer: " + timeLeftMinutes + ":" + timeLeftSeconds + " Remaining";
            document.getElementById("sdkMessage").innerHTML = timerMessage;
        } else {
            phone.hangup();
            sdkCleanupCall();
        }
    },1000); //Every 1 second
}

function sdkStartSessionTimeout() {
    var endSessionTime = 5*60*1000; // 5 mininute inactivity
    sdkSessionTimeout = setTimeout(function() {
        if(sdkSessionId) {
            phone.logout()
        }
    }, endSessionTime);
}

function sdkCleanupSession() {
    if (sdkSessionId) {
        sdkSessionId = "";
        phone.logout();
    }
    if (sdkAccessToken) {
        var xhrToken = new XMLHttpRequest();
        //xhrToken.open("POST", sdkOauthURL);
        xhrToken.open("POST",tokenUrl);
        xhrToken.setRequestHeader("Content-Type", "application/json");
       /* xhrToken.send(JSON.stringify({revoke: sdkAccessToken.access_token}));*/
        xhrToken.send(JSON.stringify({revoke: sdkAccessToken.access_token,app_scope: "ACCOUNT_ID"}));
        sdkAccessToken = "";
    }
}
