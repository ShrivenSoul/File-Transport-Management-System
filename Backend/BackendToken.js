import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-2_2hwRL848d",   // from AWS-config.js
  tokenUse: "access",
  clientId: "no4bg4lims05c9t2vj70nfruo",        // from AWS-config.js
});

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const payload = await verifier.verify(token);
    req.user = {
      userId: payload.sub,
      username: payload.email,
      userGroups: payload["cognito:groups"] || [],
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};