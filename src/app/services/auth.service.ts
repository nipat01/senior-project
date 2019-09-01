import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';


@Injectable()
export class AuthService {
  userRef: AngularFireObject<any>;

  authState: any = null;
  // user$: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private afs: AngularFirestore,
    private router: Router,
  ) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      console.log('test .authstae', this.authState);
    });




  }

  authenticatedAdmin(): boolean {
    return this.authState.email === 'admin@jistic.com';
  }
  get authenticated(): boolean {
    return this.authState !== null;
  }
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }
  get currentUserObservable(): any {
    return this.afAuth.authState
  }
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }
  get currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest'
    } else if (this.currentUserAnonymous) {
      return 'Anonymous'
    } else {
      return this.authState['displayName'] || 'User without a Name'
    }
  }


  get username(): string {
    return this.authState.email;
  }



  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }
  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }
  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }
  private socialSignIn(provider) {

    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        console.log(credential.user);
        this.authState = credential.user
        // this.updateUserData()
        this.router.navigate(['/'])
      })
      .catch(error => console.log(error));
  }
  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        this.authState = user
        this.router.navigate(['/'])
      })
      .catch(error => console.log(error));
  }
  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log('Sign Up Succed');

        // this.authState = user
        // this.updateUserData();
        // this.router.navigate(['/'])
      })
    // .catch(error => console.log(error));
  }
  emailLogin(email: string, password: string) {

    console.log('login');
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log('data user', user);
        this.authState = user
        this.updateUserData();
        this.username;
        this.router.navigate(['/'])
      })
      .catch(error => console.log(error));
  }
  resetPassword(email: string) {
    const fbAuth = firebase.auth();
    return fbAuth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error))
  }

  updatePassword(password: string) {
    var user = firebase.auth().currentUser;
    user.updatePassword(password).then(function () {
     console.log('update password succed');

    }).catch(function (error) {
      console.log('update password fail');

    });
  }


  getCurrentLoggedIn() {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.router.navigate(['/'])
      }
    });
  }
  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['/'])
  }
  private updateUserData(): void {
    const path = `users/${this.currentUserId}`; // Endpoint on firebase
    const userRef: AngularFireObject<any> = this.db.object(path);

    const data = {
      email: this.authState.email,
      name: this.authState.displayName
    }
    userRef.update(data)
      .catch(error => console.log(error));

  }

  deleteAccount(email: string) {
    var user = firebase.auth().currentUser;

    user.delete().then(function () {
      // User deleted.
      console.log('delete succeed');

    }).catch(function (error) {
      // An error happened.
      console.log('cant delete');

    });
  }

}



