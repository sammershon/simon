"use strict";
//The game object
//contains info on game state and is a place to store
var game = {
    boardSeq: [],
    userSeq: [],
    level: 0,
    highScore: 0,

    //have document.ready activate this on click
    //start a new game @ level 1, score 0, and empty sequence arrays
    newGame: function() {
        this.boardSeq = [];
        this.userSeq = [];
        this.level = 0;
        this.levelUp();
    },

    //tell game what to do based on the current level
    levelUp: function() {
        //advance level var/display
        this.userSeq = [];
        this.level+=1;
        $("#level").text(this.level);
        this.boardSeq.push(Math.floor((Math.random() * 4)));
        this.userSeq = this.boardSeq.slice(0);
        this.playSequence(this.boardSeq);
    },

    //play the sequence generated by createBoardSequence
    playSequence: function(boardSeq) {
        var i = 0;
        var that = this;
        var interval = setInterval(function() {
            that.playSound(boardSeq[i]);
            that.lightTile(boardSeq[i]);
            i++;
            if (i >= boardSeq.length) {
                clearInterval(interval);
                that.activateBoard();
            }
        }, 600);
    },

    //check for conditions that allow user to advance or lose
    boardCheck: function(a) {
        //correct answer is the value shifted from the start of userSeq
        var correct = this.userSeq.shift();
        //record a click from the player
        var playerClick = $(a.target).data("tile");
        //if the click doesn't match end game
        this.advance = (playerClick === correct);
        // userSeq arrayis empty when sequence has been correctly entered
        if (this.userSeq.length === 0 && this.advance) {
          this.deactivateBoard();
          this.levelUp();
        //if user lost
        } else if (!this.advance) {
          this.deactivateBoard();
          this.endGame();
        }
      },
      //make board clickable to user after sequence is played
      //check board on user click
    activateBoard: function() {
        var that = this;
        $('.board')
            .on('click', '[data-tile]', function(a) {
                that.boardCheck(a);
            })
            .on('mousedown', '[data-tile]', function() {
                $(this).addClass('lit');
                that.playSound($(this).data('tile'))
            })
            .on('mouseup', '[data-tile]', function() {
                $(this).removeClass('lit');
            });

        $('[data-tile]').addClass('hoverable');
    },

    //deactivate board any time it's not the player's turn
    deactivateBoard: function() {
        $('.board')
            .off('click', '[data-tile]')
            .off('mousedown', '[data-tile]')
            .off('mouseup', '[data-tile]')

        $('[data-tile]').removeClass('hoverable');
    },

    //deactivate board and set level back to 0
    endGame: function() {
      var sad = new Audio("fail.mp3");
        this.deactivateBoard();
        $("#level").text('0');
        this.lightTileEnd();
        sad.play();
        this.highScoreCheck();
        console.log(this.highScore);
    },

    // light tile by looking up data # add and remove lit class
    lightTile: function(tile) {
        var $tile = $("[data-tile=" + tile + "]").addClass('lit');
        window.setTimeout(function() {
            $tile.removeClass('lit');
        }, 400);
    },

    lightTileEnd: function(tile) {
        var $tile = $("[data-tile]").addClass('lit');
        window.setTimeout(function() {
            $tile.removeClass('lit');
        }, 1200);
    },

    //method to play a sound on cue with lightTile
    playSound: function(sound) {
        var g = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
        var r = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
        var b = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
        var y = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
        var soundArr = [g, r, b, y];
        soundArr[sound].play();
    },

    highScoreCheck: function() {
        if (this.level > this.highScore) {
          this.highScore = this.level;
          $("#highScore").text("High Score: " + this.highScore);
        }
    }
}

$(document).ready(function() {
    $("#start").click(function() {
        game.newGame();
    });
    $("#reset").click(function(){
        game.endGame();
    });
});
