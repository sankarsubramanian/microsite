

var ipAddress = 'https://lprod.code-api-att.com/ewebrtc/content/';



requirejs.config({
	paths : {
		'bootstrap' : ipAddress + 'js/bootstrap.min'		
	},
	shim : {
		"bootstrap" : {
			deps : [ipAddress + 'js/1.11.3/jquery.min.js']
		}
	}
});

requirejs([ipAddress + 'js/1.11.3/jquery.min.js', 'bootstrap',
		   ipAddress + 'js/Result.js', ipAddress + 'js/javascript.js',
		   ipAddress + 'js/xml.js', ipAddress + 'js/lib/codemirror.js'
		   ],function($, bootstrap, result, javascript, xml, CodeMirror) {
			$ = jQuery.noConflict();
			/*console.log($);
			console.log(jQuery);*/
			var url = $("#tutorialVideo").attr('src');
			$("#modal_video").on('hide.bs.modal', function() {
				$("#tutorialVideo").attr('src', '');
			});
			$("#modal_video").on('show.bs.modal', function() {
				$("#tutorialVideo").attr('src', url);
			});
			$('#accountLoginId').load(ipAddress + 'views/widget/login/accountIdLogin.html',function() {
				loadCarouselDataForWidget4("AccountIdLoginLogoutSteps");
				applyCodeStyling();
				
			});
			
			$('#virtualNumberLoginId').load(ipAddress + 'views/widget/login/virtualNumberLogin.html', function() {
				loadCarouselDataForWidget4("VirtualNumberLoginSteps");
				applyCodeStyling();
			});
			
			$('#accounidmakeacall').load(ipAddress + 'views/widget/recipes/accounidmakeacall.html', function() {
				loadCarouselDataForWidget4("AccountIdMakeCallSteps");
				applyCodeStyling();
			});
			
			$('#accountidanswercall').load(ipAddress + 'views/widget/recipes/accountidanswercall.html', function() {
				loadCarouselDataForWidget4("AccountIdAnswerCallSteps");
				applyCodeStyling();
			});
			
			$('#accountidcancelcall').load(ipAddress + 'views/widget/recipes/accountidcancelcall.html', function() {
				loadCarouselDataForWidget4("AccountIdCancelCallSteps");
				applyCodeStyling();
			});
			
			$('#accountidhangupcall').load(ipAddress + 'views/widget/recipes/accountidhangupcall.html', function() {
				loadCarouselDataForWidget4("AccountIdHangUpCallSteps");
				applyCodeStyling();
			});
			
			$('#accountidhrmumcall').load(ipAddress + 'views/widget/recipes/accountidhrmumcall.html', function() {
				loadCarouselDataForWidget4("AccountIdHoldRsmeMuteUnmuteCallSteps");
				applyCodeStyling();
			});
			
			$('#accountidrejectCall').load(ipAddress + 'views/widget/recipes/accountidrejectCall.html', function() {
				loadCarouselDataForWidget4("AccountIdRejectCallSteps");
				applyCodeStyling();
			});
			
			$('#accountidvideoCall').load(ipAddress + 'views/widget/recipes/accountidvideoCall.html', function() {
				loadCarouselDataForWidget4("AccountIdVideoCallSteps");
				applyCodeStyling();
			});
			
			function applyCodeStyling()
			{
				applyStyleToTextArea("widget4_javascriptText","javascript", "240px");
				applyStyleToTextArea("widget4_htmlText", "text/html","240px");
			}
			
			var dict = {
						"AccountIdLoginLogoutSteps": 0,
						"VirtualNumberLoginSteps": 2,
						"AccountIdMakeCallSteps": 3,
						"AccountIdAnswerCallSteps": 3,
						"AccountIdCancelCallSteps": 3,
						"AccountIdRejectCallSteps": 3,
						"AccountIdHangUpCallSteps": 3,
						"AccountIdHoldRsmeMuteUnmuteCallSteps": 3
					   };
			
			function loadCarouselDataForWidget4(jsontype) {
				var content_indi = '';
				var content_inner = '';
				var carouselNumber = dict[jsontype]; 
				                        
				$('.carousel').carousel({
					interval : false
				});
				$.ajax({type : "GET",
						url : ipAddress + "json/accountId/" + jsontype + ".json",
						success : function(deviceJson) {
							for ( var i = 0; i < deviceJson['steps'].length; i++) {
								j = i + 1;
								content_indi  += '<li data-target="#widget4_Carousel" data-slide-to="'
												 + i + '"></li>';
								content_inner += '<div class="item item_widget4"><div><center><h4 class="heading-for-carousel">'
												 + deviceJson['steps'][i]['title']
												 + '</h4></center><p class="text-in-carousel">'
										         + deviceJson['steps'][i]['content']
												 + '</p></div></div>';
							}
							$('#widget4_indicators').append(content_indi);
							$('#widget4_homepageItems').append(
									content_inner);
							$('.item_widget4').first().addClass('active');
							$('.widget4_carousel-indicators > li').first().addClass('active');
							console.log(dict[jsontype]);
							
							$('#widget4_Carousel').carousel(carouselNumber);
						},
						error : function() {
							console.log("error in parsing json");
						}
					});
			}
			
			function applyStyleToTextArea(id, mode, height) {
				var editor = CodeMirror.fromTextArea(document.getElementById(id), {
					lineNumbers : true,
					lineWrapping : true,
					matchBrackets : true,
					mode : mode,
					readOnly : "nocursor"
					});
				   //editor.setSize('auto', "240px");*/
				return editor;
			}
		});
