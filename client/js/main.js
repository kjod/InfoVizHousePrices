var path = window.location.pathname;
var page = path.split("/").pop();
var deleteTooltip = false;
if(page=='main.html'){
	setTimeout(function(){
		var side_stats = document.getElementById('side_stats');
		side_stats.style.width = "0%";
		setTimeout(function(){
			side_stats.style.opacity = "1";
			side_stats.style.position = "static";
			side_stats.style.display = "none";
		},300);
	},500);
	var totalQuestions = document.getElementById('questions').getElementsByTagName('section').length;

	deleteTooltip = true;
	filterExplanationTooltip = document.getElementById('filterExplanationTooltip');
	setTimeout(function(){
		filterExplanationTooltip.style.opacity = 0.7;
	},1000);
	setTimeout(function(){
		if(deleteTooltip) filterExplanationTooltip.remove();
		deleteTooltip = false;
	},4000);
}

function openCloseFilters(){
	var filterTitle = document.getElementById('filterTitle');
	var filters = document.getElementById('filters');
	var filter_bar = document.getElementById('filter_bar');
	var content = document.getElementById('content');
	var openclose = document.getElementById('openclose');
	if(deleteTooltip){
		document.getElementById('filterExplanationTooltip').remove();
		deleteTooltip = false;
	}
	if(filters.style.width == "var(--filter-min-width)" || filters.style.width == ""){
		filterTitle.style.maxWidth = "150px";
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
		filterTitle.style.maxWidth = "0px";
		filters.style.width = "var(--filter-min-width)";
		filter_bar.style.width = "0%";
		content.style.width = "calc(100% - 2*var(--filter-min-width))";
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
		map.style.width = "50%";
		side_stats.style.width = "calc(50% - 2px)";
		},10);
	}else{
		statsOn = false;
		tooltipContainer.style.opacity = 0;
		map.style.width = "100%";
		side_stats.style.width = "0%";
		setTimeout(function(){
			side_stats.style.display = "none";
		},300);
	}
}

var shownQuestion = 0;
function nextQuestion(){
	var questions = document.getElementById('questions').getElementsByTagName('section');
	var nextQuestion = shownQuestion+1;
	if(nextQuestion >= questions.length) nextQuestion = 0;
	if(questions[nextQuestion].style.left != "200%"){
		questions[nextQuestion].style.transition = "0s"
		questions[nextQuestion].style.left = "200%";
	}
	questions[shownQuestion].style.left = "-100%";
	setTimeout(function(){
		questions[nextQuestion].style.transition =".5s all ease-out";
		questions[nextQuestion].style.left = "50%";
	},10)
	shownQuestion = nextQuestion;
}
function prevQuestion(){
	var questions = document.getElementById('questions').getElementsByTagName('section');
	var nextQuestion = shownQuestion-1;
	if(nextQuestion < 0) nextQuestion = questions.length-1;
	if(questions[nextQuestion].style.left != "-100%"){
		questions[nextQuestion].style.transition = "0s"
		questions[nextQuestion].style.left = "-100%";
	}
	questions[shownQuestion].style.left = "200%";
	setTimeout(function(){
		questions[nextQuestion].style.transition =".5s all ease-out";
		questions[nextQuestion].style.left = "50%";
	},10)
	shownQuestion = nextQuestion;
}

function underline(thisThing, howMuch){
	var lines = thisThing.getElementsByTagName('line');
	lines[0].style.width=howMuch;
}

var answeredQuestions = 0;
var previousValue = "meh";
function checkValue(thisThing){
	previousValue = thisThing.value;
}

function changeLeftRight(thing, howMuchLeft, howMuchRight){
	document.getElementById(thing).style.left=howMuchLeft;
	document.getElementById(thing).style.right=howMuchRight;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function changeHousePriceViz(value){
	if(document.getElementById("house_priceSwitch").checked){
		if(houseViz === "heatmap"){
			removeHeatMap()
			houseProcesSwitch = false;//temp
			drawScatter("house_price");
		} else {
			removeScatter()
			houseProcesSwitch = false;//temp
			//check here if choropleth map being used
			drawHeatMap("house_price")
		}
	}
	houseViz = value;
}


function drawHouseViz(value){

	if(houseViz === "heatmap"){
		drawHeatMap(value);
	} else {
		drawScatter(value);
	}
}

function showFilter(filterID){
	filter = document.getElementById(filterID);
	if(filter.style.maxHeight == "" || filter.style.maxHeight=="0px") filter.style.maxHeight = "40px";
	else filter.style.maxHeight = "0px";
}