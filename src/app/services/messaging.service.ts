// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class MessagingService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe((_messaging) => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging); _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    }
    )
  }
  //
  //
  updateToken(userId, token) {
    this.angularFireAuth.authState.pipe(take(1)).subscribe(() => {
      const data = {};
      data[userId] = token
      this.angularFireDB.object('fcmTokens/').update(data)
    })
  }
  //
  //
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe((token) => {
      console.log(token);
      this.updateToken(userId, token);
    }, (err) => {
      console.error('Unable to get permission to notify.', err);
    });
  }
  //
  //
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      console.log("new message received. ", payload);
      this.currentMessage.next(payload);
    })
  }
}
