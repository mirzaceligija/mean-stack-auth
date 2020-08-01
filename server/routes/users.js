let express = require('express');
let router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/auth');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', checkAuth, UserController.getUser);
router.post('/signup', UserController.createUser);
router.post('/signin', UserController.userSignin);
router.put('/activate/:token', UserController.accActivate);

module.exports = router;
