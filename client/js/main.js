function openCloseFilters(){
	var filters = document.getElementById('filters');
	var filter_bar = document.getElementById('filter_bar');
	var content = document.getElementById('content');
	var openclose = document.getElementById('openclose');
	if(filters.style.width == "5%" || filters.style.width == ""){
		filters.style.width = "20%";
		filters.style.maxWidth = "200px";
		filter_bar.style.width = "100%";
		content.style.width = "80%";
		content.style.minWidth = "calc(100% - 200px)";
		openclose.classList.add('rotate-right');
		setTimeout(function(){
			openclose.src="../img/close.svg";
			openclose.classList.remove('rotate-right');
		},300);
	}else{
		filters.style.width = "5%";
		filter_bar.style.width = "0%";
		content.style.width = "95%";
		openclose.classList.add('rotate-left');
		setTimeout(function(){
			filters.style.maxWidth = "var(--filter-min-width)";
			content.style.minWidth = "calc(100% - 2*var(--filter-min-width))";
			openclose.src="../img/burger.png";
			openclose.classList.remove('rotate-left');
		},300);
	}
}

function showStats(){
	var side_stats = document.getElementById('side_stats');
	var map = document.getElementById('map');
	if(map.style.width=="100%" || map.style.width==""){
		side_stats.style.display = "block";
		setTimeout(function(){
		map.style.width = "30%";
		side_stats.style.width = "calc(70% - 2px)";
		},10);
	}else{
		map.style.width = "100%";
		side_stats.style.width = "0%";
		setTimeout(function(){
			side_stats.style.display = "none";
		},300);
	}
}

setTimeout(function(){
	var side_stats = document.getElementById('side_stats');
	side_stats.style.width = "0%";
	setTimeout(function(){
		side_stats.style.opacity = "1";
		side_stats.style.position = "static";
		side_stats.style.display = "none";
	},300);
},500);