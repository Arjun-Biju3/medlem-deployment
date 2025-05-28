const HttpError = require('../models/http-error');
const organization = require('../models/organization');
const Organization = require('../models/organization')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Benefit = require('../models/benefits');
const Subscriptions = require('../models/subscriptions')
const Billing = require('../models/billings');
const { request } = require('express');


const signupOrganization = async (req, res, next) => {
    const { name,username, address, password} = req.body;
    const imagePath = req.file ? req.file.path : null;


    let existingOrg;
    try {
        existingOrg = await Organization.findOne({ username });
    } catch (error) {
        return next(new HttpError('Signing up failed, please try again later.', 500));
    }

    if (existingOrg) {
        return next(new HttpError('Organization already exists, please login instead.', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError('Could not create organization, please try again.', 500));
    }

    const orgId = Math.random().toString(36).substring(2, 10);

    const createdOrg = new Organization({
        org_id: orgId,
        name:name,
        address:address,
        no_of_members: 0,
        profile_image:imagePath,
        username:username,
        password: hashedPassword,
    });

    try {
        await createdOrg.save();
    } catch (error) {
        console.log(error);
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdOrg.org_id, role: 'organization' },
            'supersecret_dont_share'
        );
    } catch (error) {
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    res.status(201).json({
        orgId: createdOrg.org_id,
        role: 'organization',
        token: token,
        username:createdOrg.username,
    });
};


const loginOrganization = async (req, res, next) => {
    const { username, password } = req.body;
    let existingOrg;

    try {
        existingOrg = await Organization.findOne({ username: username });
    } catch (error) {
        return next(new HttpError('Logging in failed, please try again later.', 500));
    }

    if (!existingOrg) {
        return next(new HttpError("Invalid credentials, could not log you in", 401));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingOrg.password);
    } catch (error) {
        return next(new HttpError('Could not log you in, please check your credentials and try again.', 500));
    }

    if (!isValidPassword) {
        return next(new HttpError("Invalid credentials, could not log you in", 401));
    }

    let token;
    try {
        token = jwt.sign(
            {
                userId: existingOrg.org_id,
                role: existingOrg.permission
            },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        );
    } catch (error) {
        return next(new HttpError('Logging in failed, please try again.', 500));
    }

    res.status(200).json({
        userId: existingOrg.org_id,
        role: existingOrg.permission,
        token: token,
        username:existingOrg.username
    });
};

const getOrgById = async (req, res, next) => {
    const id = req.params.id;
    let org, subs, bens,bill;
  
    try {
      org = await organization.find({ org_id: id });
      subs = await Subscriptions.find({ org_id: id });
      bens = await Benefit.find({ org_id: id });
      bill=await Billing.find({org_id:id});
    } catch (error) {
      return next(new HttpError("Fetching organization or related data failed", 500));
    }    
    res.status(200).json({
      org,
      subscriptions: subs,
      benefits: bens,
      bill:bill
    });
  };


  

const updateprofile = async(req,res,next)=>{
    const id = req.params.id
    const {name,address,username} = req.body
    const profile_image = req.file ? req.file.path : null;
    let existing_image
    let profile;
    try{
        profile = await Organization.findById(id);
        existing_image = profile.profile_image
    }
    catch(error){
        console.log(error);
        return next(new HttpError('Something went wrong, please try again.',500));
    }

    profile.name = name;
    profile.address = address;
    profile.username = username;
    profile.profile_image=profile_image?profile_image:existing_image;
    try{
        await profile.save();
    }
    catch(error){
        return next(new HttpError('Something went wrong, please try again.',500));
    }

    res.status(200).json({message:"Details updated succesfully",profile:profile.toObject({getters:true})})
}


const createBenefit = async (req, res, next) => {
    try {
        const { name, description, time_interval, orgId} = req.body;
        const image = req.file ? req.file.path : null;
        
        if (!name || !description || !time_interval || !orgId) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const benefit_id = uuidv4();
        const newBenefit = new Benefit({
            benefit_id,
            name,
            description,
            time_interval,
            image: image || null,
            org_id: orgId
        });
        const savedBenefit = await newBenefit.save();

        res.status(201).json({
            message: 'Benefit created successfully!',
            benefit: savedBenefit
        });
    } catch (error) {
        return next(new HttpError("Server error while creating benefit.",500))
    }
};

const createSubscriptions = async(req,res,next)=>{
    try {
        const { name, time_interval, orgId} = req.body;
        const image = req.file ? req.file.path : null;

        
        if (!name || !time_interval || !orgId) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const sub_id = uuidv4();
        const newBenefit = new Subscriptions({
            sub_id,
            name,
            time_interval,
            image: image || null,
            org_id: orgId
        });
        const savedBenefit = await newBenefit.save();

        res.status(201).json({
            message: 'Subscription created successfully!',
            benefit: savedBenefit
        });
    } catch (error) {
        console.log(error);
        return next(new HttpError("Server error while creating subscription.",500))
    }
};

const getSubscriptions = async (req, res,next) => {
    let org;
    try {
      org = await Subscriptions.find(); 
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "cannot get subscriptions." });
    }
    
    res.status(200).json({ organizations: org });
  };


