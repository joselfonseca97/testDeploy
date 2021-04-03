const app = require('./app');

// Start running the server.

app.listen(app.get('port'));
console.log(`Server on port ${app.get('port')}`);