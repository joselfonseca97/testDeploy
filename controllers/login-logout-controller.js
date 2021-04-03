var dbConfig = require("../config/dbConfig");
var sql = require("mssql");
const config = require("../config/config");
const { response } = require("express");


async function setOnlineUSer(req, res) {
    await sql
        .connect(dbConfig())
        .then(async () => {
            console.log(req.body.username)
            await sql.query
                (`Exec setOnlineUsuario "${req.body.username}"`)
        })
        .then((response) => {
            res.status(200).send({ msg: 1 })
        })
        .catch((err) => {
            res.status(404).send({ msg: 0 })
        })
}
async function setOfflineUSer(req, res) {
    await sql
        .connect(dbConfig())
        .then(async () => {
            console.log(req.body.username)
            await sql.query
                (`Exec setOfflineUsuario "${req.body.username}"`)
        })
        .then((response) => {
            res.status(200).send({ msg: 1 })
        })
        .catch((err) => {
            res.status(404).send({ msg: 0 })
        })
}

module.exports = {
    setOnlineUSer,
    setOfflineUSer
}