
class OIDC{
    getPublicKey(){
        return client.getSigningKey(kid, function(err, key) {
        if(err != null){
            return false;
        } else {
            var signingKey = key.publicKey || key.rsaPublicKey;
            pubKey = signingKey;
            return true;
           }
        });
    }
}

export {OIDC};