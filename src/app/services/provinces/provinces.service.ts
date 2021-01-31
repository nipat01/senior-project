import { Injectable } from '@angular/core';
import *  as  data from '../../../../province.json';

@Injectable({
  providedIn: 'root'
})
export class ProvincesService {
  products: any = data;
  // products;
  province;
  distict;
  subDistict;
  post;
  province3;
  distict3;
  subDistict3;
  post3;
  constructor() { }

  getCountry(province, distict, subDistict) {
    // console.log('getCountry');

    // console.log(province, distict, subDistict);
    // console.log(this.products);

    for (let index = 0; index < this.products.length; index++) {
      let pv = this.products[index];

      if (province == pv[0]) {
        // console.log('pv', pv);
        let objPv = pv
        for (let index2 = 0; index2 < pv[1].length; index2++) {

          let dt = pv[1][index2]
          if (distict == dt[0]) {
            // console.log('dt', dt);
            let objDt = dt
            // for (let index3 = 0; index3 < dt[1].length; index3++) {
            //   let sdt = dt[1][index3]
            //   if (subDistict == sdt[0])
            //     console.log('sdt', sdt);
            // }

            let objCountry = {
              pv: objPv,
              dt: objDt
            }
            // console.log('objCountry', objCountry);
            return objCountry
          }

        }
      }
      // console.log(province);
    }

  }

  searchProvince() {
    let products: any = data;
    this.products = products.default
    // console.log('products', this.products, 'province.default', this.province.default);
    // console.log('province', this.products);
    return this.products;
  }

  selectProvince(event) {
    // console.log('event', event);
    for (let index = 0; index < this.products.length; index++) {
      let pv = this.products[index];
      if (event == pv[0]) {
        let objCountry = {
          pv: pv,
          dt: ''
        }
        // console.log('objCountry', objCountry);
        return objCountry

      }

    }

  }

  selectDistict(province, distict) {
    for (let index = 0; index < this.products.length; index++) {
      let pv = this.products[index];
      if (province == pv[0]) {
        // console.log('pv', pv);

        for (let index2 = 0; index2 < pv[1].length; index2++) {

          let dt = pv[1][index2]
          // console.log('dt', distict, dt[0]);

          if (distict == dt[0]) {
            // console.log('dt', dt);
            let objCountry = {
              dt: dt
            }
            // console.log('objCountry', objCountry);
            return objCountry.dt


          }

        }

      }

    }
  }

  selectSubDistict(evnet, type) {
    // console.log(evnet.target.value.split(","));

    let event2 = evnet.target.value.split(",")
    let distict = event2[0];
    let index = event2[1];


    this.province[2] = this.subDistict[index][0]
    this.post = this.subDistict[index][1];

    console.log(this.province[2], this.post);

  }

}
