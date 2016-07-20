$(document).ready(function() {
		
	$('#ATTbrowserid').load(config.url + 'views/widget/jsdocs/ATT.browser.html', function() {
		navigate();
	});
	
	$('#ATTlogManagerid').load(config.url + 'views/widget/jsdocs/ATT.logManager.html', function() {
		navigate();
	});
	
	$('#ATTAPIErrorsid').load(config.url + 'views/widget/jsdocs/ATT.private.errorStore.APIErrors.html', function() {
		navigate();
	});
	
	$('#ATTSDKErrorsid').load(config.url + 'views/widget/jsdocs/ATT.private.errorStore.SDKErrors.html', function() {
		navigate();
	});
	
	$('#ATTrtcPhoneid').load(config.url + 'views/widget/jsdocs/ATT.rtc.Phone.html', function() {
		navigate();
	});
	
	$('#ATTlogManagerLoggerid').load(config.url + 'views/widget/jsdocs/ATT.logManager.Logger.html', function() {
		navigate();
	});
	
	$('#ATTPhoneid').load(config.url + 'views/widget/jsdocs/PhoneObject.html', function() {
		navigate();
	});
	
	$('#ATTPhoneEventsid').load(config.url + 'views/widget/jsdocs/PhoneEvents.html', function() {
		navigate();
	});
	
		
	function navigate()
	{
		var temp = window.location.href.split('#');
	      if(typeof temp[1] != 'undefined'){
	    	  console.log("hash value is not undefined");
		      var elScrollTo = '#'+temp[1];
		      var $el = $(elScrollTo);
		      /*if(typeof $el.offset() != 'undefined'){*/
			      $('body,html').animate({scrollTop: $el.offset().top }, 400, 'swing', function() {
			        location.hash = elScrollTo;
			      });
		      /*}*/
	      }
	}
});