const createBilling = async(req,res,next)=>{
    try {
        const { name, time_interval, orgId, amount } = req.body;    
        if (!name || !time_interval || !orgId || !amount) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const bill_id = uuidv4();
        const newBilling = new Billing({
            bill_id,
            name,
            amount,
            time_interval,
            org_id: orgId
        });
        const savedBilling = await newBilling.save();

        res.status(201).json({
            message: 'Billing created successfully!',
            billing: savedBilling
        });
    } catch (error) {
        console.log(error);
        return next(new HttpError("Server error while creating bill.",500))
    }
}

const deleteSubscriptionById = async(req,res,next)=>{
    const {id} = req.params
    try{
        let existing_item =await Subscriptions.findById(id)
        if(existing_item){
            await existing_item.deleteOne()
        }
        else{
            return next(new HttpError("Failed to find subscription",500))
        }
    }
    catch(error){
        return next(new HttpError("Failed to delete subscription",500))
    }
    res.status(200).json({message:"subscription deleted succesfully"})
}

const deleteBillingById = async(req,res,next)=>{
    const {id} = req.params
    try{
        let existing_item =await Billing.findById(id)
        if(existing_item){
            await existing_item.deleteOne()
        }
        else{
            return next(new HttpError("Failed to find billing",500))
        }
    }
    catch(error){
        return next(new HttpError("Failed to delete billing",500))
    }
    res.status(200).json({message:"billing deleted succesfully"})
}

const deleteBenefitsById = async(req,res,next)=>{
    const {id} = req.params
    try{
        let existing_item =await Benefit.findById(id)
        if(existing_item){
            await existing_item.deleteOne()
        }
        else{
            return next(new HttpError("Failed to find benefit",500))
        }
    }
    catch(error){
        return next(new HttpError("Failed to delete benefit",500))
    }
    res.status(200).json({message:"benefits deleted succesfully"})
}

////////////delete/////////////////
const getSubscriptionsById = async(req,res,next)=>{
    const {id} = req.params
    let subscription
    try{
        subscription = await Subscriptions.findById(id)
    }
    catch(error){
        return next(new HttpError("Failed to fetch subscriptions",500))
    }
    res.status(200).json({message:"get subscriptions",subscription:subscription})
}

const getBillingsById = async(req,res,next)=>{
    const {id} = req.params
    let billing
    try{
        billing = await Billing.findById(id)
    }
    catch(error){
        return next(new HttpError("Failed to fetch billings",500))
    }
    res.status(200).json({message:"get billings",billing:billing})
}

const getBenefitsById = async(req,res,next)=>{
    const {id} = req.params
    let benefit
    try{
        benefit =await Benefit.findById(id)
    }
    catch(error){
        return next(new HttpError("Failed to fetch  benefits",500))
    }
    res.status(200).json({message:"get benefits",benefit:benefit })
}

///////update///////////////////////


const upadteSubscriptionsById = async(req,res,next)=>{
    const {id} = req.params
    const{name,limit} = req.body
    const image = req.file ? req.file.path : null;
    let existing_image
    try{
        let subscription = await Subscriptions.findById(id)
        existing_image = subscription.image
        if(subscription){
            subscription.name=name
            subscription.time_interval=limit
            subscription.image = image?image:existing_image
            await subscription.save()
        }
        else{
            return next(new HttpError("Failed to find subscription",500))
        }
    }
    catch(error){
        return next(new HttpError("Failed to update subscriptions",500))
    }
    res.status(200).json({message:"subscription updated successfully",id})
}

const updateBillingsById = async(req,res,next)=>{
    const {id} = req.params
    const {name,time_interval,amount} = req.body
    try{
        let bill = await Billing.findById(id)
        if(bill){
            bill.name=name
            bill.time_interval=time_interval
            bill.amount=amount
            await bill.save()
        }
        else{
            return next(new HttpError("Failed to find billing",500))
        }
    }
    catch(error){
        return next(new HttpError("Failed to update billings",500))
    }
    res.status(200).json({message:"billing updated successfully",id})
}

const updateBenefitsById = async(req,res,next)=>{
    const {id} = req.params
    const {name,description,time_interval} = req.body
    const image = req.file ? req.file.path : null;
    let existing_image
    try{
        let benefit = await Benefit.findById(id)
        existing_image=benefit.image
        if(benefit){
            benefit.name=name
            benefit.time_interval=time_interval
            benefit.description=description
            benefit.image = image?image:existing_image
            await benefit.save()
        }
        else{
            return next(new HttpError("Failed to find benefit",500))
        }
    }
    catch(error){
        return next(new HttpError("Failed to update  benefits",500))
    }
    res.status(200).json({message:"benefits updated uccessfully ",id})
}


//////////////////////////////////////////

exports.signupOrganization = signupOrganization;
exports.loginOrganization = loginOrganization;
exports.getOrgById = getOrgById;
exports.updateprofile = updateprofile;
exports.createBenefit = createBenefit;
exports.createSubscriptions = createSubscriptions;
exports.getSubscriptions = getSubscriptions;
exports.createBilling=createBilling;
exports.deleteSubscriptionById = deleteSubscriptionById;
exports.deleteBillingById = deleteBillingById;
exports.deleteBenefitsById = deleteBenefitsById;
exports.getSubscriptionsById = getSubscriptionsById;
exports.getBillingsById = getBillingsById;
exports.getBenefitsById = getBenefitsById;
exports.upadteSubscriptionsById = upadteSubscriptionsById;
exports.updateBillingsById = updateBillingsById;
exports.updateBenefitsById = updateBenefitsById;