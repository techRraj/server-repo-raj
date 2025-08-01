import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
name:{type :String,required:true},
email :{type: String,required :true ,unique :true },
password: {type :String ,required :true},
creditBalance:{type:Number,default: 5 },
role: { type: String, default: 'user' }

})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;


// const users = await userModel.find({ creditBalance: null });
// for (let user of users) {
//   user.creditBalance = 5;
//   await user.save();
// }
// console.log("Default credits updated for old users.");