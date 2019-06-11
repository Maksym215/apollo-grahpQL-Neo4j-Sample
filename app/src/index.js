import { GraphQLServer } from 'graphql-yoga'
import dotenv from "dotenv";
import { rule, shield, and, or, not } from 'graphql-shield'
import { User } from './user'
import { schema } from './schema'
import { resolvers } from './resolvers'
import { driver } from './neo4j'
import jwksClient from 'jwks-rsa';
import {OIDC} from "./oidc";
// import {}
// Settings
dotenv.config();


// Rules
const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return ctx.user !== null
})

const isAdmin = rule()(async (parent, args, ctx, info) => {
  // these will be
  return ctx.user.role === 'admin'
})

const isEditor = rule()(async (parent, args, ctx, info) => {
  return ctx.user.role === 'editor'
})

const allow = rule({ cache: 'contextual' })(async (parent, args, ctx, info) => {
  // console.log("rule : user : " + ctx.user);
  console.log("Permission check : isAuthoried: ", ctx.user.isAuthorized);
	return ctx.user.isAuthorized === true;
});

// Permissions
const permissions = shield({
  // Query: {
  //   frontPage: not(isAuthenticated),
  //   fruits: and(isAuthenticated, or(isAdmin, isEditor)),
  //   customers: and(isAuthenticated, isAdmin),
  // },
  Query: allow,
  Mutation: {
    addFruitToBasket: isAuthenticated,
  },
  Fruit: isAuthenticated,
  Customer: isAdmin,
})


// Server
const server = new GraphQLServer({
  schema,
  resolvers,
  middlewares: [permissions],
  context: req => ({
    driver,
    user: new User(req,pubKey),
  }),
})

// server.start(() => console.log('Server is running on http://localhost:4000'))
var pubKey;

function runServer(kid){
  // console.log("header : ", header.kid)
  client.getSigningKey(kid, function(err, key) {
    if(err != null)
      console.log("getSigningKey error:" + err);
    else{
      var signingKey = key.publicKey || key.rsaPublicKey;
      // console.log("signkey : ", signingKey );
      pubKey = signingKey;
      server.start(() => console.log('Server is running on localhost:4000'));
    }
  });
}
var client = jwksClient({
  jwksUri: process.env.OIDC_ISSUER_URL + '/protocol/openid-connect/certs'
});

function start(){
  runServer(process.env.OIDC_KID);
}
start();

/*
{
  USER_MAP_POSITION{
    map_name
    user
    x
    y
  }
}
*/