// import * as dotenv from "dotenv";
// import passport from "passport";
// import { Strategy, ExtractJwt } from "passport-jwt";
// import GoogleStrategy from "passport-google-oauth20";
// import FacebookStrategy from "passport-facebook";
// import userModel from "../models/user.model";
// import { env } from "./environments";
// dotenv.config();

// // Setting JWT strategy options
// const jwtOptions = {
//   // Telling Passport to check authorization headers for JWT
//   jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
//   // Telling Passport where to find the secret
//   secretOrKey: env.ACCESS_TOKEN_SECRET,

//   // TO-DO: Add issuer and audience checks
// };

// // Setting up JWT login strategy
// const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
//   userModel.findById(payload._id, (err, user) => {
//     if (err) {
//       return done(err, false);
//     }

//     if (user) {
//       done(null, user);
//     } else {
//       done(null, false);
//     }
//   });
// });

// passport.use(jwtLogin);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: env.GOOGLE_CLIENT_ID,
//       clientSecret: env.GOOGLE_CLIENT_SECRET,
//       callbackURL: env.GOOGLE_CALLBACK_URL,
//       passReqToCallback: true,
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       try {
//         let existedUser = await userModel.findOne({
//           email: profile.emails[0].value,
//         });
//         let user;
//         if (existedUser) {
//           user = await userModel.findByIdAndUpdate(
//             existedUser._id,
//             {
//               authGoogleID: profile.id,
//             },
//             { new: true }
//           );
//           done(null, user);
//           return;
//         }
//         user = await userModel.findOne({
//           authGoogleID: profile.id,
//         });
//         if (user) return done(null, user);
//         const newUser = new userModel({
//           username: profile.displayName,
//           email: profile.emails[0].value,
//           profile: {
//             full_name: profile.displayName,
//           },
//           authGoogleID: profile.id,
//         });
//         await newUser.save();
//         user = newUser;
//         return done(null, user);
//       } catch (error) {
//         done(error, false);
//       }
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy.Strategy(
//     {
//       clientID: env.FACEBOOK_APP_ID,
//       clientSecret: env.FACEBOOK_SECRET,
//       callbackURL: env.FACEBOOK_CALLBACK_URL,
//       profileFields: ["id", "displayName", "photos", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let existedUser = await userModel.findOne({
//           email: profile.emails[0].value,
//         });
//         let user;
//         if (existedUser) {
//           user = await userModel.findByIdAndUpdate(
//             existedUser._id,
//             {
//               authFbID: profile.id,
//             },
//             { new: true }
//           );
//           done(null, user);
//         }
//         user = await userModel.findOne({
//           authFbID: profile.id,
//         });

//         if (user) return done(null, user);
//         const newUser = new userModel({
//           username: profile.displayName,
//           email: profile.emails[0].value,
//           profile: {
//             full_name: profile.displayName,
//           },
//           authFbID: profile.id,
//         });
//         await newUser.save();
//         user = newUser;
//         return done(null, user);
//       } catch (error) {
//         done(error, false);
//       }
//     }
//   )
// );
