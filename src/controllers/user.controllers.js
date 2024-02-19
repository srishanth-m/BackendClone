import asyncHandler from "../utils/asyncHandlers.js";
import ApiError from "../utils/ApiError.js"
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    
    const {fullName , email , userName , password} = req.body
    console.log("email :" , email)

    if(
        [fullName , email , userName , password].some((field) => field?.trim() === "")
    ){
        throw new ApiError
    }

    const existedUser = User.findOne({
        $or : [{email} , {userName}]
    })

    if(existedUser){
        throw new ApiError(409 , "user with email or usernsme already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0].path;

    if(!avatarLocalPath){
        throw new ApiError(400 , "avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400 , "avatar file is required")
    }

    const user = User.create({
        userName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        userName : userName.toLowerCase()
    })

    const createdUser = await User.findById(user._Id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500 , "something went wrong while registering the user")
    }

    return res.status(200).json(
        new ApiResponse(200 , createdUser , "User registered successfully")    
    )

})

export { registerUser }