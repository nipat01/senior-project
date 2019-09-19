import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class FirebaseService {
  wikiList: AngularFireList<any>;
  carList: AngularFireList<any>;
  jobList: AngularFireList<any>
  homepageList: AngularFireList<any>
  videoList: AngularFireList<any>
  bankList: AngularFireList<any>
  tokenList: AngularFireList<any>
  aboutList: AngularFireList<any>
  aboutAccountList: AngularFireList<any>
  aboutLocationList: AngularFireList<any>
  portolio: AngularFireList<any>
  serivce: AngularFireList<any>
  carType1: AngularFireList<any>
  carType2: AngularFireList<any>
  carType3: AngularFireList<any>

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, ) {
    this.wikiList = db.list('wikis');
    this.carList = db.list('car');
    this.jobList = db.list('job');
    this.homepageList = db.list('homepage');
    this.videoList = db.list('video');
    this.bankList = db.list('bank');
    this.tokenList = db.list('token');
    this.aboutList = db.list('allhomepage/about');
    this.aboutAccountList = db.list('allhomepage/lineAccount');
    this.aboutLocationList = db.list('allhomepage/location');
    this.portolio = db.list('imageDetails/imageDetailPortfolioList');
    this.serivce = db.list('imageDetails/imageDetailServicelList');
    this.carType1 = db.list('imageDetails/imageDetailList/type1');
    this.carType2 = db.list('imageDetails/imageDetailList/type2');
    this.carType3 = db.list('imageDetails/imageDetailList/type3');
  }

  getWikiList(): Observable<any[]> {
    return this.wikiList.snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    });
  }
  getHomepageiList(): Observable<any[]> {
    return this.homepageList.snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.key, value: action.payload.val() }));
    });
  }

  getWiki(id): Observable<any> {
    return this.db.object('job/' + id).snapshotChanges().map(res => {
      return res.payload.val();
    });
  }
  getHomepage(id): Observable<any> {
    return this.db.object('homepage/' + id).snapshotChanges().map(res => {
      return res.payload.val();
    });
  }

  // getUser(email): Observable<any> {
  //   return this.db.list('/wikis', ref => ref.child('email').equalTo(email)).snapshotChanges()
  // }

  addWiki(data) {
    return this.wikiList.push(data);
  }
  addHomepage(data) {
    return this.homepageList.push(data);
  }

  editWiki(id, data) {
    return this.wikiList.update(id, data);
  }
  editCar(id, data) {
    return this.carList.update(id, data);
  }

  editHomepage(id, data) {
    console.log(this.homepageList);
    return this.homepageList.update(id, data);
  }
  editBank(id, data) {
    console.log(this.bankList);
    return this.bankList.update(id, data);
  }
  editAbout(id, data) {
    console.log(this.aboutList);
    return this.aboutList.update(id, data);
  }
  editAccount(id, data) {
    console.log(this.aboutAccountList);
    return this.aboutAccountList.update(id, data);
  }
  editLocationOnAboutUs(id, data) {
    console.log(this.aboutLocationList);
    return this.aboutLocationList.update(id, data);
  }
  editVideo(id, data) {
    console.log(this.videoList);
    return this.videoList.update(id, data);
  }
  editToken(id, data) {
    console.log('tokenList',this.tokenList);
    return this.tokenList.update(id, data);
  }

  editJob(id, data) {
    return this.jobList.update(id, data);
  }

  removeJob(id): void {
    this.jobList.remove(id);
  }
  removeWiki(id): void {
    this.wikiList.remove(id);
  }
  removPortolio(id): void {
    this.portolio.remove(id);
  }
  removService(id): void {
    this.serivce.remove(id);
  }
  removCartype1(id): void {
    this.carType1.remove(id);
  }
  removCartype2(id): void {
    this.carType2.remove(id);
  }
  removCartype3(id): void {
    this.carType3.remove(id);
  }


  loginWithFacebook(): Promise<any> {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }
}
