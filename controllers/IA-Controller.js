const { response } = require("express");

var n = null
var level =null

var levels = {
    "L1": 55,  // 55%
    "L2": 65,  // 65%
    "L3": 100  // 100%
};


// 7x7

var matrix = null;

// Validates if it is the player's first move
function isInitialMove(color) {
    var size = n * n;
    for (var i = (size - 1); i >= 0; i--) {
        // There is one checker already
        if (matrix[i] == color)
            return false;
    }
    return true;
}

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
    var random;
    do {
        random = Math.floor(Math.random() * (max - min)) + min;
    } while (matrix[random] != 0);
    return random;
}

// Adds a new element to the received object. If the item already exists, add 1 to its key.
function addElementToObject(object, e) {
    (object.hasOwnProperty(e)) ? (object[e] += 1) : object[e] = 1;
    return object;
}

// Combine 2 json objects, if they have elements with the same key it adds to the value
function combineObjects(obj1, obj2) {
    for (var key in obj2) {
        var times = obj2[key];
        for (var i = 0; i < times; i++) {
            obj1 = addElementToObject(obj1, key);
        }
    }
    return obj1;
}

// Validate if the index is a empty space and if has a checker below
function isEmptyAndValid(tempIndex) {
    return (matrix[tempIndex] == 0 && matrix[tempIndex + n] != 0) ? true : false;
}

// Returns an array with all possible indices where a checker can be inserted
function allPosiblesIndex() {
    var indexes = [];
    for (var i = (matrix.length - 1); i >= (matrix.length - n); i--) {
        let j = i;
        while (j >= 0) {
            if (matrix[j] == 0) {
                indexes.push(j); // add posible index
                break;
            }
            j -= n;
        }
    }
    return indexes;
}

///////////////////////////////////////////////////////////////////////////////////////
// Functions to know where the computer has winning moves -->
///////////////////////////////////////////////////////////////////////////////////////

/* 
 * Returns a JSON with all the indices where the player can win.
 * If the opposing opponent has no move returns {}
 * Keys represents the index and values are the total times that can win.
 */
function searchWinningsIndices(color) {

    // Object of indeces where the computer can win
    var winIndices = {};

    // VERTICAL MOVES
    winIndices = verticalWinningIndeces(color);

    // HORIZONTAL MOVES
    var arrayIndexWin = horizontalWinningsIndices(color);
    if (Object.keys(arrayIndexWin).length > 0)
        winIndices = combineObjects(winIndices, arrayIndexWin); // Merge Objects

    // DIAGONAL MOVES
    arrayIndexWin = diagonalWinningsIndices(color);
    if (Object.keys(arrayIndexWin).length > 0)
        winIndices = combineObjects(winIndices, arrayIndexWin); // Merge Objects

    return winIndices;
}

// Returns a JSON with the indices where the player can win vertically
function verticalWinningIndeces(color) {
    var winIndices = {};
    var size = n * n;
    for (var i = (size - 1); i >= (size - n); i--) {
        let j = i;
        let count = 0;
        // It goes up in the matrix as long as there is no empty one
        while ((j - n) >= 0 && matrix[j] != 0) {
            if (matrix[j] == color)
                count += 1;
            else
                count = 0;
            j -= n; // Goes up

            if (count >= 3 && matrix[j] == 0)
                winIndices = addElementToObject(winIndices, j); // Adds the index to win moves
        }
    }
    return winIndices;
}

// Returns a JSON with the indices where the player can win horizontally
function horizontalWinningsIndices(color) {
    var winIndices = {};
    var size = n * n;

    for (var i = (size - 1); i >= (n - 1); i -= n) {
        var indices = createRows(i); // array of indices horizontal
        //console.log("GROUP: [" + indices + "]");
        // Merge Objects: add the posibles moves to winIndices
        winIndices = combineObjects(winIndices, evaluateRowOrDiagonal(indices, color));
    }
    return winIndices;
}

