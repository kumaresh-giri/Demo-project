// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  server: 'http://localhost:4200/',
  title: 'Code Red Pizza',
  apiURL: 'https://www.api.coderedpizza.com/api/v1/',
  siteUrl: 'http://localhost:4200/',
  siteUrlWithoutSlash: 'http://localhost:4200',
  imageBaseUrl:'https://www.api.coderedpizza.com/',
  facebookLoginConfig: {
    appId: '419587880212370',
    //sdkSrc: 'https://connect.facebook.net/en_US/sdk.js',
  },
  googleLoginConfig: {
    clientId:
      '300909283932-jk0vrqjb49qj9u034rad180l4d9aavsr.apps.googleusercontent.com',
    //sdkSrc: 'https://apis.google.com/js/platform.js?onload=googleSDKLoaded',
  },
  captchaConfig: {
    siteKey:'6LfkCnciAAAAAGHgm9hq59N5W92qLOo6gtVf9ijQ'
  },
  stripeConfig: {
    publishKey:'pk_live_51Ln4L4AIx1MgpG15S370ayDBasBrnPVdK6S4kuJUshp7XA3ke003UAwwKP3Ce3Aa3rZkJnKp2YL2kv7VKPmTnk8L001USEHVaM'
  },
  encyptdecryptPassword: 'Pizza@123',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
