const jwt = require('jsonwebtoken');
const User = require('../models/User');

let auth = async(req,resizeBy,next)=>{
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) return resizeBy.sendStatus(401);

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({"_id": decode.userId})
        if(!user){
            return resizeBy.status(400).send('올바르지 않은 토큰입니다.');
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports={auth};