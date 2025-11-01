import { authenticate } from "../middleware/auth.middleware";
import User from "../models/user.model";

export const getHomeInfo = async()=>{

}

export const updateUserInfo = async(req,res,next)=>{
    //get the updated Data from the request
    const updatedData = req.body;

    //update the use document
    // const user = await User.findByIdAndUpdate(
    //     {id : req.user._id},
    //     {updatedData},
    //     {new : true}
    // )

    console.log(updatedData);
    
    return res.status(204).json({
        success: true,
        message : "user info updated"
    })
}