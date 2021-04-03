const { Router } = require('express');
const router = Router();

//* Import controllers for each action.
const user = require('../controllers/users-controller');
const login_logout = require('../controllers/login-logout-controller');
const game_setup = require('../controllers/game-setup-controller');
const IA = require('../controllers/IA-Controller');
const online = require('../controllers/Online-controller');

// * Declare routes.
router.post('/api/updateMatrix',game_setup.updateMatrix);
router.get('/api/getMatrix',game_setup.getMatrix);
router.post('/api/nextMoveIA',IA.CPU_IA);
router.post('/api/validateWin',IA.validateWin);
router.post('/api/getGame',game_setup.getGame);
router.get('/api/getLastGame',game_setup.getLastGame);
router.post('/api/addUsuario', user.addUser);
router.get('/api/getUsuarios', user.getUsuarios);
router.post('/api/setOnlineUser', login_logout.setOnlineUSer);
router.post('/api/setOfflineUser', login_logout.setOfflineUSer);
router.post('/api/creatematrix',game_setup.createMatrix)
router.post('/api/getTurn',game_setup.getTurn);
router.post('/api/addInvitation', online.addInvitation);
router.post('/api/getInvitation',online.getInvitation);

// Default route.
router.get('/', (req, res) => {
      res.status(200).send('server running successfully');
});

// Export routes.
module.exports = router;