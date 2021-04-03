  
var dbConfig = require("../config/dbConfig");
var sql = require("mssql");
const config = require("../config/config");
const { response } = require("express");

//Send the invitation for play from player a to player b
async function addInvitation(req, res) {
    console.log(req.body)
    await sql
        .connect(dbConfig())
        .then(async () => {
            await sql.query(
                `exec agregaInvitation '${req.body.fromplayer}','${req.body.toplayer}'`
            );
        })
        .then((response) => {
            res.status(200).send({ msg: 1 })
        })
        .catch((err) => {
            console.log("ERROR:  " + err)
            res.status(404).send({ msg: 0 });
        });
}

async function getInvitation(req,res){
    await sql
        .connect(dbConfig())
        .then(async()=>{
            return sql.query(`SELECT * FROM getInvitation('${req.body.toplayer}')`)
        })
        .then((response)=>{
            console.log(response)
            res.status(200).send(response.recordset)
        })
        .catch((err)=>{
            console.log(err)
            res.status(404).send({msg: 0})
        })

}

module.exports = {
    addInvitation,
    getInvitation
}