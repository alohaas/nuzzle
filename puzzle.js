function Puzzle(n) {

  // new methods
  // this.n = n || 4;
  // this.r = new Array(this.n*this.n);
  // this.gridOrigin = this.increment(this.r);

  // old methods
  this.gridOrigin = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
  this.gridGame = this.shuffle(this.gridOrigin);
  // this.test = this.newMatrix(this.n, this.gridGame);
  this.gridMoves = [
    [2, 5],      [1, 3, 6],      [2, 4, 7],       [3, 8],
    [1, 6, 9],   [2, 5, 7, 10],  [3, 6, 8, 11],   [4, 7, 12],
    [5, 10, 13], [6, 9, 11, 14], [7, 10, 12, 15], [8, 11, 16],
    [9, 14],     [10, 13, 15],   [11, 14, 16],    [12, 15]
  ];

  this.validMoves = this.getValidMoves();
  this.position = [0, 0];
  this.validClick = false;
  this.solved = false;
  this.count = 0;
  this.message = "You Won in " + this.count + " moves!";

  this.canvas = document.getElementById("canvas");
  this.context = canvas.getContext("2d");
  this.styles = {};

  this.restart();
  this.canvas.addEventListener("mousedown", this.updatePuzzle.bind(this), true);


};

Puzzle.prototype = {
  // method to renadomize array
  // increment: function(arr) {
  //   for (var i = 0; i < arr.length; i++) {
  //     arr[i] = i+1;
  //   }
  //   return arr;
  // },
  //
  // newMatrix: function(dim, arr) {
  //   var a = new Array(dim);
  //   for (var i = 0; i < a.length; i++) {
  //     for (var j = 0; j < a.length; j++) {
  //       a[i][j] = arr[dim*i + j];
  //     }
  //   }
  //   return a;
  // },

  drawCanvas: function() {
    var canvas = this.canvas;
    canvas.width = this.styles.canvasDim;
    canvas.height = this.styles.canvasDim;
  },

  setStyles: function() {
    this.styles.canvasDim = 400;
    this.styles.tileDim = this.styles.canvasDim/4;
    this.styles.stroke = this.styles.tileDim/10;
    this.styles.light = "White";
    this.styles.med = "DarkTurquoise";
    this.styles.dark = "DarkSlateGray";
    this.styles.fontSize = this.styles.tileDim/5;
    this.styles.fontFamily = "sans-serif";
    this.styles.font = this.styles.fontSize + "px " + this.styles.fontFamily;
    this.styles.fontLarge = this.styles.fontSize*2 + "px " + this.styles.fontFamily;
  },
  // Fisher–Yates shuffle: http://sedition.com/perl/javascript-fy.html
  shuffle: function(arr) {
    var currentIndex = arr.length, temporaryValue, randomIndex ;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = temporaryValue;
    }
    var newArr = arr;
    return newArr;
  },

  drawTile: function(x, y, i) {
    var styles = this.styles,
        context = this.context,
        s = styles.tileDim;

    if (i === 16) {
      context.fillStyle = this.solved ? styles.med : styles.dark;
      context.fillRect(x, y, s, s);
      context.fillStyle = this.solved ? styles.light : styles.med;
      context.font = styles.font;
      if (this.solved) {
        context.fillText("solved in", x+10, y+30);
      }
      context.fillText( this.count === 1 ? "move" : "moves", x+20, y+80);
      if (this.count > 9) {
        context.fillText(this.count, x+38, y+55);
      } else {
        context.fillText(this.count, x+45, y+55);
      }
    } else {
      context.fillStyle = styles.light;
      context.fillRect(x, y, s, s);

      context.strokeStyle = this.solved ? styles.med : styles.dark;
      context.lineWidth = styles.stroke;
      context.strokeRect(x, y, s, s);

      context.strokeStyle = styles.med;
      context.lineWidth = styles.stroke/4;
      context.strokeRect(x+styles.stroke, y+styles.stroke, s-styles.stroke*2, s-styles.stroke*2);

      context.fillStyle = styles.med;
      context.font = styles.fontLarge;
      if (i > 9) {
        context.fillText(i, x+28, y+60);
      } else {
        context.fillText(i, x+40, y+60);
      }
    }
  },

  drawTiles: function() {
    var arr = this.gridGame;
    var y = 0;
    var x = 0;
    for (var i = 0; i < arr.length; i++) {
      var tileNum = arr[i];
      y = i > 0 && i%4 === 0 ? y + 100 : y;
      x = i%4 === 0 ? x*0 : x+100;
      this.drawTile(x, y, tileNum);
    }
  },

  getValidMoves: function() {
    var i = this.gridGame.indexOf(16);
    return this.gridMoves[i];
  },

  getRelativePosition: function(e) {
    if (e.x != undefined && e.y != undefined) {
      x = e.x;
      y = e.y;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= this.canvas.offsetLeft;
    y -= this.canvas.offsetTop;

    this.position[0] = Math.floor(x/100)+1;
    this.position[1] = Math.floor(y/100);
    return this.position;
  },

  checkClick: function() {
    var x = this.position[0];
    var y = this.position[1];
    for (var i = 0; i < this.validMoves.length; i++) {
      if (y*4 + x == this.validMoves[i]) {
        return true;
      }
    }
    return false;
  },

  updateArray: function() {
    var t = this.position[1]*4 + this.position[0]-1;
    var m = this.gridGame[t];
    this.gridGame[this.gridGame.indexOf(16)] = m;
    this.gridGame[t] = 16;
    return this.gridGame;
  },

  updatePuzzle: function(event) {
    this.getRelativePosition(event);
    if (this.checkClick() === true) {
      this.gridGame = this.updateArray();
      this.validMoves = this.getValidMoves();
      this.count++;
      this.solved = this.checkSolution(this.gridGame);
      this.drawTiles();
    }
    return null;
  },

  checkSolution: function(arr) {
    for (var i = 1; i < arr.length; i++) {
      var consecutive = this.compareNumbers(arr[i], arr[i-1]);
      if (consecutive !== true) {
        return false;
      }
    }
    return this.solved = true;
  },

  compareNumbers: function(a, b) {
    return a === b + 1 || a === b - 1 ? true : false;
  },

  restart: function() {
    this.setStyles();
    this.drawCanvas();
    this.drawTiles();
  }

};


function puzzle(){
  var puzzle;

  self.init = function(){
    puzzle = new Puzzle();
  }

  self.init();
};

puzzle();
