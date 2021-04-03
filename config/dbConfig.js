dbConfig = function () {
      var dbConfig = {
            user: "Administrador",
            password: "conecta.4",
            server: "conecta4.database.windows.net",
            database: "conecta4-database",
            stream: false,
            options: {
                  enableArithAbort: true,
                  encrypt: true
            },
            port: 1433
      };
      return dbConfig;
};

module.exports = dbConfig;