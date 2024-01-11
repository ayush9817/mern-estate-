import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true
        },
        avatar : {
            type : String,
            default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw2Gs31uxvh9iqqTTe5Bn_rc&ust=1704975895800000&source=images&cd=vfe&ved=0CBMQjRxqFwoTCODltabo0oMDFQAAAAAdAAAAABAE"
        }

    }, {timestamps:true}
)

const user = mongoose.model('User',userSchema);

export default user;