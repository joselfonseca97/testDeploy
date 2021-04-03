var dbConfig = require("../config/dbConfig");
var sql = require("mssql");
const config = require("../config/config");
const { response } = require("express");

//* Endpoint to get all users.

/* Return list of all users */

async function getUsuarios(req, res) {
    await sql
        .connect(dbConfig())
        .then(() => {
            return sql.query(`SELECT * FROM getUsuarios()`);
        })
        .then((response) => {
            res.status(200).send(response.recordset);
            
        })
        .catch((err) => {
            console.log(err);
            res.status(404).send({ msg: 1 });
        });
}

/* Endpoint to add an user */
/* returns simple response: 0=fail  1=success */

async function addUser(req, res) {
    console.log(req.body)
    await sql
        .connect(dbConfig())
        .then(async () => {
            await sql.query(
                `exec agregarUsuario "${req.body.name}", "${req.body.username}", "${req.body.password}"`
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





module.exports = {
    getUsuarios,
    addUser
}