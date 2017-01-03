
(function(){
		var el = document.documentElement;
		var bodyEl;
		var pages = [];	

		//Clean <body>
		function clean(node){
  			for(var a = 0; a < node.childNodes.length; a++){
    			var child = node.childNodes[a];
    			if(child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))){
      				node.removeChild(child);
      				a--;
   				}else if(child.nodeType === 1){
      				clean(child);
    			}
  			}
		}
		clean(document.body);
		
		//Get <body>
		if(el.firstChild.nextSibling.tagName === "BODY"){
			bodyEl = el.firstChild.nextSibling;
		}else if(el.firstChild.nextSibling.nextSibling.tagName ==="BODY"){
			bodyEl = el.firstChild.nextSibling.nextSibling;
		}
			
		//Add only element objects (no text objects) to 'pages' array	
		for(var b = 0; b < bodyEl.childNodes.length; b++){		
			if(bodyEl.childNodes[b].nodeType===1 && bodyEl.childNodes[b].tagName === "DIV"){
					pages.push(bodyEl.childNodes[b]);
		    }	
	     }
   	
	 	//Event handler for navigation button scroll animation
	   	function addClickHandler(navButtons){
	    	navButtons.addEventListener("click", function(e){
	   			function easeInOutQuart(t, b, c, d) {
	   			// t: current time, b: begInnIng value, c: change In value, d: duration
  				if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
  				return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
				}

	    		var thisButtonName = this.innerHTML;
	    		var targetPageName = this.getAttribute("data-name").replace(/navButtons/gi,"page");
	    		var targetPage = document.querySelector("[data-name~="+targetPageName+"]");
	    		var currentPageTop = window.pageYOffset;
	    		var targetPageTop = targetPage.offsetTop;
	    		var start = new Date().getTime();
	    		var duration = 1500;
	    	
	    		// Scroll		
	    		var animationInt = setInterval(function(){	
	    			var time = new Date().getTime() - start;
	    			if(time>duration){
	    				time = duration;
	    			}
	    			var x = easeInOutQuart(time, currentPageTop, targetPageTop - currentPageTop, duration);
	    			window.scrollTo(0, x);	
		    		if(time>=duration){
		    			clearInterval(animationInt);
		    		}
		    	}, 30);		
		    }, false);		
	    }
		
	  	//Get every element with a class of "main_nav"
    	var mainNav = document.getElementsByClassName("main_nav");  
		
		 //If one and only one of BODY'S children is a nav element, return true
		 function outerNavAmount(){
		 	var count = 0;
		 	for(var c=0; c<bodyEl.childNodes.length; c++){
		 		if(bodyEl.childNodes[c].tagName === "NAV"){
		 			count++;		 			
		 		}
		 	}
		 	if(count === 1){
				return true;
			}else if(count > 1){
				return false;
			}else{
				return "neither";
			}
		 }

		 //If one and only one of any PAGE'S outer div's children is a nav element, return true
		 function innerNavAmount(){
		 	var count = 0;
		 	for(var d = 0; d<bodyEl.childNodes.length; d++){
		 		for(var e = 0; e<bodyEl.childNodes[d].childNodes.length; e++){
		 			if(bodyEl.childNodes[d].childNodes[e].tagName === "NAV"){
		 				count++;
		 			}
		 		}
		 	}
		 	if(count === 1){
		 		return true;
		 	}else if(count > 1){
		 		return false;
		 	}else {
		 		return "neither";
		 	}
		 }

		 //Applies links and styles to any and all <li> or <a> <nav> children
		 function applyLinkAttributes(entry, entryNumber){
		 	entry.setAttribute("data-name","navButtons_"+(entryNumber+1));
		 	entry.style.cursor ="pointer";
		 	addClickHandler(entry);
		 }

		 // While no mainNav class is specified, addresses <nav> accordingly.
		 function actOnNavType(list){
	 		if(list.tagName === "NAV" && list.firstChild.tagName === "UL"){
	 			for(var f = 0; f< list.firstChild.childNodes.length; f++){	
	 				applyLinkAttributes(list.firstChild.childNodes[f],f);
	 			}
	 		}else if(list.tagName === "NAV" && list.firstChild.tagName === "A"){
	 			for (var g = 0; g < list.childNodes.length; g++){
	 				applyLinkAttributes(list.childNodes[g],g);
	 			}
	 		}
		 }

		 //When mainNav class is specified:
		 function actOnMainNavType(list){	 	
		 	for(var h = 0; h < list.length; h++){
			 	if(list[h].firstChild.tagName === "UL"){
			 		for(var i = 0; i < list[h].firstChild.childNodes.length; i++){		 			
			 			applyLinkAttributes(list[h].firstChild.childNodes[i],i);
			 		}
			 	}else if(list[h].firstChild.tagName === "A"){
			 		for(var j = 0; j < list[h].childNodes.length; j++){	
			 			applyLinkAttributes(list[h].childNodes[j],j);
			 		}
			 	}
			 }
		 }	 

    	//Attach links to <nav>s that are located OUTSIDE of the 'pages' divs
  		for(var k = 0; k<bodyEl.childNodes.length; k++){
	  		if(outerNavAmount() && innerNavAmount()==="neither"){		
	  			//If there is only one <nav> located OUTSIDE of the 'pages' divs, do this:
	  				actOnNavType(bodyEl.childNodes[k]);	
	  		//More than one <nav> located OUTSIDE of the 'pages' divs		
	  		}else if (!outerNavAmount() && outerNavAmount() != "neither"){
	  			//If a mainNav class is specified:
	  			if(mainNav[0]){	
	  				actOnMainNavType(mainNav);
	  			}	
	  		}
  		}

  		
  		for(var l = 0; l<pages.length; l++){		
	 		//Set document default height
	  		el.style.height = 100 + "%";

	  		//Set <body> default styles
	  		bodyEl.style.margin = 0;
	  		bodyEl.style.padding = 0;
	  		bodyEl.style.height = 100+"%";
	  		
	  		//Create a class attribute and attribute name of 'page_i' for each 'pages' array element			   
	     	pages[l].setAttribute("data-name","page_" + (l+1));
	     	pages[l].style.margin = 0 +" auto";
	     	pages[l].style.height = 100 + "%";
	     	
	     	//Apply name and number to navigation links in association with each page
	     	for(var m=0; m<pages[l].childNodes.length; m++){
	     		
     			//If only one <nav> total is located anywhere WITHIN any of the 'pages' divs:
     			if(innerNavAmount() && outerNavAmount() === "neither"){
			    	actOnNavType(pages[l].childNodes[m]);

			    //If more than one <nav> is located anywhere WITHIN any of the 'pages' divs OR if any number of <nav>s exist inside or outside 'pages' divs AND mainNav class is specified:
			    }else if((!innerNavAmount() && innerNavAmount() != "neither") || ((outerNavAmount() != "neither") && (innerNavAmount() != "neither") && mainNav[0])){
			    	actOnMainNavType(mainNav);

			   //If there are any amount of <nav> elements both INSIDE AND OUTSIDE of 'pages' divs BUT no mainNav class is specified:
	  			}else if((outerNavAmount() != "neither") && (innerNavAmount() != "neither") && mainNav[0]===undefined){
  					return;		
	  			}	
	     	}    	
	    }

	    exports.printMsg = function(){console.log("This is a test message.")}
})();
 
	    