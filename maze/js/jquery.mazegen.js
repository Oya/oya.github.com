var canvas;
var context;
var theMaze = null;
var score = 0;
var joystick, keysPressed;



$('#generate').on('click', function() {
	makeMaze();
});
$('#next').on('click', function() {
	var col = parseInt($('#columns').val())+1;
	$('#columns').val(col);
	$('#rows').val(parseInt($('#rows').val())+1);
	
	var gridsize = parseInt(320/col);
	if(gridsize < 12)
		gridsize = 12;
		
	$('#gridsize').val(gridsize);
	
	makeMaze();

	$('#next').hide();
});
$('#zoom').on('click', function() {
	$('#gridsize').val(parseInt($('#gridsize').val())+10);
	if (theMaze !== null)
	{
		theMaze.gridsize = parseInt($('#gridsize').val())+10;
		theMaze.draw();
	}
	else
	{
		makeMaze();
	}
});
$('#solve').on('click', function() {
	solveMaze();
});
$('#hint').on('click', function() {
	hintsSolveMaze();
});

/*
$('#maze').on('mousedown', function(event) {
	offsetX = canvas.offsetLeft;
	offsetY = canvas.offsetTop;
	mouseX = event.pageX - offsetX;
	mouseY = event.pageY - offsetY;
	var theCell = handleClick(mouseX, mouseY, event.which);
	theMaze.clearSolution();
	theMaze.redrawCell(theCell);
});
*/
$('#unsolve').on('click', function() {
	theMaze.clearSolution();
	theMaze.draw();
});
$('#save').on('click', function() {
	document.location.href = canvas.toDataURL();	
});
function makeMaze() {
	var rows = $('#rows').val();
	var columns = $('#columns').val();
	var gridsize = $('#gridsize').val();
	var mazeStyle = $('input[name=mazeStyle]:checked').val();

	var marginLeft = 160-(columns*gridsize/2);
	var marginTop = 160-(rows*gridsize/2);
	$('#maze').css({ 'margin-top': marginTop + 'px' });
	$('#maze').css({ 'margin-left': marginLeft +'px' });

	/*
	var startColumn = $('#startX').val();
	var startRow = $('#startY').val();
	var endColumn = $('#endX').val();
	var endRow = $('#endY').val();
	*/
	var startColumn = columns/2;
	var startRow = rows/2;
	var endColumn = columns - 1;
	var endRow = rows - 1;
	var wallR = $('#wallR').val();
	var wallG = $('#wallG').val();
	var wallB = $('#wallB').val();
	var backgroundR = $('#backgroundR').val();
	var backgroundG = $('#backgroundG').val();
	var backgroundB = $('#backgroundB').val();
	var solutionR = $('#solutionR').val();
	var solutionG = $('#solutionG').val();
	var solutionB = $('#solutionB').val();
	var wallColor = "rgb(" + wallR + "," + wallG + "," + wallB + ")";
	var backgroundColor = "rgb(" + backgroundR + "," + backgroundG + "," + backgroundB + ")";
	var solutionColor = "rgb(" + solutionR + "," + solutionG + "," + solutionB + ")";
	theMaze = new maze(rows, columns, gridsize, mazeStyle, startColumn, startRow, endColumn, endRow, wallColor, backgroundColor, solutionColor);
	theMaze.generate();
	theMaze.draw();
}
function solveMaze() {
	if (theMaze !== null) {
		theMaze.solve();
		theMaze.draw();
	} else {
		alert('Generate a maze first!');	
	}
}
function hintsSolveMaze() {
	if (theMaze !== null) {
		theMaze.solve();
		theMaze.draw();
		window.setTimeout(function() {
			theMaze.clearSolution();
			theMaze.draw();
		},500);
	} else {
		alert('Generate a maze first!');	
	}
}


