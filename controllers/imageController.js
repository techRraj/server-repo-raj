// import userModel from "../models/userModel.js"
// import FormData from "form-data"
// import axios from "axios"
// import process from "process"


// export const generateImage = async (req, res) => {
//     try {
//         const {userId, prompt} = req.body

//         const user = await userModel.findById(userId)

//         if (!user || !prompt) {
//             return res.json({ success: false, message: 'Missing Details'})
//         }

//         if (user.creditBalance === 0 || userModel.creditBalance <0){
//             return res.json({success: false, message: 'No Credit Balance', creditBalance: user.creditBalance })
//         } 

//         const formData = new FormData()
//         formData.append('prompt', prompt)

//         const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
//             headers: {
//                 'x-api-key': process.env.CLIPDROP_API,
//               },
//               responseType : 'arraybuffer'
//         })

//         const base64Image = Buffer.from(data, 'binary').toString('base64')
//         const resultImage = `data:image/png;base64,${base64Image}`

//         await userModel.findByIdAndUpdate(user._id, {creditBalance:user.creditBalance - 1})

//         res.json({success:true, message:"Image Generated", 
//         creditBalance: user.creditBalance -1 , resultImage})
//     } catch (error) {
//          console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }



import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";
import process from "process";

export const generateImage = async (req, res) => {
    console.log("✅ Generating image...");
    console.log("Request body:", req.body);

    try {
        const userId = req.user.id;
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.creditBalance <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No Credit Balance',
                creditBalance: user.creditBalance,
            });
        }

        const formData = new FormData();
        formData.append('prompt', prompt);

        console.log("🚀 Calling ClipDrop with prompt:", prompt);

        const { data } = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1 ',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'x-api-key': process.env.CLIPDROP_API,
                },
                responseType: 'arraybuffer',
            }
        );

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });

        res.json({
            success: true,
            message: 'Image Generated',
            creditBalance: user.creditBalance - 1,
            resultImage,
        });
    } catch (error) {
        console.error("❌ Image generation failed:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};