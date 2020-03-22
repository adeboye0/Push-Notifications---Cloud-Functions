/* eslint-disable promise/no-nesting */
const functions = require('firebase-functions');
const firebase = require('firebase-admin');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const settings = { timestampsInSnapshots: true };
firebaseApp.firestore().settings(settings);

const db = firebaseApp.firestore();

exports.sendNotification = functions.firestore.document('collection/{Id}')
    .onCreate((document) => {
        let doc = document.data();
        doc.id = document.id;

        let body = 'Send Notification';
      
        var message = {
            data: {
                title: 'Notification',
                body
            },
            notification: {
                title: 'Notification',
                body
            }
        };
        db.collection('users').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return;
                }
                snapshot.forEach(doc => {
                    if (!doc.data().accessToken) return;
                    // eslint-disable-next-line promise/no-nesting
                    firebase.messaging().sendToDevice(doc.data().accessToken, message)
                        .then(() => console.log('Successfully sent notification'))
                        .catch(() => console.log('Error sending fcm'));
                });
                // eslint-disable-next-line consistent-return
                return true;
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    });