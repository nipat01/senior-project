import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageDetailList: AngularFireList<any>;
  imageDetaiPortfoliolList: AngularFireList<any>;
  imageDetaiCartypelList: AngularFireList<any>;
  imageDetailServiceList: AngularFireList<any>;
  imageJobList: AngularFireList<any>;
  constructor(private firebase: AngularFireDatabase) { }

  getImageDetailList() {
    this.imageDetailList = this.firebase.list('imageDetails/imageDetailList');
  }
  getImageDetailCarType1() {
    this.imageDetailList = this.firebase.list('imageDetails/imageDetailList/type1');
  }
  getImageDetailCarType2() {
    this.imageDetailList = this.firebase.list('imageDetails/imageDetailList/type2');
  }
  getImageDetailCarType3() {
    this.imageDetailList = this.firebase.list('imageDetails/imageDetailList/type3');
  }
  getImageDetailPortfolioList() {
    this.imageDetaiPortfoliolList = this.firebase.list('imageDetails/imageDetailPortfolioList');
  }
  getImageDetailCartypefolioList() {
    this.imageDetaiCartypelList = this.firebase.list('imageDetails/imageDetailCartypelList');
  }
  getImageDetailServiceList() {
    this.imageDetailServiceList = this.firebase.list('imageDetails/imageDetailServicelList');
  }
  getImageDetailJobList() {
    this.imageJobList = this.firebase.list('testcar');
  }

  insertImageDetails(imageDetails) {
    if (imageDetails.category === 'type1') {
      this.firebase.list('imageDetails/imageDetailList/type1').push(imageDetails);
    } else if (imageDetails.category === 'type2') {
      this.firebase.list('imageDetails/imageDetailList/type2').push(imageDetails);
    } else if (imageDetails.category === 'type3') {
      this.firebase.list('imageDetails/imageDetailList/type3').push(imageDetails);
    }
  }

  insertImagePortfolioDetails(imageDetails) {
    console.log(imageDetails);

    this.firebase.list('imageDetails/imageDetailPortfolioList').push(imageDetails)
  }
  insertImageCartypeDetails(imageDetails) {
    this.imageDetaiCartypelList.push(imageDetails);
  }
  insertImageServiceDetails(imageDetails) {
    this.firebase.list('imageDetails/imageDetailServicelList').push(imageDetails);
  }
  insertCar(imageDetails) {
    // this.firebase.list('testcar').push(imageDetails);
    this.firebase.list("/car").push(imageDetails);
  }
  creatWikis(dataWikis) {
    // this.firebase.list('testcar').push(imageDetails);
    this.firebase.list("/wikis").push(dataWikis);
  }
}
