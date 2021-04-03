var dbConfig = require("../config/dbConfig");
var sql = require("mssql");
const config = require("../config/config");
const { response } = require("express");


/* Endpoint to create a matrix(single list format)*/
//create a default(empty) matrix, receives its size and returns a list
function createMatrix(req, res) {
    console.log(req.body)
    var finalList = [];
    var size = req.body.size;

    for (let index = 0; index < size ** 2; index++) { // fill it with 0's
        finalList.push(0);
    }
    console.log(finalList)
    res.send({ matrix: finalList })
}


//EN PROCESO

/* Endpoint to add a new game */

/* async function createGame(req,res){
    await sql
    .connect(dbConfig())
    .then(()=>{
        return sql.query(``)
    })

} */


/* EndPoint to get state of a game */

async function getGame(req, res) {
    await sql
        .connect(dbConfig())
        .then(async () => {
            return sql.query(`SELECT * FROM getGame(${req.body.idGame})`)
        })
        .then((response) => {
            console.log(response)
            res.status(200).send(response.recordset)
        })
        .catch((err) => {
            console.log(err)
            res.status(404).send({ msg: 0 })
        })

}
/* Endpoint to get id of the last game created */
async function getLastGame(req, res) {
    await sql
        .connect(dbConfig())
        .then(async () => {
            return sql.query(`SELECT dbo.getLastGame()`)
        })
        .then((response) => {
            res.status(200).send({ msg: response.recordset })
        })
        .catch((err) => {
            res.status(404).send({ msg: 0 })
        })
}

//EN PROCESO
//EndPoint to get matrix from a specific game

async function getMatrix(req, res) {
    console.log(req)
    await sql
        .connect(dbConfig())
        .then(() => {
            return sql.query(`SELECT * FROM getMatrix(${req.body.idGame})`)
        })
        .then((response) => {
            var respuesta = srtToList(response.recordset[0].matrix);
            console.log(respuesta)
            res.status(200).send({ msg: respuesta })
        })
        .catch((err) => {
            res.status(404).send({ msg: 0 })
        })
}

async function updateMatrix(req, res) {
    var matrix = req.body.matrix
    console.log(matrix)
    console.log(req.body.idGame)
    var respuesta = listToStr(matrix)
    console.log(respuesta);
     await sql
        .connect(dbConfig())
        .then(() => {
            console.log("-----------------------------" + respuesta);
            return sql.query(`EXEC updateMatrix ${req.body.idGame}, '${respuesta}'`)
        })
        .then((response) => {
            res.status(200).send({ msg: 1 })
        })
        .catch((err) => {
            res.status(404).send({ msg: 0 })
        })
        
}



function srtToList(str) {
    let string = str;
    let newArray = string.split('');
    let result = newArray.map(i => Number(i));
    return result;
}

function listToStr(list) {
    var size = list.length;
    var str = "";
    for (let i = 0; i < size; i++)
        str += list[i];
    return str;
}

async function getTurn (req, res){
    await sql
    .connect(dbConfig())
    .then(()=>{
        return sql.query(`SELECT * from getTurn(${req.body.idGame})`)
    })
    .then((response)=>{
        console.log(response.recordset)
        res.status(200).send(response.recordset[0])
    })
    .catch((err)=>{
        console.log(response.recordset)
        res.status(404).send({error : 0})   
    })
}

module.exports = {
    createMatrix,
    getLastGame,
    getGame,
    getMatrix,
    updateMatrix,
    getTurn
}

