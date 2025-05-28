const HttpError = require('../models/http-error');
const Organization = require('../models/organization')
const Member = require('../models/member')
const Membership = require('../models/membership')
const MemberSubscription = require('../models/MemberSubscriptions')
const Logs = require('../models/logs')
const Subscriptions = require('../models/subscriptions')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const signupMember = async (req,res,next) => {
    const {fname,lname,email,username,gender,phone,password,age} = req.body
    const imagePath = req.file ? req.file.path : null;

    let existingUser;
    try{
        existingUser = await Member.findOne({username})
    }
    catch(error){
        return next(new HttpError('Signing up failed, please try again later.', 500))
    }

    if (existingUser) {
        return next(new HttpError('User already exists, please login instead.', 422));
    }


    let hashedPassword;

    try{
        hashedPassword = await bcrypt.hash(password,12);
        console.log(hashedPassword);
    }
    catch(error){
        return next(new HttpError('Could not create user, please try again.', 500));
    
    }

    const memId = Math.random().toString(36).substring(2, 10);
    const createdUser = new Member({
        member_id:memId,
        firstName:fname,
        lastName:lname,
        username:username,
        gender:gender,
        email:email,
        age:age,
        phone:phone,
        password:hashedPassword,
        image:imagePath
    });

    try{
        await createdUser.save();
    }
    catch(error){
        return next(new HttpError('Signing up failed, please try again.', 500));
    }


    let token;
    try{
        token=jwt.sign({userId:createdUser.member_id,email:createdUser.email,role:"member"},
            'supersecret_dont_share',{ expiresIn: '1h' }
        );
    }
    catch (error) {
            return next(new HttpError('Signing up failed, please try again.', 500));
        }


    res.status(201).json({
        userId:createdUser.id,//changed member_id
        email:createdUser.email,
        role:"member",
        token:token,
        username:createdUser.username
    });
}

const loginMember = async(req,res,next)=>{
    const {username,password} = req.body;
    let existingUser;

    try{
        existingUser = await Member.findOne({username:username})
    }
    catch(error) {
        return next(new HttpError('Logging in failed, please try again later.', 500));
    }

    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password,existingUser.password)
    }
    catch(error){
        return next(new HttpError('Could not log you in, Please check your credentials and try again.',500))
    }

    if(!isValidPassword){
        return next(new HttpError("Invalid credentials, could not log you in", 401));
    }

    if (!existingUser) {
        return next(new HttpError("Invalid credentials, could not log you in", 401));
    }

    let token;
    try{
        token=jwt.sign({userId:existingUser.member_id,email:existingUser.email,role:existingUser.permission },
            'supersecret_dont_share',{ expiresIn: '1h' }
        );
    }
    catch(error){
        return next(new HttpError('Logging in failed, please try again',500));
    }

    res.status(200).json({ userId:existingUser.id,email: existingUser.email, token: token ,role:existingUser.permission, username:existingUser.username});
}

const getOrganizations =async (req,res,next)=>{
    let organization
    try{
        organization =await Organization.find()
    }
    catch(error){
        return next(new HttpError("Server error. cannot get organizations",500))
    }
    res.status(200).json({organization})
}


const getMemberByID = async(req,res,next)=>{
    const id = req.params.id
    let member
    try{
        member = await Member.findById(id)        
    }
    catch(error){
        console.log(error);
        return next(new HttpError("server error. cannot get member",500))
    }
    res.status(200).json({member})
}

const updateMemberDetails =async (req,res,next)=>{
    const id = req.params.id
    const {fname,lname,email,phone,username,age} = req.body
    const image = req.file ? req.file.path : null;
    let updated_member
    let existing_image
    try{
        updated_member = await Member.findById(id)
        existing_image = updated_member.image
    }
    catch(error){
        return next(new HttpError("No user found",500))
    }
    try{
        updated_member.firstName = fname
        updated_member.lastName = lname
        updated_member.email=email
        updated_member.phone=phone
        updated_member.username=username
        updated_member.age=age
        updated_member.image=image?image:existing_image
        updated_member.save()
    }
    catch(error){
        return next(new HttpError("server error. cannot upadate details"))
    }
    res.status(200).json({updated_member})
}