/*
function handleClick(mouseX, mouseY, mouseButton) {
	var gridX = Math.floor(mouseX/theMaze.gridsize);
	var gridY = Math.floor(mouseY/theMaze.gridsize);
	if (mouseButton == 1) {
		theMaze.grid[theMaze.startColumn][theMaze.startRow].isStart = false;
		var oldStartColumn = theMaze.startColumn;
		var oldStartRow = theMaze.startRow;
		theMaze.startColumn = gridX;
		theMaze.startRow = gridY;
		theMaze.redrawCell(theMaze.grid[oldStartColumn][oldStartRow]);
		theMaze.grid[gridX][gridY].isStart = true;
		theMaze.grid[gridX][gridY].isEnd = false;
	} else if (mouseButton == 3) {
		theMaze.grid[theMaze.endColumn][theMaze.endRow].isEnd = false;
		var oldEndColumn = theMaze.endColumn;
		var oldEndRow = theMaze.endRow;
		theMaze.endColumn = gridX;
		theMaze.endRow = gridY;
		theMaze.redrawCell(theMaze.grid[oldEndColumn][oldEndRow]);
		theMaze.grid[gridX][gridY].isStart = false;
		theMaze.grid[gridX][gridY].isEnd = true;
	}
	return theMaze.grid[gridX][gridY];
}
*/
var running = false;
function handleKeyDown(event) {

if(running == false && theMaze !=null)
{
	running = true;

	var currentPlayerGrid = theMaze.grid[theMaze.playerX][theMaze.playerY];
	var isMoving = false;
	var changeX = 0;
	var changeY = 0;

	switch(event.keyCode) {
		case 37: {
			//left key
			if (currentPlayerGrid.leftWall == false) {
				changeX = -1;
				isMoving = true;
			}
			break;
		}
		case 38: {
			//up key
			if (currentPlayerGrid.topWall == false) {
				changeY = -1;	
				isMoving = true;
			}
			break;
		}
		case 39: {
			//right key
			if (currentPlayerGrid.rightWall == false) {
				changeX = 1;
				isMoving = true;
			}
			break;
		}
		case 40: {
			//down key
			if (currentPlayerGrid.bottomWall == false) {
				changeY = 1;
				isMoving = true
			}
			break;
		}
		default: {
			//not a key we care about
			break;
		}
	}
	if (isMoving == true) {
		var theLandingCell = theMaze.grid[theMaze.playerX + changeX][theMaze.playerY + changeY];
		if(theLandingCell.havePill == true)
		{
			theLandingCell.havePill = false;
			theMaze.pillCollected++;
			score++;

			$('score').text(score);
		}
		

		// Move the maze
		if(changeX != 0){
			var marginLeft = (theMaze.gridsize * changeX * -1) + parseInt($('#maze').css("marginLeft").replace('px', ''));
			$('#maze').animate({ 'margin-left': marginLeft + 'px' }, 100);
		}
		if(changeY != 0){
			var marginTop = (theMaze.gridsize * changeY * -1) + parseInt($('#maze').css("marginTop").replace('px', ''));
			$('#maze').animate({ 'margin-top': marginTop + 'px' }, 100);
		}


		theMaze.redrawCell(theMaze.grid[theMaze.playerX][theMaze.playerY]);
		theMaze.playerX += changeX;
		theMaze.playerY += changeY;
		theMaze.drawPlayer();

		// The End
		if(theLandingCell.isEnd == true)
		{
			$('#next').show();
		}
	}
	setTimeout(function(){run()},500);
}

};
function run(){
	running=false;
}

function handleKeyUp(event) {

};


