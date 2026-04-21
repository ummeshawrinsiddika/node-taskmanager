const { mailsender } = require("../helpers/mailService");
const { isvalidEmail, generateOTP, generateAccessToken } = require("../helpers/utils");
const { isValidPassword } = require("../helpers/utils");
const authSchema = require("../models/authSchema");
const { uploadToCloudinary, destroyFromCloudinary } = require("../helpers/cloudinaryService");

const registration = async (req, res)=>{
    const { fullName, email, password } = req.body
    try {
        if(!fullName?.trim()) return res.status(400).send({ message: "FullName is required"});
        if(!email) return res.status(400).send({ message: "email is required"});
        if(!isvalidEmail(email)) return res.status(400).send({ message: "email is invalidate"});
        if(!password) return res.status(400).send({ message: "password is required"});
        if(!isValidPassword(password)) return res.status(400).send({ message: "password is invalidate"});
        const existingEmail = await authSchema.findOne({email});
        if(existingEmail) return res.status(400).send({ message: "This Email is already registered"});
        const otp_number = generateOTP();
        const user = await authSchema({ 
            fullName, email, password, 
            otp: otp_number, 
            otpExpiry: Date.now() + 10 * 60 * 1000, 
        });
        user.save();
        await mailsender({ email, subject: "otp verification mail", otp: otp_number })
        res.status(200).send({ message: "registration successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "internal server is error"});   
    }
}

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await authSchema.findOneAndUpdate({ 
            email, otp,
            otpExpiry: { $gte: Date.now()},
        }, 
        { isVerified : true, otp: null },
        { returnDocument : "after" });
        if(!user) return res.status(400).send({ message: "Invalid request" });
        res.status(200).send({ message: "email verified successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "internal server is error"})  
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await authSchema.findOne({ email });
        if(!user) return res.status(400).send({message: "Invalid credential"});
        if(!user.isVerified) return res.status(400).send({message: "email is not verified"});
        const matchPassword = await user.comparePassword(password)
        if(!matchPassword) return res.status(400).send({message: "Invalid credential"});
        const accessToken = generateAccessToken({ _id: user._id, email: user.email })
        res.cookie("accessToken", accessToken)
        res.status(200).send({ message: "Login successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "internal server is error"})
    }
}

const userProfile = async (req, res) => {
    try {
        const userData = await authSchema.findOne({ _id: req.user._id }).select("avatar email fullName")
        if(!userData) return res.status(404).send({ message: "user not found" })
        res.status(200).send(userData)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "internal server is error"}) 
    }
}

const updateProfile = async (req, res) => {
    const { fullName } = req.body;
    const userId = req.user._id;
    try {
        const userData = await authSchema.findOne({_id: userId});
        if(fullName.trim()) userData.fullName = fullName;
        if(req.file) {
            await destroyFromCloudinary(userData.avatar);
            const avatarUrl = await uploadToCloudinary({ 
                mimetype: req.file.mimetype, 
                imgBuffer: req.file.buffer 
            });
            userData.avatar = avatarUrl.secure_url;
        }
        userData.save();
        res.status(200).send({message: "profile updated is successfully"})
    } catch (error) {
        console.log(error);  
    }
};

module.exports = { registration, verifyOTP, login, userProfile, updateProfile }