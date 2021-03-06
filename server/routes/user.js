const router = require('express').Router()
const user = require('../controllers/user')

router.post('/signup', user.create)
router.post('/signin', user.login)
router.get('/', user.findAll)
router.get('/:id', user.findOne)
router.delete('/:id', user.delete)
router.patch('/:id', user.update)

module.exports = router 