// Returns a JSON with the indices where the player can win diagonally
function diagonalWinningsIndices(color) {
    var winIndices = {};

    var i = n * n - 1;
    for (i; i >= (n * n - n); i--) { // Last row of board

        /////////// Diagonal up to the right ///////////
        var indices = createRightDiagonal(i); // array of indices of diagonal
        // To ignore subgroups with less than 4 indices
        if (indices.length > 3) {
            //console.log("GROUP: [" + indices + "]");
            winIndices = combineObjects(winIndices, evaluateRowOrDiagonal(indices, color)); // Merge Objects
        }

        /////////// Diagonal up to the left ///////////
        indices = createLeftDiagonal(i);
        // To ignore subgroups with less than 4 indices
        if (indices.length > 3) {
            //console.log("GROUP: [" + indices + "]");
            winIndices = combineObjects(winIndices, evaluateRowOrDiagonal(indices, color)); // Merge Objects
        }
    }

    var size = n * n;

    // First colum
    for (let i = (size - (n + n)); i > 0; i = i - n) {
        var indices = createRightDiagonal(i); // array of indices of diagonal
        if (indices.length > 3) {
            //console.log("GROUP: [" + indices + "]");
            winIndices = combineObjects(winIndices, evaluateRowOrDiagonal(indices, color)); // Merge Objects
        }
    }

    // Last column
    for (let i = (size - (n + 1)); i > n; i = i - n) {
        var indices = createLeftDiagonal(i); // array of indices of diagonal
        if (indices.length > 3) {
            //console.log("GROUP: [" + indices + "]");
            winIndices = combineObjects(winIndices, evaluateRowOrDiagonal(indices, color)); // Merge Objects
        }
    }

    return winIndices;
}

function createRows(tempIndex) {
    var i = tempIndex;
    var indices = []; // array of indices horizontal
    // For each row on the board create an array with all its indexes.
    while ((i - (n - 1)) >= 0 && tempIndex != (i - n)) {
        indices.push(tempIndex);
        tempIndex--;
    }
    return indices;
}

// Diagonal up right 
function createRightDiagonal(tempIndex) {
    var indexRow = Math.trunc(tempIndex / n);
    var indices = [];

    while (indexRow > 0 && tempIndex != (n * indexRow + (n - 1))) {
        indices.push(tempIndex);
        tempIndex = tempIndex - (n - 1);
        indexRow = Math.trunc(tempIndex / n);
    }
    indices.push(tempIndex);
    return indices;
}

// Diagonal up left 
function createLeftDiagonal(tempIndex) {
    var indexRow = Math.trunc(tempIndex / n);
    var indices = [];

    while (indexRow > 0 && tempIndex != n * indexRow) {
        indices.push(tempIndex);
        tempIndex = tempIndex - (n + 1);
        indexRow = Math.trunc(tempIndex / n);
    }
    indices.push(tempIndex);
    return indices;
}

/**
 * Receive an array with the indices of a row or a diagonal of the board.
 * Then, this creates subgroups of 4 indices and sends them to another function
 * to validate if the player has a chance of winning in the row or column received.
 */
function evaluateRowOrDiagonal(indices, color) {

    var start = 0;
    var count = 0;

    var winIndices = {};
    var group = []; // To store the subgroups.

    var len = indices.length;
    for (var i = 0; i <= len; i++) {
        if (count == 4) {
            //console.log("subgroup:: [" + group + "]");
            // valid if the is posibility to win
            var index = validateSubgroup(group, color);
            if (index > -1) {
                winIndices = addElementToObject(winIndices, index); // adds posible index win
            }
            i = start + 1;
            count = 0;
            start = i;
            group = [];
        }
        group.push(indices[i]);
        count++;
    }
    return winIndices;
}

/* Receives an array of 4 indices and validates if the computer can win
 * Returns the win index or -1 if there is no chance to win.
 */
function validateSubgroup(group, color) {
    var len = group.length;

    var playerColor = 0;
    var blank = 0;
    var indexWinner;

    for (var i = 0; i < len; i++) {
        if (matrix[group[i]] == color) {
            playerColor++;
            continue;
        }
        if (isEmptyAndValid(group[i])) {
            blank++;
            indexWinner = group[i];
        }
    }
    return (playerColor == 3 && blank == 1) ? indexWinner : -1;
}



///////////////////////////////////////////////////////////////////////////////////////
// Functions to try to create double plays -->
///////////////////////////////////////////////////////////////////////////////////////


/**
 * Returns the index where the computer can apply a double play.
 * Returns -1 if double play is not possible.
 */
