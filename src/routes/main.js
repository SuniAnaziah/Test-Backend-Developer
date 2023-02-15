const express = require ('express')
const { register, login, changePassword, getAllUser } = require('../controllers/authController')
const { getProfile, updateProfile } = require('../controllers/profileController')
const { jwtAuth } = require('../middleware/authentication')

const router = express.Router()


router.get('/', (req, res)=>{
    return res.json({info: "This is route page"})
})

// production only
router.get('/api/user', getAllUser)
// end production only

router.post('/api/register', register)
router.post('/api/login', login)
router.put('/api/change-password', changePassword)


router.get('/api/profile', jwtAuth, getProfile)
router.put('/api/profile', jwtAuth, updateProfile)



module.exports = router