const addMembership = async (req, res, next) => {
    const { orgId, member_id } = req.body;
    let membership;
    let log;
    let org
    try {
        membership = await Membership.findOne({ org_id: orgId, id: member_id });
        org = await Organization.findOne({org_id:orgId})
        
        if (membership) {
            if(membership.status){
                return next(new HttpError("you are already a member",500))
            }
            membership.status = true;
            membership.joined_date = new Date();
            org.no_of_members += 1
        } else {
            membership = new Membership({
                org_id: orgId,
                member_id: member_id,
                status: true,
                joined_date: new Date()
            });
            org.no_of_members += 1
        }

        await membership.save();
        await org.save();
            log = new Logs({
                member_id:member_id,
                org_id:orgId,
                action:"Become a member",
                company:org.name
            })
            await log.save()
    } catch (error) {
        console.error(error);
        return next(new HttpError("Failed to create or update membership", 500));
    }

    res.status(200).json({ message: "Membership created or updated successfully", membership });
};


const cancelMembership = async(req,res,next)=>{
    const {member_id,org_id} = req.body
    let membsership
    let log
    try{
        membsership =await Membership.findOne({org_id:org_id,member_id:member_id})
        let org = await Organization.findOne({org_id:org_id})
        membsership.status=false
        await membsership.save()
        
        log = new Logs({
            member_id:member_id,
            org_id:org_id,
            action:"Membership Cancelled",
            company:org.name
        })
        org.no_of_members -= 1

        await org.save()
        await log.save()
        
    }
    catch(error)
    {
        console.log(error);
        return next(new HttpError("cancelling membership failed",500))
    }


    res.status(200).json({message:"cancel membership"})
}


const sendMembershipStatus =async(req,res,next)=>{
    const {member_id,org_id} = req.body
    let status
    let is_member
    let membership_id
    try{
        is_member = await Membership.findOne({org_id:org_id,member_id:member_id})    
    }catch(error){
        console.log(error);   
    }
    if(is_member){
        if(is_member.status){
            status=true
            membership_id=is_member.id
        }
    }
    else{
        status=false
    }
    res.status(200).json({status:status,membership_id:membership_id})
}


const addSubscriptions =async (req,res,next)=>{
    const {member_id,subscription_id,membership_id} = req.body
    let existing_subscription
    let new_subscription
    let log
    try{
        existing_subscription =await MemberSubscription.findOne({
            member_id:member_id,
            membership_id:membership_id,
            subscription_id:subscription_id
        })
        if(existing_subscription){
            return next(new HttpError("You are already subscribed to it.",500))
        }
        else{
            new_subscription  = new MemberSubscription({
                member_id:member_id,
                membership_id:membership_id,
                subscription_id:subscription_id
            })  
            await new_subscription.save()

            let subscription =await Subscriptions.findById(subscription_id)
            let org_id = subscription.org_id
            let org = await Organization.findOne({org_id:org_id})
            log = new Logs({
                member_id:member_id,
                org_id:org_id,
                action:`Added ${subscription.name}`,
                company:org.name
            })
            await log.save()


        }
    }
    catch(error){
        console.log(error);
        return next(new HttpError("Error creating subscription.",500))
    }
res.status(200).json({message:" subscriptions created successfully"})
}