function canMakeDoubleMove(p1Color, p2Color) {

    // Find all possible indices where a checker can be inserted
    var indices = allPosiblesIndex(); // [i, i, i, i]
    var size = indices.length;

    // For each possible movement its execution is simulated.
    for (var i = 0; i < size; i++) {

        // Simulating the move to searche posibles double moves
        var posiblesWin = simulateMove(indices[i], p1Color);

        // If the object has more than 1 the player1 can double play.
        let total = Object.keys(posiblesWin).length;
        if (total > 1) {
            console.log("Color " + p1Color + ", can make double move at [" + indices[i] + "]");
            // For not giving the opponent the chance to win
            if (!rivalCanWinByPlayerMove(indices[i], p1Color, p2Color))
                return indices[i]; // Returns the index to apply the double play
            else {
                console.log("Be careful if u move [" + indices[i] + "], rival can win...");
                // Try to block one of the indices on the posibles win
                for (var key in posiblesWin) {
                    var index = parseInt(key);
                    if (isEmptyAndValid(index)) {
                        return index;
                    }
                }
            }
        }
    }
    return -1; // returns -1 if there is no way to apply a double move
}

// To try to make a double move vertically
function canBuildVerticalDobleMove(p1Color, p2Color) {
    // Find all possible indices where a checker can be inserted
    var indices = allPosiblesIndex();
    var size = indices.length;

    var posibles = []; // Posibles indices

    // For each possible movement its execution is simulated.
    for (var i = 0; i < size; i++) {

        matrix[indices[i]] = p1Color;
        var posiblesWin = lineOfTwoVertically(p1Color);

        // To Ignore indices where can not build a line of three vertically
        if (Object.keys(posiblesWin).length == 0) {
            matrix[indices[i]] = 0;
            continue;
        }

        // Run a double simulation to know if player1 can make a double move
        var index = canMakeDoubleMove(p1Color, p2Color); // already validates if opponent cannot win

        // Restart the status of first simulation
        matrix[indices[i]] = 0;

        if (index != -1) {
            //console.log("Yes, u can try in: " + indices[i]);
            posibles.push(indices[i]);
        }
    }
    let total = posibles.length;
    // TO RANDOMLY SELECT A THE MOVE
    return (total > 0) ? posibles[getRandomInt(0, total)] : -1; // returns -1 if there is no way to build a double move
}

function lineOfTwoVertically(color) {
    var winMoves = {};
    for (var i = (matrix.length - 1); i >= (matrix.length - n); i--) {
        let j = i;
        let count = 0;
        // mientras no se salga y sea del mismo color
        while ((j - n) >= 0 && matrix[j] != 0) {

            if (matrix[j] == color)
                count += 1;
            else
                count = 0;
            j -= n;
            if (count == 2 && matrix[j] == 0)
                winMoves = addElementToObject(winMoves, j);
        }
    }
    return winMoves;
}



///////////////////////////////////////////////////////////////////////////////////////
// Functions to find the horizontal and diagonal neighbors of a checker.  -->
///////////////////////////////////////////////////////////////////////////////////////

function horizontalNeighbors(index, color) {
    //////////////// Horizontal neighborings ////////////////
    var neigborsIndeces = [];

    let row = Math.trunc(index / n); // Represents the index row
    let tempIndex = index - 1;
    let tempRow = Math.trunc(tempIndex / n);

    // To the left
    let shift = 2;
    while (row == tempRow && shift > 0) {
        // If found a blocking checker
        if (matrix[tempIndex] != 0 && matrix[tempIndex] != color)
            break;
        if (isEmptyAndValid(tempIndex) || matrix[tempIndex] == color)
            neigborsIndeces.push(tempIndex);

        tempIndex--;
        tempRow = Math.trunc(tempIndex / n);
        shift--;
    }
    // To the right
    tempIndex = index + 1;
    tempRow = Math.trunc(tempIndex / n);

    shift = 2;
    while (row == tempRow && shift > 0) {
        // If found a blocking checker
        if (matrix[tempIndex] != 0 && matrix[tempIndex] != color)
            break;
        if (isEmptyAndValid(tempIndex) || matrix[tempIndex] == color)
            neigborsIndeces.push(tempIndex);

        tempIndex++;
        tempRow = Math.trunc(tempIndex / n);
        shift--;
    }

    return neigborsIndeces;
}

