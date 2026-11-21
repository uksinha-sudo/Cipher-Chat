import { userModel } from "../models/user.model";


export async function createNewAccount(req, res){
    const { username, email, password } = req.body;
    if(!username || !email || !password){
        return res.status(404).json({
            message: "All fields are required"
        })
    };

    const existingUser = await userModel.findOne({
        $or:[
            { username },
            { email }
        ]
    })
    if(existingUser) {
        const field = existingUser.email === email ? "Email" : "Username";
        return res.status(409).json({ message: `${field} is already in use`})
    }

    
}