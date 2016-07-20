function clickRun() {
	var base_tpl = "<!doctype html>"
		+ "<html>"
		+ "<head>"
		+ "<meta charset=\"utf-8\">"
		+ "<title>Microsite</title>"
		+ '<scr' + 'ipt type="text/javascript" src="'+ipAddress+'js/1.11.3/ewebrtc-sdk.min.js"></scr' + 'ipt>' 
	    + '<scr' + 'ipt type="text/javascript" src="'+ipAddress+'js/1.11.3/jquery.min.js"></scr' + 'ipt>' 
		+ "</head>"
		+ "<body>"
		+ document.getElementById("widget4_htmlText").value 
		+ "</body>"
		+ "<script>" 
		+ document.getElementById("widget4_javascriptText").value
		+ "</script>" + "</html>";

	function loadcssfile(filename) {
		var fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
		if (typeof fileref != "undefined") {
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}
	}

	loadcssfile(ipAddress+'css/iFrameResults.css');
	var ifr = document.createElement("iframe");
	ifr.setAttribute("frameborder", "0");
	ifr.setAttribute("id", "iframeResult");
	document.getElementById("footerDataWidget").innerHTML = "";
	document.getElementById("footerDataWidget").appendChild(ifr);
	var ifrw = (ifr.contentWindow) ? ifr.contentWindow
			: (ifr.contentDocument.document) ? ifr.contentDocument.document
					: ifr.contentDocument;
	ifrw.document.open();
	ifrw.document.write(base_tpl);
	ifrw.document.close();
}