function diagonalNeighbors(index, color) {
    //////////////// Diagonal neighborings ////////////////
    var neigborsIndeces = [];

    // Diagona up/right: (index - (n - 1))  />
    let indexRow = Math.trunc(index / n);
    // Ignore column 0 and first row
    if (indexRow > 0 && index != (n * indexRow + (n - 1))) {

        tempIndex = index - (n - 1);
        let block = false;

        if (isEmptyAndValid(tempIndex) || matrix[tempIndex] == color) {
            neigborsIndeces.push(tempIndex);
        } else {
            if (matrix[tempIndex] != 0)
                block = true;
        }

        indexRowAnt = Math.trunc(tempIndex / n);
        tempIndex = tempIndex - (n - 1);
        indexRowSig = Math.trunc(tempIndex / n);

        if (!block && (indexRowAnt != indexRowSig) && (isEmptyAndValid(tempIndex) || matrix[tempIndex] == color)) {
            neigborsIndeces.push(tempIndex);
        }
    }

    // Diagonal up/left: (index - (n + 1)) <\
    indexRow = Math.trunc(index / n);
    // Ignores row 0 and column 0
    if (indexRow > 0 && index != n * indexRow) {
        tempIndex = index - (n + 1);
        let block = false;

        if (isEmptyAndValid(tempIndex) || matrix[tempIndex] == color) {
            neigborsIndeces.push(tempIndex);
        } else {
            if (matrix[tempIndex] != 0)
                block = true;
        }

        indexRowAnt = Math.trunc(tempIndex / n);
        tempIndex = tempIndex - (n + 1);
        indexRowSig = Math.trunc(tempIndex / n);

        if (!block && (indexRowAnt - 1 == indexRowSig) && (isEmptyAndValid(tempIndex) || matrix[tempIndex] == color)) {
            neigborsIndeces.push(tempIndex);
        }
    }

    // Diagonal down/left: (index + (n - 1)) </
    indexRow = Math.trunc(index / n);
    // Ignores last row (n - 1) and column 0
    if (indexRow < (n - 1) && index != n * indexRow) {

        tempIndex = index + (n - 1);
        let block = false;

        if (isEmptyAndValid(tempIndex) || matrix[tempIndex] == color) {
            neigborsIndeces.push(tempIndex);
        } else {
            if (matrix[tempIndex] != 0)
                block = true;
        }

        indexRowAnt = Math.trunc(tempIndex / n);
        tempIndex = tempIndex + (n - 1);
        indexRowSig = Math.trunc(tempIndex / n);

        if (!block && (indexRowAnt != indexRowSig) && (isEmptyAndValid(tempIndex) || matrix[tempIndex] == color)) {
            neigborsIndeces.push(tempIndex);
        }
    }

    // Diagonal down/right: (index + (n + 1))  \>
    indexRow = Math.trunc(index / n);
    // Ignores last column (n - 1) and last row (n - 1)
    if (indexRow < (n - 1) && index != (n * indexRow + (n - 1))) {

        tempIndex = index + (n + 1);
        let block = false;

        if (isEmptyAndValid(tempIndex) || matrix[tempIndex] == color) {
            neigborsIndeces.push(tempIndex);
        } else {
            if (matrix[tempIndex] != 0) // case is a block
                block = true;
        }
        indexRowAnt = Math.trunc(tempIndex / n);
        tempIndex = tempIndex + (n + 1);
        indexRowSig = Math.trunc(tempIndex / n);

        if (!block && (indexRowAnt == indexRowSig - 1) && (isEmptyAndValid(tempIndex) || matrix[tempIndex] == color)) {
            neigborsIndeces.push(tempIndex);
        }
    }
    return neigborsIndeces;
}

// Receives an index and returns its neighboring indices horizontally and diagonally.
function neighbors(index, color) {

    var neigbors = [];
    // Searches horizontal and diagonal indicesd
    neigbors = horizontalNeighbors(index, color);
    neigbors = neigbors.concat(diagonalNeighbors(index, color));

    return neigbors;
}


///////////////////////////////////////////////////////////////////////////////////////
// Validate if a player won the game -->
///////////////////////////////////////////////////////////////////////////////////////

