function openCloseFilters(){
	var filters = document.getElementById('filters');
	var filter_bar = document.getElementById('filter_bar');
	var content = document.getElementById('content');
	if(filters.style.width == "5%" || filters.style.width == ""){
		filters.style.width = "20%";
		filters.style.maxWidth = "200px";
		filter_bar.style.opacity = "1";
		content.style.width = "80%";
		content.style.minWidth = "calc(100% - 200px)";
	}else{
		filters.style.width = "5%";
		filter_bar.style.opacity = "0";
		content.style.width = "95%";
		setTimeout(function(){
			filters.style.maxWidth = "25px";
			content.style.minWidth = "calc(100% - 25px)";
		},200);
	}
}