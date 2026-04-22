/**
 * connects other files to proper AWS database
 */

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-2_2hwRL848d",
      userPoolClientId: "no4bg4lims05c9t2vj70nfruo",
    },
  },
};

export default awsConfig;