function validateWin(req, res) {
    matrix=req.body.matrix
    n = req.body.size
    var color = req.body.color

    var indices = [];
    var size = n * n;

    /////////// Horizontal ///////////
    for (var i = (size - 1); i >= (n - 1); i -= n) {
        indices = isWinningSubgroup(i, color, createRows);
        if (indices.length > 0)
            return res.status(200).send({ msg: indices })
    }

    /////////// Diagonal ///////////
    var i = n * n - 1;
    for (i; i >= (n * n - n); i--) { // Last row of board
        // Diagonal up to the right
        indices = isWinningSubgroup(i, color, createRightDiagonal);
        if (indices.length > 0)
            return res.status(200).send({ msg: indices });

        // Diagonal up to the left
        indices = isWinningSubgroup(i, color, createLeftDiagonal);
        if (indices.length > 0)
            return res.status(200).send({ msg: indices });

    }

    // First colum
    for (let i = (size - (n + n)); i > 0; i = i - n) {
        indices = isWinningSubgroup(i, color, createRightDiagonal);
        if (indices.length > 0)
            return res.status(200).send({ msg: indices });
    }

    // Last column
    for (let i = (size - (n + 1)); i > n; i = i - n) {
        indices = isWinningSubgroup(i, color, createLeftDiagonal);
        if (indices.length > 0)
            return res.status(200).send({ msg: indices });
    }


    /////////// Vertical ///////////
    for (var i = (size - 1); i >= (size - n); i--) {
        let j = i;
        let count = 0;
        var subgroup = [];
        // It goes up in the matrix as long as there is no empty one
        while ((j - n) >= 0 && matrix[j] != 0) {
            if (matrix[j] == color) {
                count += 1;
                subgroup.push(j);
            } else {
                subgroup = [];
                count = 0;
            }
            j -= n; // Goes up

            if (count >= 4)
                return res.status(200).send({msg:subgroup});
        }
    }
    return res.status(200).send({msg:0});
}

function isWinningSubgroup(index, color, funct) {
    var indices = [];
    indices = funct(index);
    var subgroup = evaluateSubgroups(indices, color);
    if (subgroup.length > 0) {
        console.log("El color " + color + " ganó en: [" + subgroup + "]");
        return subgroup;
    }
    return [];
}

function evaluateSubgroups(indices, color) {
    var start = 0;
    var count = 0;

    var group = []; // To store the subgroups.

    var len = indices.length;
    for (var i = 0; i <= len; i++) {
        if (count == 4) {
            //console.log("subgroup:: [" + group + "]");
            // Validates if the player win
            if (winningGroup(group, color)) {
                return group;
            }
            i = start + 1;
            count = 0;
            start = i;
            group = [];
        }
        group.push(indices[i]);
        count++;
    }
    return [];
}

/** 
 * Receives an array of 4 indices and validates if the player win in that
 * subgroup
 */
function winningGroup(group, color) {
    var len = group.length;

    for (var i = 0; i < len; i++) {
        if (matrix[group[i]] != color)
            return false;
    }
    return true;
}


///////////////////////////////////////////////////////////////////////////////////////
// IA Logic Functions -->
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Validates if a movement can give the victory to an enemy
 * p1Color: color of checker being simulated 
 * p2Color: color of checker to verify if can win
 */
function rivalCanWinByPlayerMove(index, p1Color, p2Color) {
    matrix[index] = p1Color; // Simulating player 1 move
    var posiblesWin = searchWinningsIndices(p2Color); // searches player 2 posibles wins
    matrix[index] = 0; // Return the state of the matrix

    let total = Object.keys(posiblesWin).length;
    return (total > 0) ? true : false;
}

/**
 * Validates if a movement can give the victory to the player
 * p1Color: color of checker being simulated
 */
function simulateMove(index, p1Color) {
    matrix[index] = p1Color; // Simulating move
    var posiblesWin = searchWinningsIndices(p1Color); // searches player posibles wins
    matrix[index] = 0; // Return the state of the matrix
    return posiblesWin;
}

function nextMove(p1Color, p2Color) {

    // Searches all posibles moves
    var indices = allPosiblesIndex();
    let size = indices.length;

    var posibles = [];
    let total = 0;

    for (var i = 0; i < size; i++) {

        // Ignores indices that can make opponent win
        if (rivalCanWinByPlayerMove(indices[i], p1Color, p2Color))
            continue;

        // Ignores indices that are a trick for opponent
        if (rivalCanWinByPlayerMove(indices[i], p1Color, p1Color))
            continue;

        // Ignores indices where the player can build double moves horizontally or diagonally
        matrix[indices[i]] = p1Color;
        var index = canMakeDoubleMove(p1Color, p2Color);
        matrix[indices[i]] = 0;
        if (index != -1) {
            console.log("Oh no move [" + indices[i] + "] you can move then to [" + index + "] and win");
            continue;
        }

        // for every index search all  its neighbordings
        var array = neighbors(indices[i], p1Color);
        var arrayLength = array.length;

        if (arrayLength > total) {
            posibles = [];
            total = arrayLength;
            posibles.push(indices[i]); // Posible index to choose
        } else if (arrayLength == total) {
            posibles.push(indices[i]); // Posible index to choose
        }
    }
    //console.log("posibles: [" + posibles + "]");
    //console.log("they have total of neightbords: " + total);
    var len = posibles.length;
    return (total > 0) ? posibles[getRandomInt(0, len)] : -1;
}

