const router = require('express').Router()
const question = require('../controllers/question')
const {authentication, authorizationQuestion} = require('../middleware/auth')

router.get('/', question.findAll)
router.post('/search', question.search)
router.get('/user', authentication, question.findMine)

router.get('/:id', question.findOne)

router.use(authentication)
router.post('/', question.create)
router.patch('/:id/upvote', question.upvote)
router.patch('/:id/downvote', question.downvote)

router.use('/:id', authorizationQuestion)
router.delete('/:id', question.delete)
router.put('/:id', question.update)

module.exports = router 