function handleKeypress(event) {
	var currentPlayerGrid = theMaze.grid[theMaze.playerX][theMaze.playerY];
	var isMoving = false;
	var changeX = 0;
	var changeY = 0;
	if (event.keyCode == 32 || event.keyCode == 38 || event.keyCode == 40) {
		event.preventDefault();	
	}
	switch(event.keyCode) {
		case 37: {
			//left key
			if (currentPlayerGrid.leftWall == false) {
				changeX = -1;
				isMoving = true;
			}
			break;
		}
		case 38: {
			//up key
			if (currentPlayerGrid.topWall == false) {
				changeY = -1;	
				isMoving = true;
			}
			break;
		}
		case 39: {
			//right key
			if (currentPlayerGrid.rightWall == false) {
				changeX = 1;
				isMoving = true;
			}
			break;
		}
		case 40: {
			//down key
			if (currentPlayerGrid.bottomWall == false) {
				changeY = 1;
				isMoving = true
			}
			break;
		}
		default: {
			//not a key we care about
			break;
		}
	}
	if (isMoving == true) {
		var theLandingCell = theMaze.grid[theMaze.playerX + changeX][theMaze.playerY + changeY];
		if(theLandingCell.havePill == true)
		{
			theLandingCell.havePill = false;
			theMaze.pillCollected++;
			score++;
			$('score').text(score);
		}
		

		// Move the maze
		if(changeX != 0){
			var marginLeft = (theMaze.gridsize * changeX * -1) + parseInt($('#maze').css("marginLeft").replace('px', ''));
			$('#maze').animate({ 'margin-left': marginLeft + 'px' }, 100);
		}
		if(changeY != 0){
			var marginTop = (theMaze.gridsize * changeY * -1) + parseInt($('#maze').css("marginTop").replace('px', ''));
			$('#maze').animate({ 'margin-top': marginTop + 'px' }, 100);
		}


		theMaze.redrawCell(theMaze.grid[theMaze.playerX][theMaze.playerY]);
		theMaze.playerX += changeX;
		theMaze.playerY += changeY;
		theMaze.drawPlayer();

		// The End
		if(theLandingCell.isEnd == true)
		{
			$('#next').show();
		}
	}
}
function maze(rows, columns, gridsize, mazeStyle, startColumn, startRow, endColumn, endRow, wallColor, backgroundColor, solutionColor) {
	this.rows = rows;
	this.columns = columns;
	this.gridsize = gridsize;
	this.mazeStyle = mazeStyle;
	this.sizex = gridsize * rows;
	this.sizey = gridsize * columns;
	this.halfgridsize = this.gridsize / 2;
	this.grid = new Array(this.columns);
	this.history = new Array();
	this.startColumn = parseInt(startColumn);
	this.startRow = parseInt(startRow);
	this.playerX = this.startColumn;
	this.playerY = this.startRow;
	this.endColumn = parseInt(endColumn);
	this.endRow = parseInt(endRow);
	this.wallColor = wallColor;
	this.backgroundColor = backgroundColor;
	this.solutionColor = solutionColor;
	this.lineWidth = 2;
	this.genStartColumn = Math.floor(Math.random() * (this.columns- 1));
	this.genStartRow = Math.floor(Math.random() * (this.rows- 1));
	this.cellCount = this.columns * this.rows;
	this.generatedCellCount = 0;
	this.pillCollected = 0;
	for (i = 0; i < columns; i++) {
		this.grid[i] = new Array(rows);		
	}
	for (j = 0; j < this.columns; j++) {
		for (k = 0; k < this.rows; k++) {
			var isStart = false;
			var isEnd = false;
			var partOfMaze = false;
			var isGenStart = false;
			if (j == this.startColumn && k == this.startRow) {
				isStart = true;
			}
			if (j == this.genStartColumn && k == this.genStartRow) {
				partOfMaze = true;
				isGenStart = true;
			}
			if (j == this.endColumn && k == this.endRow) {
				isEnd = true;		
			}
			this.grid[j][k] = new cell(j, k, partOfMaze, isStart, isEnd, isGenStart);
		}
	}
}
maze.prototype.generate = function() {
	var theMaze = this;
	var currentCell = this.grid[this.genStartColumn][this.genStartRow];
	var nextCell;
	var leftCellPartOfMaze = false;
	var topCellPartOfMaze = false;
	var rightCellPartOfMaze = false;
	var bottomCellPartOfMaze = false;
	var currentX = this.genStartColumn;
	var currentY = this.genStartRow;
	var changeX = 0;
	var changeY = 0;
	var previousChangeX = 0;
	var previousChangeY = 0;
	var leftCell;
	var topCell;
	var rightCell;
	var bottomCell;
	var direction;
	var leftChoices;
	var rightChoices;
	var downChoices;
	var upChoices;
	var biasDirection;
	var choices;
	while (this.generatedCellCount < this.cellCount - 1) {
		doGeneration();	
	}
	function chooseCell() {
		changeX = 0;
		changeY = 0;
		choices = [];
		biasDirection = '';
		if (previousChangeX == -1) {
			biasDirection = 'left';	
		} else if (previousChangeX == 1) {
			biasDirection = 'right';
		} else if (previousChangeY == -1) {
			biasDirection = 'up';
		} else if (previousChangeY == 1) {
			biasDirection = 'down';
		}
		direction = '';
		leftChoices = [0, 0, 0, 0, 0];
		upChoices = [1, 1, 1, 1, 1];
		rightChoices = [2, 2, 2, 2, 2];
		downChoices = [3, 3, 3, 3, 3];
		switch (theMaze.mazeStyle) {

		case "curvy": {
			if (biasDirection == 'left') {
				leftChoices = [0, 0];				
			} else if (biasDirection == 'right') {
				rightChoices = [2, 2];		
			} else if (biasDirection == 'down') {
				downChoices = [3, 3];	
			} else if (biasDirection == 'up') {
				upChoices = [1, 1]		
			}
			break;
		}
		case "straight": {
			leftChoices = [0];
			upChoices = [1];
			rightChoices = [2];
			downChoices = [3];		
			if (biasDirection == 'left') {
				leftChoices = [0, 0, 0, 0, 0, 0, 0, 0];				
			} else if (biasDirection == 'right') {
				rightChoices = [2, 2, 2, 2, 2, 2, 2, 2];		
			} else if (biasDirection == 'down') {
				downChoices = [3, 3, 3, 3, 3, 3, 3, 3];	
			} else if (biasDirection == 'up') {
				upChoices = [1, 1, 1, 1, 1, 1, 1, 1]		
			}
			break;
		}
		case "normal": {
			leftChoices = [0];
			upChoices = [1];
			rightChoices = [2];
			downChoices = [3];
			break;
		}
		}
		choices = leftChoices.concat(rightChoices.concat(downChoices.concat(upChoices)));
		var rand = Math.floor(Math.random() * choices.length);
		var weightedRand = choices[rand];
		switch(weightedRand) {
		case 0: {
			nextCell = leftCell;
			changeX = -1;
			direction = 'left';
			break;				
		}
		case 1: {
			nextCell = topCell;
			changeY = -1;
			direction = 'up';
			break;	
		}
		case 2: {
			nextCell = rightCell;
			changeX = 1;
			direction = 'right';
			break;
		}
		case 3: {
			nextCell = bottomCell;
			changeY = 1;
			direction = 'down';
			break;	
		}
		default: {
			nextCell = null;
			changeY = 0;
			changeX = 0;
			break;		
		}
		}

		if (nextCell == null || nextCell.partOfMaze == true) {
			chooseCell();	
		} else {
			currentX += changeX;
			currentY += changeY;
			previousChangeX = changeX;
			previousChangeY = changeY;
			theMaze.history.push(direction);
		}
	}
	function addToMaze() {
		nextCell.partOfMaze = true;
		if (changeX == -1) {
			currentCell.leftWall = false;
			nextCell.rightWall = false;
		}
		if (changeY == -1) {
			currentCell.topWall = false;
			nextCell.bottomWall = false;
		}
		if (changeX == 1) {
			currentCell.rightWall = false;
			nextCell.leftWall = false;
		}
		if (changeY == 1) {
			currentCell.bottomWall = false;
			nextCell.topWall = false;
		}
	}
	function doGeneration() {
		//stop generation if the maze is full
		if (theMaze.generatedCellCount == theMaze.cellCount - 1) {
			return;		
		}
		//do actual generation
		changeX = 0;
		changeY = 0;
		if (currentX > 0) {
			leftCell = theMaze.grid[currentX - 1][currentY];
			leftCellPartOfMaze = leftCell.partOfMaze;
		} else {
			leftCell = null;
			leftCellPartOfMaze = true;
		}	
		if (currentY > 0) {
			topCell = theMaze.grid[currentX][currentY - 1];
			topCellPartOfMaze = topCell.partOfMaze;
			
		} else {
			topCell = null;	
			topCellPartOfMaze = true;
		}
		if (currentX < (theMaze.columns - 1)) {
			rightCell = theMaze.grid[currentX + 1][currentY];
			rightCellPartOfMaze = rightCell.partOfMaze;
		} else {
			rightCell = null;
			rightCellPartOfMaze = true;
		}
		if (currentY < (theMaze.rows - 1)) {
			bottomCell = theMaze.grid[currentX][currentY + 1];
			bottomCellPartOfMaze = bottomCell.partOfMaze;
		} else {
			bottomCell = null;
			bottomCellPartOfMaze = true;
		}
		if (leftCellPartOfMaze == true && topCellPartOfMaze == true && rightCellPartOfMaze == true && bottomCellPartOfMaze == true) {
			//go back and check previous cell for generation
			var lastDirection = theMaze.history.pop();
			changeX = 0;
			changeY = 0;
			switch (lastDirection) {
			case 'left': {
				changeX = 1;
				break;			
			}
			case 'up': {
				changeY = 1;
				break;				
			}			
			case 'right': {
				changeX = -1;
				break;				
			}
			case 'down': {
				changeY = -1;
				break;
			}
			}
			nextCell = theMaze.grid[currentX + changeX][currentY + changeY];
			currentX += changeX;
			currentY += changeY;
			currentCell = nextCell;
				doGeneration();

		} else {
			chooseCell();
			addToMaze();	
			currentCell = nextCell;
			theMaze.generatedCellCount += 1;
		}
	}
}
maze.prototype.draw = function() {
	var totalWidth = this.columns * this.gridsize;
	var totalHeight = this.rows * this.gridsize;
	$('#maze').attr("width", totalWidth);
	$('#maze').attr("height", totalHeight);
	context.lineWidth = this.lineWidth;
	context.clearRect(0, 0, totalWidth, totalHeight);
	context.strokeStyle = this.wallColor;
	for (j = 0; j < this.columns; j++) {
		for (k = 0; k < this.rows; k++) {
			var drawX = (j * this.gridsize);
			var drawY = (k * this.gridsize);
			var pastX = parseInt(drawX) + parseInt(this.gridsize);
			var pastY = parseInt(drawY) + parseInt(this.gridsize);
			var theCell = this.grid[j][k];
			
			if (theCell.partOfSolution == true) {
				context.fillStyle = this.solutionColor;
			} else {
				context.fillStyle = this.backgroundColor;		
			}
			if (theCell.isStart == true) {
				context.fillStyle = "#00FF00";	
				theCell.havePill = false;	
			}
			if (theCell.isEnd == true) {
				context.fillStyle = "#FF0000";		
			}
			

			context.fillRect(drawX, drawY, this.gridsize, this.gridsize);	
			context.beginPath();
			if (theCell.leftWall == true) {
				//context.strokeRect(drawX, drawY, 1, this.gridsize);
				context.moveTo(drawX, drawY);
				context.lineTo(drawX, pastY);
			}
			if (theCell.topWall == true) {
				//context.strokeRect(drawX, drawY, this.gridsize, 1);
				context.moveTo(drawX, drawY);
				context.lineTo(pastX, drawY);
			}
			if (theCell.rightWall == true) {
				//context.strokeRect((drawX + this.gridsize), drawY, 1, this.gridsize);
				context.moveTo(pastX, drawY);
				context.lineTo(pastX, pastY);
			}
			if (theCell.bottomWall == true) {
				//context.strokeRect(drawX, (drawY + this.gridsize), this.gridsize, 1);	
				context.moveTo(drawX, pastY);
				context.lineTo(pastX, pastY);
			}
			context.closePath();

			context.stroke();
			
			if(theCell.havePill == true)
			{
				context.fillStyle = "#666666";
				context.beginPath();
				context.arc(drawX + (this.gridsize/2), drawY+ (this.gridsize/2), (this.gridsize/10), 0, Math.PI*2, true);
				context.closePath();
				context.fill();
			}
			
		}
	}
	this.drawPlayer();
}
maze.prototype.redrawCell = function(theCell) {
	//console.log(theCell);
	var drawX = (theCell.x * this.gridsize);
	var drawY = (theCell.y * this.gridsize);
	var pastX = parseInt(drawX) + parseInt(this.gridsize);
	var pastY = parseInt(drawY) + parseInt(this.gridsize);
	if (theCell.partOfSolution == true) {
		context.fillStyle = "#FFCCCC";
	} else {
		context.fillStyle = this.backgroundColor;		
		}
	if (theCell.isStart == true) {
		context.fillStyle = "#00FF00";		
	}
	if (theCell.isEnd == true) {
		context.fillStyle = "#FF0000";		
	}
	if (theCell.isGenStart == true) {
		//context.fillStyle = "#0000FF";		
	}
	context.fillRect(drawX, drawY, this.gridsize, this.gridsize);	
	context.beginPath();
	if (theCell.leftWall == true) {
		//context.strokeRect(drawX, drawY, 1, this.gridsize);
		context.moveTo(drawX, drawY);
		context.lineTo(drawX, pastY);
	}
	if (theCell.topWall == true) {
		//context.strokeRect(drawX, drawY, this.gridsize, 1);
		context.moveTo(drawX, drawY);
		context.lineTo(pastX, drawY);
	}
	if (theCell.rightWall == true) {
		//context.strokeRect((drawX + this.gridsize), drawY, 1, this.gridsize);
		context.moveTo(pastX, drawY);
		context.lineTo(pastX, pastY);
	}
	if (theCell.bottomWall == true) {
		//context.strokeRect(drawX, (drawY + this.gridsize), this.gridsize, 1);	
		context.moveTo(drawX, pastY);
		context.lineTo(pastX, pastY);
	}
	context.closePath();
	context.stroke();
	
	if(theCell.havePill == true)
			{
				context.fillStyle = "#CCCCCC";
				context.beginPath();
				context.arc(drawX + (this.gridsize/2), drawY+ (this.gridsize/2), (this.gridsize/8), 0, Math.PI*2, true);
				context.closePath();
				context.fill();
			}
}
maze.prototype.drawPlayer = function() {
	var drawX = this.playerX * this.gridsize + (this.gridsize/2);
	var drawY = this.playerY * this.gridsize + (this.gridsize/2);
	context.fillStyle = "#000000";
	context.beginPath();
	context.arc(drawX, drawY, (this.gridsize/4), 0, Math.PI*2, true);
	context.closePath();
	context.fill();
}
maze.prototype.clearSolution = function() {
	theMaze = this;		
	for (j = 0; j < this.columns; j++) {
		for (k = 0; k < this.rows; k++) {
			theMaze.grid[j][k].partOfSolution = false;
			theMaze.grid[j][k].visited = false;
		}
	}
}
maze.prototype.solve = function() {
	theMaze = this;
	theMaze.clearSolution();
	this.history = new Array();
	var currentCell = this.grid[this.playerX][this.playerY];//this.grid[this.startColumn][this.startRow];
	var endCell = this.grid[this.endColumn][this.endRow];
	var currentX = this.playerX;//this.startColumn;
	var currentY = this.playerY;//this.startRow;
	var changeX = 0;
	var changeY = 0;
	var leftCell = null;
	var topCell = null;
	var rightCell = null;
	var bottomCell = null;
	var leftCellVisited = null;
	var topCellVisited = null;
	var rightCellVisited = null;
	var bottomCellVisited = null;
	var i = 0;
	while (currentCell.isEnd !== true) {
		doSolve();	
	}
	markSolutionCells();
	function doSolve() {
		
		function getSurroundingCells() {
			if (currentX > 0) {
				leftCell = theMaze.grid[currentX - 1][currentY];
				leftCellVisited = leftCell.visited;
			} else {
				leftCell = null;
				leftCellVisited = true;
			}	
			if (currentY > 0) {
				topCell = theMaze.grid[currentX][currentY - 1];
				topCellVisited = topCell.visited;	
			} else {
				topCell = null;	
				topCellVisited = true;
			}
			if (currentX < (theMaze.columns - 1)) {
				rightCell = theMaze.grid[currentX + 1][currentY];
				rightCellVisited = rightCell.visited;
			} else {
				rightCell = null;
				rightCellVisited = true;
			}
			if (currentY < (theMaze.rows - 1)) {
				bottomCell = theMaze.grid[currentX][currentY + 1];
				bottomCellVisited = bottomCell.visited;
			} else {
				bottomCell = null;
				bottomCellVisited = true;
			}	
		}
		function chooseDirection() {
			var move = false;
			var direction = '';
			changeX = 0;
			changeY = 0;
			var rand = Math.floor(Math.random() * 4);	
			switch(rand) {
			case 0: {
				if (currentCell.leftWall == false && leftCellVisited == false) {
					changeX = -1;
					direction = 'left';
					move = true;
				}
				break;				
			}
			case 1: {
				if (currentCell.topWall == false && topCellVisited == false) {
					changeY = -1;
					direction = 'up';
					move = true;
				}
				break;	
			}
			case 2: {
				if (currentCell.rightWall == false && rightCellVisited == false) {
					changeX = 1;
					direction = 'right';
					move = true;
				}
				break;
			}
			case 3: {
				if (currentCell.bottomWall == false && bottomCellVisited == false) {
					changeY = 1;
					direction = 'down';
					move = true;
				}
				break;	
			}
			default: {
				move = false;
				changeY = 0;
				changeX = 0;
				break;		
			}
			}
			if (move == true) {
				theMaze.history.push(direction);
				
			} else {
				chooseDirection();
			}
		}
		
		//do actual solve routine
		currentCell.visited = true;
		getSurroundingCells();
		if (currentCell.isEnd == true) {
			markSolutionCells();
		} else {
			if ((currentCell.leftWall == false && leftCellVisited == false) || (currentCell.topWall == false && topCellVisited == false) || (currentCell.rightWall == false && rightCellVisited == false) || (currentCell.bottomWall == false && bottomCellVisited == false)) {
				chooseDirection();
			} else {
				lastDirection = theMaze.history.pop();
				changeX = 0;
				changeY = 0;
				switch (lastDirection) {
				case 'left': {
					changeX = 1;
					break;			
				}
				case 'up': {
					changeY = 1;
					break;				
				}			
				case 'right': {
					changeX = -1;
					break;				
				}
				case 'down': {
					changeY = -1;
					break;
				}
				}
			}
			currentX += changeX;
			currentY += changeY;
			currentCell = theMaze.grid[currentX][currentY];
			//doSolve();
		}
	}
	function markSolutionCells() {
		currentCell = theMaze.grid[theMaze.playerX][theMaze.playerY];//theMaze.grid[theMaze.startColumn][theMaze.startRow];
		currentX = theMaze.playerX;//theMaze.startColumn;
		currentY = theMaze.playerY;//theMaze.startRow;
		for (m = 0; m < theMaze.history.length; m++) {
			var solutionDirection = theMaze.history[m];
			currentCell.partOfSolution = true;
			changeX = 0;
			changeY = 0;
			switch (solutionDirection) {
			case 'left': {
				changeX = -1;
				break;			
			}
			case 'up': {
				changeY = -1;
				break;				
			}			
			case 'right': {
				changeX = 1;
				break;				
			}
			case 'down': {
				changeY = 1;
				break;
			}
			}
			currentX += changeX;
			currentY += changeY;
			currentCell = theMaze.grid[currentX][currentY];
		}
	}
}
function cell(column, row, partOfMaze, isStart, isEnd, isGenStart) {
	this.x = column;
	this.y = row;
	this.leftWall = true;
	this.topWall = true;
	this.rightWall = true;
	this.bottomWall = true;
	this.partOfMaze = partOfMaze;
	this.isStart = isStart;
	this.isEnd = isEnd;
	this.partOfSolution = false;
	this.visited = false;
	this.isGenStart = isGenStart;
	this.isPlayer = false;
	this.havePill = true;
}







$(document).ready(function() {
	canvas = document.getElementById("maze");//$('#maze');
	context = canvas.getContext('2d');	
	context.font = "bold 20px sans-serif";
	$(document).keydown(handleKeypress);


	if (SQUARIFIC.framework && SQUARIFIC.framework.TouchControl) {
		joystick = new SQUARIFIC.framework.TouchControl(document.getElementById("joystick"), {
			pretendArrowKeys: true,
			mindistance: 50,
			maxdistance: 50,
			middleLeft: 15,
			middleTop: 15
		});
		//joystick.on("joystickMove", handleTouch);
		joystick.on("pretendKeydown", handleKeyDown);
		joystick.on("pretendKeyup", handleKeyUp);
	} else {
		console.log("Framework or TouchControl not available");
	}

	makeMaze();
});