function bestOptionToWin(winIndices) {
    // buscar el indice apropiado
    var index = -1;
    var total = 0; // veces que puede ganar con ese indice
    for (var key in winIndices) {
        if (winIndices[key] > total) {
            total = winIndices[key];
            index = parseInt(key);
        }
    }
    return index;
}

// Returns true if a randomly chosen number meets the probability.
function probabilityOfExecution(percentage) {
    var num = Math.floor((Math.random() * 100) + 1);
    console.log(percentage + " %");
    console.log("generated: " + num + " %");
    return (num <= percentage) ? true : false;
}

// Returns the next appropiate move
function CPU_IA(req, res) {
    level=req.body.level;
    n = req.body.n;
    matrix = req.body.matrix;
    level = req.body.level;
    var cpuColor = req.body.cpuColor;
    var rivalColor = req.body.rivalColor;

    // 1. INITIAL MOVE
    if (isInitialMove(cpuColor) == true) {
        var respuesta = nextMove(cpuColor, rivalColor); // Pseudo random index choice
        return res.status(200).send({ msg: respuesta });

    }

    // 2. VERIFIES IF THE COMPUTER CAN WIN
    var winIndices = {};
    winIndices = searchWinningsIndices(cpuColor);
    if (Object.keys(winIndices).length > 0) {
        var respuesta = bestOptionToWin(winIndices);
        return res.status(200).send({ msg: respuesta });
    }

    // 3. TO BLOCK OPPONENT MOVES
    var winIndices = searchWinningsIndices(rivalColor);
    if (Object.keys(winIndices).length > 0) {
        console.log("Bloqueando gane enemigo...");
        console.log("");
        var respuesta = bestOptionToWin(winIndices);
        return res.status(200).send({ msg: respuesta });
    }

    if (probabilityOfExecution(levels[level])) {
        // 4. VALIDATE IF THE COMPUTER CAN MAKE A DOUBLE MOVE
        var index = canMakeDoubleMove(cpuColor, rivalColor);
        if (index != -1) {
            console.log("4. Computer: Realizando doble jugada");
            console.log("");
            return res.status(200).send({ msg: index });
        }
    }

    if (probabilityOfExecution(levels[level])) {
        // 5. VALIDATE IF THE RIVAL CAN MAKE A DOUBLE MOVE
        var index = canMakeDoubleMove(rivalColor, rivalColor);
        if (index != -1) {
            console.log("5. Rival: puede hacer doble jugada, bloqueando...");
            console.log("");
            return res.status(200).send({ msg: index });
        }
    }

    if (probabilityOfExecution(levels[level])) {
        // 6. RIVAL CAN BUILD A DOUBLE PLAY VERTICALLY?
        var index = canBuildVerticalDobleMove(rivalColor, cpuColor);
        if (index != -1) {
            console.log("6. RIVAL: CAN BUILD A DOUBLE PLAY VERTICALLY, BLOKING...");
            console.log("");
            return res.status(200).send({ msg: index });
        }
    }

    if (probabilityOfExecution(levels[level])) {
        // 7. COMPUTER CAN BUILD A DOUBLE PLAY VERTICALLY?
        var index = canBuildVerticalDobleMove(cpuColor, rivalColor);
        if (index != -1) {
            console.log("7. COMPUTER: building A DOUBLE PLAY VERTICALLY!");
            console.log("");
            return res.status(200).send({ msg: index });
        }
    }

    // 8. TO SEARCH THE MOST APPROPIATE NEXT MOVE
    var index = nextMove(cpuColor, rivalColor);
    if (index != -1) {
        console.log("8. Next move...");
        console.log("");
        return res.status(200).send({ msg: index });
    }

    // 9. Finally, is there is not possibly next move, there is no option
    var indices = allPosiblesIndex();
    console.log("8. Finally, is there is not possibly next move, there is no option");
    let size = indices.length;
    var respuesta = (size > 0) ? indices[getRandomInt(0, size)] : -1;
    return res.status(404).send({ msg: respuesta })

}

module.exports = {
    validateWin,
    CPU_IA
};