const unsubscribe = async(req,res,next)=>{
    const {member_id,subscription_id,membership_id} = req.body
    let log
    let existing_subscription
    try{
        existing_subscription =await MemberSubscription.findOne({
            member_id:member_id,
            membership_id:membership_id,
            subscription_id:subscription_id
        })
        if(existing_subscription){
          await existing_subscription.deleteOne()
          let subscription =await Subscriptions.findById(subscription_id)
            let org_id = subscription.org_id
            let org = await Organization.findOne({org_id:org_id})
            log = new Logs({
                member_id:member_id,
                org_id:org_id,
                action:`Removed ${subscription.name}`,
                company:org.name
            })
            await log.save()
        }
        else{
            return next(new HttpError("You are not subscribed to it",404))
        }
    }
    catch(error){
        return next(new HttpError("Failed to unsubscribe",500))
    }
    res.status(200).json({message:"unsubscribed successfully"})
    
}


const getSubscribedIds = async (req,res,next)=>{
    const {id} = req.params
    let subscriptionIds
    try{
        let sub =await MemberSubscription.find({member_id:id})
        subscriptionIds = sub.map(sub => sub.subscription_id);
        console.log(subscriptionIds);
    }
    catch(error){
        return next(new HttpError("not found",404))
    }
    res.status(200).json({subscriptionIds:subscriptionIds})
}

const getLogs = async(req,res,next)=>{
    const {id} = req.params
    let log
     try{
        log =await Logs.find({member_id:id})
     }
     catch(error){
        return next(new HttpError("Error getting logs",500))
     }
    res.status(200).json({message:"logs",log:log})
}

const getSubscriptionsById = async(req,res,next)=>{
    const {id} = req.params
    let subscriptions
    try{
        subscriptions = await MemberSubscription.find({member_id:id}).populate('subscription_id');
    }
    catch(error){
        return next(new HttpError("Server error. Cannot get subscriptions",500))
    }
    res.status(200).json({message:"subscriptions",id,subscriptions})
}


const getUserOrganizations = async (userId) => {
    try {
      const memberships = await Membership.aggregate([
        { $match: { member_id: userId } },
        {
          $lookup: {
            from: 'organizations',
            localField: 'org_id',
            foreignField: 'org_id',
            as: 'organization_info'
          }
        },
        { $unwind: '$organization_info' },
        {
          $lookup: {
            from: 'benefits',
            localField: 'org_id',
            foreignField: 'org_id',
            as: 'benefits'
          }
        }
      ]);
  
      return memberships;
    } catch (err) {
      console.error('Error fetching memberships:', err);
      return [];
    }
  };
  
  


const getMembershipById = async(req,res,next)=>{
    const {id} = req.params
    let memberships
    try{
        memberships = await getUserOrganizations(id);
    }
    catch(error){
        console.log(error);
        
        return next(new HttpError("Server error. Cannot get memberships",500))
    }
    res.status(200).json({message:"membership",id,memberships})
}

const unSubscribeById = async(req,res,next)=>{
    const {id,orgId,subscription_id,member_id} = req.body
    try{
        const existing_subscription =await MemberSubscription.findById(id)
        const organization = await Organization.findOne({org_id:orgId})
        const subscription = await Subscriptions.findById(subscription_id)
        await existing_subscription.deleteOne()
        let log = new Logs({
            member_id:member_id,
            org_id:orgId,
            action:`Removed ${subscription.name}`,
            company:organization.name
        })
        await log.save()
    }
    catch(error){
        return next(new HttpError("Failed to unsubscribe",500))
    }
    res.status(200).json({message:"Unsubscribed successfully",id})
}


exports.signupMember = signupMember;
exports.loginMember = loginMember;
exports.getOrganizations = getOrganizations;
exports.getMemberByID = getMemberByID;
exports.updateMemberDetails = updateMemberDetails;
exports.addMembership = addMembership;
exports.cancelMembership = cancelMembership;
exports.sendMembershipStatus = sendMembershipStatus;
exports.addSubscriptions = addSubscriptions;
exports.unsubscribe = unsubscribe;
exports.getSubscribedIds =getSubscribedIds;
exports.getLogs = getLogs;
exports.getSubscriptionsById = getSubscriptionsById;
exports.getMembershipById = getMembershipById;
exports.unSubscribeById = unSubscribeById