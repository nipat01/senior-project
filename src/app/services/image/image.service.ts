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
  getImageDetailAnimalList() {
    this.imageDetailList = this.firebase.list('imageDetails/imageDetailList/Animal');
  }
  getImageDetailVehicleList() {
    this.imageDetailList = this.firebase.list('imageDetails/imageDetailList/Vehicle');
  }
  getImageDetailBirdList() {
    this.imageDetailList = this.firebase.list('imageDetails/imageDetailList/Bird');
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
    if (imageDetails.category === 'Animal') {
      this.firebase.list('imageDetails/imageDetailList/Animal').push(imageDetails);
    } else if (imageDetails.category === 'Vehicle') {
      this.firebase.list('imageDetails/imageDetailList/Vehicle').push(imageDetails);
    } else if (imageDetails.category === 'Bird') {
      this.firebase.list('imageDetails/imageDetailList/Bird').push(imageDetails);
    }
  }
  insertImagePortfolioDetails(imageDetails) {
    this.imageDetaiPortfoliolList.push(imageDetails);
  }
  insertImageCartypeDetails(imageDetails) {
    this.imageDetaiCartypelList.push(imageDetails);
  }
  insertImageServiceDetails(imageDetails) {
    this.imageDetailServiceList.push(imageDetails);
  }
  insertImageJob(imageDetails) {
    // this.firebase.list('testcar').push(imageDetails);
    this.firebase.list("/car").push(imageDetails);
  }
}
