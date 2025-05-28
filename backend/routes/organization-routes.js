const express = require('express');

const router = express.Router()
const orgConanizationtoller = require("../controllers/organization-controller")
const fileUpload = require('../middleware/file-upload')


router.post('/signup',fileUpload.single('image'),orgConanizationtoller.signupOrganization)
router.post('/login',orgConanizationtoller.loginOrganization)
router.get('/getOrganization/:id',orgConanizationtoller.getOrgById)
router.patch('/update/:id',fileUpload.single('image'),orgConanizationtoller.updateprofile)
router.post('/createBenefit',fileUpload.single('image'),orgConanizationtoller.createBenefit)
router.post('/createSubscription',fileUpload.single('image'),orgConanizationtoller.createSubscriptions)
router.get('/getSubscriptions',orgConanizationtoller.getSubscriptions)
router.post('/createBilling',orgConanizationtoller.createBilling)
router.delete('/deletesubscription/:id',orgConanizationtoller.deleteSubscriptionById)
router.delete('/deletebilling/:id',orgConanizationtoller.deleteBillingById)
router.delete('/deletebenefit/:id',orgConanizationtoller.deleteBenefitsById)


router.get('/getsubscriptionByid/:id',orgConanizationtoller.getSubscriptionsById)
router.get('/getbillingByid/:id',orgConanizationtoller.getBillingsById)
router.get('/getbenefitsByid/:id',orgConanizationtoller.getBenefitsById)


router.patch('/updatesubscriptionByid/:id',fileUpload.single('image'),orgConanizationtoller.upadteSubscriptionsById)
router.patch('/updatebillingByid/:id',orgConanizationtoller.updateBillingsById)
router.patch('/updatebenefitsByid/:id',fileUpload.single('image'),orgConanizationtoller.updateBenefitsById)

module.exports = router;