// we will construct user from token data here
// this is also where we do token verification for basic verify of token
// this is also where we copy from token.groups to user.groups
// none of the other group functions will touch token
// all other attempts to verify group will be against user.groups not token.groups
// from this point we don't care about token
// return of this sets the ctx.user it is the base decider if ctx.user is null or not for isAuthenticated

import jwt from "jsonwebtoken";

class User {

    constructor(reqobj, pubKey) {
        var id_token;
        var req = reqobj.request;
        
        this.isAuthorized = false;

        const options = {
            audience: process.env.OIDC_CLIENT_ID,
            issuer: process.env.OIDC_ISSUER_URL,
            algorithms: ["RS256"]
        };

        if(! req){
          req = reqobj.connection.context;
          if(! req) return;
          id_token = req.Authorization;
          if(!id_token) id_token = req.authorize;
          if(!id_token) return;
        } else{
          id_token = req.get('Authorization');
          if(!id_token) id_token = req.get("authorize");
          if(!id_token) return;
        } 
        var userInfo = null;
        jwt.verify(id_token.replace("Bearer ", ""), pubKey, options, function(err, decoded){
            if(err){
              console.log("Token verify error : ", err);
              userInfo = null;
              return;
            }
            if(! decoded ) return;
            userInfo = decoded;
        });
        if(! userInfo) return;
        this.preferred_username = userInfo["preferred_username"];
        this.given_name = userInfo["given_name"];
        this.family_name = userInfo["family_name"];
        this.email = userInfo["email"];
        this.groups = userInfo["groups"];
        if(this.hasGroup(""))
        {
            this.isAuthorized = true;
            return;
        }
        console.log("This user has no vailid group Info.");
    }
    
    hasGroup(groups) {
        if(groups == null) return false;
        return groups.includes("api-access");
    }
}

export { User };