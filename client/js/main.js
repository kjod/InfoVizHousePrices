var totalQuestions = document.getElementById('questions').getElementsByTagName('section').length;
var answeredQuestions = 0;
var previousValue = "meh";

function openCloseFilters(){
	var filters = document.getElementById('filters');
	var filter_bar = document.getElementById('filter_bar');
	var content = document.getElementById('content');
	var openclose = document.getElementById('openclose');
	if(filters.style.width == "var(--filter-min-width)" || filters.style.width == ""){
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

setTimeout(function(){
	var side_stats = document.getElementById('side_stats');
	side_stats.style.width = "0%";
	setTimeout(function(){
		side_stats.style.opacity = "1";
		side_stats.style.position = "static";
		side_stats.style.display = "none";
	},300);
},500);



function underline(thisThing, howMuch){
	var lines = thisThing.getElementsByTagName('line');
	lines[0].style.width=howMuch;
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

function checkValue(thisShit){
	previousValue = thisShit.value;
}