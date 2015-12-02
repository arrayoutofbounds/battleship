var view = {
  displayMessage: function(msg) {
    var messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = msg;
  },
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class","hit");
  },
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },{ locations: [0, 0, 0], hits: ["", "", ""] },{ locations: [0, 0, 0], hits: ["", "", ""] } ],

  fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// here's an improvement! Check to see if the ship
			// has already been hit, message the user, and return true.
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations)); // if there are collisions then find other locations.
      this.ships[i].locations = locations;
    }
  },

  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        // add location to array for new horizontal ship
        newShipLocations.push(row + "" + (col + i));
      } else {
        // add location to array for new vertical ship
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },

  collision: function(locations) {
    // for each location check if any ship already has that location. If it does then return true for collision and
    // a new location array will be calculated.
   for (var i = 0; i < this.numShips; i++) {
     var ship = model.ships[i];
     for (var j = 0; j < locations.length; j++) {
       if (ship.locations.indexOf(locations[j]) >= 0) {
         return true;
       }
     }
    }
    return false;
  }

};

var controller = {
  guesses: 0,
  // guess as "A0"
  processGuess: function(guess){
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location); // returs true if there is a hit
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " +
        this.guesses + " guesses");
      }
    }
  }
};
function parseGuess(guess) {

  var alphabet = ["A","B","C","D","E","F","G"];
  var firstChar;


  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
  }else {
    firstChar = guess.charAt(0); // get alphabet in guess
    var row = alphabet.indexOf(firstChar); // get the row that alpbahet corresponds to
    var column = guess.charAt(1);

    // check that both the row and the column are numbers
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board!");
    }else{
      return row + column;
    }

  }
  return null;
}

// this is the init function to handle event
function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;

  // same as above but for the case where user presses enter
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations(); // so all locations of ships are there when page is loaded
}
// this does the same as pressing fire button, but it does it when enter is pressed.
function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
// this function is called when fire button is clicked.
function handleFireButton() {
  // code to get the value from the form
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;

  controller.processGuess(guess);
  guessInput.value = "";

}
// init is only called after everything is loaded on the page.
window.onload = init;
