import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";
import { ImageService } from '../../services/image/image.service';
@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {
  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;

  imageList: any[];//list
  rowIndexArray: any[];//list

  formTemplate = new FormGroup({
    imageUrl: new FormControl('', Validators.required),
    carId: new FormControl('', Validators.required),
    carType: new FormControl('', Validators.required),
    carModel: new FormControl('', Validators.required),
    purchaseDate: new FormControl('', Validators.required),
    lastMaintenance: new FormControl('', Validators.required),

  })

  // constructor() { }

  ngOnInit() {
    this.resetForm();
  }

  constructor(private db: AngularFireDatabase,
    private db11: AngularFirestore,
    private storage: AngularFireStorage,
    private service: ImageService) { }

  addCar(data: NgForm) {
    console.log(data.value);
    this.db.list("/car").push(data.value);
  }
  //รูป
  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }
    else {
      // this.imgSrc = '/assets/img/image_placeholder.jpg';
      // this.selectedImage = null;
    }
  }

  onSubmit(formValue) {
    this.isSubmitted = true;
    if (this.formTemplate.valid) {
      var filePath = `image/testJob/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            this.service.insertImageJob(formValue);
            this.resetForm();
          })
        })
      ).subscribe();
    }
  
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();

    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.selectedImage = null;
    this.isSubmitted = false;
  }


}
