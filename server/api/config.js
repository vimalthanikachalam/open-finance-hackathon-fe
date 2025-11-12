//
// //
// // // SET ME FROM THE CLIENT PACK
const CLIENT_ID = 'https://rp.sandbox.directory.openfinance.ae/openid_relying_party/2af865c5-012a-4565-b755-e565b9eaaabb';
const SIGNING_KEY_ID = 'nR9YP4dib3nc93PNQXenYGB85ISB95xaVo6xQ7HvKWw';
// // //
// //
//

export default {
  CLIENT_ID,
  SIGNING_KEY_ID,

  REDIRECT_URI: 'https://docs.openfinance-hackathon.com/starter-kit/callback',
  RESOURCE_SERVER: 'https://rs1.altareq1.sandbox.apihub.openfinance.ae',
  ISSUER: 'https://auth1.altareq1.sandbox.apihub.openfinance.ae',
  AUTH_ENDPOINT: 'https://auth1.altareq1.sandbox.apihub.openfinance.ae/auth',
  PAR_ENDPOINT: 'https://as1.altareq1.sandbox.apihub.openfinance.ae/par',
  TOKEN_ENDPOINT: 'https://as1.altareq1.sandbox.apihub.openfinance.ae/token',
  JWKS: 'https://keystore.sandbox.directory.openfinance.ae/233bcd1d-4216-4b3c-a362-9e4a9282bba7/application.jwks',
};

