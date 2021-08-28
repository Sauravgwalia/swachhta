import User from '../model/user.js';
import Rate from '../model/rate.js';
import nodemailer from 'nodemailer';


export const login = async (req,res) => {
    try{
        const users = await User.find({email : req.body.email})
        if(users.length == 0){
            console.log('login failed')
            res.status(401).json({message : 'login failed'})
        }
        else{
            if(users[0].password === req.body.password ){
                console.log('login successful')
                res.status(200).json({message : users[0].name , email : users[0].email})
            }
            else{
                console.log('login failed')
                res.status(401).json({message : 'login failed'})
            }
        }
    }
    catch(error){
        res.status(501).json({message : 'login failed'})
    }
}

export const signup = async (req,res) => {
    req.body.points = 0;
    try{
        const users = await User.find({email : req.body.email})
        if(users.length > 0 || req.body.name.length < 3 || req.body.password.length < 6){
            res.status(401).json({message : 'email already exist'})
        }
        else{
            const signedUpUser = await new User(req.body).save();
            res.status(200).json({message : 'signup succesfully'})
        }
    }
    catch(error){
        res.status(501).json({message : 'signup failed'})
    }
}

export const points = async (req,res) => {
    const id = req.params.id
    try{
        const users = await User.findOne({email : "abc@gmail.com"});
        users.points = users.points + 10;
        await users.save();
        res.status(200).json({message : 'updated'})
    }
    catch(err){
        console.log(err.message);
        res.status(501).json({message : 'update failed'})
    }
}

export const rateInc = async (req,res) => {
    const rate = await Rate.findOne({});
    rate.rateIn5 += req.body.rate;
    rate.person += 1;
    try{
        await rate.save();
        res.status(200).json({
            success : true,
        })
    }
    catch(err){
         res.status(501).json({message : 'update failed'})
    }
}

export const rateCount = async (req,res) => {
    const rate = await Rate.findOne({});
    res.json(rate);
}

export const mail = async (req,res) => {

    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : 'wethree0003@gmail.com',
            pass : 'abcdef001#',
        }
    })

    // save image to images first also need the name of the image

    // get the nearest mc
    let nearestMc;
    let cleanliness = "Garbage Dump removal";
    let msg = "This is regarding the garbage dump, need to be cleaned. The location along with Picture is attached here. This is an auto mated mail from SWACHTTA App."

    var mailOptions = {
        from : 'wethree0003@gmail.com',
        to :  nearestMC,
        subject : cleanliness,
        html : msg,
        attachments : [{
            filename : 'test.jpg',
            path : './images/test.jpg',
        }]
    }
    

    transporter.sendMail(mailOptions, function (error,info){
        if(error){
            console.log(error);
            res.status(400).json({"msg" : "failed msg"});
        }
        else{
            console.log('mail sent : ' + info.response);
            res.status(200).json({"msg" : "mail successful"});
        }
    })
}

function getDistance(lat1, lon1, lat2, lon2){
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist;
    }
}

