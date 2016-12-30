(function(){
			var el = document.documentElement;
			var bodyEl;
			var pages = [];
			

			//Remove all text and comment objects from <body>
			(function(){
				function clean(node){
		  			for(var n = 0; n < node.childNodes.length; n++){
		    			var child = node.childNodes[n];
		    			if(child.nodeType === 8 || (child.nodeType === 3 && !/\S/.test(child.nodeValue))){
		      				node.removeChild(child);
		      				n--;
		   				}else if(child.nodeType === 1){
		      				clean(child);
		    			}
		  			}
				}
				clean(document.body);
			})();

			//Get <body> tag
			(function(){
				if(el.firstChild.nextSibling.tagName === "BODY"){
					bodyEl = el.firstChild.nextSibling;
				}else if(el.firstChild.nextSibling.nextSibling.tagName ==="BODY"){
					bodyEl = el.firstChild.nextSibling.nextSibling;
				}
			})();	
				
		
			//Add only element objects (no text objects) to 'pages' array
			(function(){
				for(var i = 0; i < bodyEl.childNodes.length; i++){
					
					if(bodyEl.childNodes[i].nodeType===1 && bodyEl.childNodes[i].tagName === "DIV"){
							pages.push(bodyEl.childNodes[i]);
				    }
					
			     }
		    })();	


		    
			 (function(){  
			 	//Event handler for navigation buttons' scroll animation
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
				    		var viewScroll = window.pageYOffset;

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
			 	for(var m=0; m<bodyEl.childNodes.length; m++){
			 		if(bodyEl.childNodes[m].tagName === "NAV"){
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
			 	for(var s = 0; s<bodyEl.childNodes.length; s++){
			 		for(var t = 0; t<bodyEl.childNodes[s].childNodes.length; t++){
			 			if(bodyEl.childNodes[s].childNodes[t].tagName === "NAV"){
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


			 // While no mainNav class is specified, this decides whether <nav> uses <ul> or <a> tags and acts accordingly.
			 function actOnNavType(list){
		 		if(list.tagName === "NAV" && list.firstChild.tagName === "UL"){
		 			for(var k = 0; k < list.firstChild.childNodes.length; k++){	
		 				applyLinkAttributes(list.firstChild.childNodes[k],k);
		 			}
		 		}else if(list.tagName === "NAV" && list.firstChild.tagName === "A"){
		 			for (var l = 0; l < list.childNodes.length; l++){
		 				applyLinkAttributes(list.childNodes[l],l);
		 			}
		 		}
			 }

			 //How treat <navs> when mainNav class is specified:
			 function actOnMainNavType(list){	 	
			 	for(var m = 0; m < list.length; m++){
				 	if(list[m].firstChild.tagName === "UL"){
				 		for(var n = 0; n < list[m].firstChild.childNodes.length; n++){		 			
				 			applyLinkAttributes(list[m].firstChild.childNodes[n],n);
				 		}
				 	}else if(list[m].firstChild.tagName === "A"){
				 		for(var o = 0; o < list[m].childNodes.length; o++){	
				 			applyLinkAttributes(list[m].childNodes[o],o);
				 		}
				 	}
				 }
			 }	 

	    	//Attach links to <nav>s that are located OUTSIDE of the 'pages' divs
	  		for(var n = 0; n<bodyEl.childNodes.length; n++){
		  		if(outerNavAmount() && innerNavAmount()==="neither"){		
		  			//If there is only one <nav> located OUTSIDE of the 'pages' divs, do this:
		  				actOnNavType(bodyEl.childNodes[n]);	
		  		//More than one <nav> located OUTSIDE of the 'pages' divs		
		  		}else if (!outerNavAmount() && outerNavAmount() != "neither"){
		  			//If a mainNav class is specified:
		  			if(mainNav[0]){	
		  				actOnMainNavType(mainNav);
		  			}	
		  		}
	  		}

	  		//Set document default height
	  		el.style.height = 100 + "%";
	  		//Set <body> default styles
	  		bodyEl.style.margin = 0;
	  		bodyEl.style.padding = 0;
	  		bodyEl.style.height = 100+"%";
	  		//Create a class attribute and attribute name of 'page_i' for each 'pages' array element
		    for(var i = 0; i<pages.length; i++){
		     	pages[i].setAttribute("data-name","page_" + (i+1));
		     	pages[i].style.margin = 0 +" auto";
		     	pages[i].style.height = 100 + "%";
		     	

		     	
		     	
		     	
		     	
		     	
		     	//Apply name and number to navigation links in association with each page
		     	for(var j=0; j<pages[i].childNodes.length; j++){
		     		
	     			//If only one <nav> total is located anywhere WITHIN any of the 'pages' divs:
	     			if(innerNavAmount() && outerNavAmount() === "neither"){

				    	actOnNavType(pages[i].childNodes[j]);
				    //If more than one <nav> is located anywhere WITHIN any of the 'pages' divs OR if any number of <nav>s exist inside or outside 'pages' divs AND mainNav class is specified:
				    }else if((!innerNavAmount() && innerNavAmount() != "neither") || ((outerNavAmount() != "neither") && (innerNavAmount() != "neither") && mainNav[0])){
				    	actOnMainNavType(mainNav);
				   //If there are any amount of <nav> elements both INSIDE AND OUTSIDE of 'pages' divs BUT no mainNav class is specified:
		  			}else if((outerNavAmount() != "neither") && (innerNavAmount() != "neither") && mainNav[0]===undefined){
	  					return;		
		  			}
		     		
		     	}    	
		    }


	   		})();
	    })();

	    