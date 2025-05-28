const express = require('express');

const router = express.Router()
const memberContoller = require("../controllers/member-controller");
const fileUpload = require('../middleware/file-upload')


router.post('/signup',fileUpload.single('image'),memberContoller.signupMember)
router.post('/login',memberContoller.loginMember)
router.get('/getOrganizations',memberContoller.getOrganizations)
router.get('/getMemberById/:id',memberContoller.getMemberByID)
router.patch('/updatememberdetails/:id',fileUpload.single('image'),memberContoller.updateMemberDetails)
router.post('/addmembership',memberContoller.addMembership)
router.delete('/deletemembership',memberContoller.cancelMembership)
router.post('/getmemStatus',memberContoller.sendMembershipStatus)
router.post('/addSubscriptions',memberContoller.addSubscriptions)
router.post('/unsubscribe',memberContoller.unsubscribe)
router.get('/getSubscribedIds/:id',memberContoller.getSubscribedIds)
router.get('/getLogs/:id',memberContoller.getLogs)
router.get('/getSubscriptionsById/:id',memberContoller.getSubscriptionsById)
router.get('/getMembershipById/:id',memberContoller.getMembershipById)
router.delete('/unSubscribeById',memberContoller.unSubscribeById)

module.exports = router;