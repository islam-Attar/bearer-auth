'use strict';

module.exports = (UserModel) =>async (req,res,next)=>{
    try{
    if(req.headers['authorization']) {
        // 'Bearer token'
        let bearerHeaderParts= req.headers.authorization.split(' ');
        console.log('bearerHeaderParts >>> ',bearerHeaderParts); // ['Bearer','token']
        let token = bearerHeaderParts.pop(); //encoded(username:password)
        console.log('Token >>> ',token);
        
       
        UserModel.validateToken(token).then(user=>{
            req.user = user;
            next();
        }).catch(res.status(403).send('invalid token'));
    }
}catch(error){
   res.status(403).send('invalid token')
}
}