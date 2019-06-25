/**
 * To enable authentication to Github, create a firebase project and provide
 * its configuration in an adjacent file called firebase.config.ts
 * E.g.
 * export const FIREBASE_CONFIG = {
 *   apiKey: 'my-api-key',
 *   authDomain: 'example-app.firebaseapp.com',
 *   databaseURL: 'https://example-app.firebaseio.com',
 *   projectId: 'example-app',
 *   storageBucket: 'example-app.appspot.com',
 *   messagingSenderId: 'example-messaging-sender-id'
 * };
 */
export const FIREBASE_CONFIG = null;

export const CAN_AUTH = !!FIREBASE_CONFIG;
