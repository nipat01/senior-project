import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase-service.service';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-wiki',
  templateUrl: './add-wiki.component.html',
  styleUrls: ['./add-wiki.component.css']
})
export class AddWikiComponent implements OnInit {

  wiki: any = {};
  title: string = "Add Wiki";
  id;

  //authen
  wikiForm: FormGroup;
  email: string;
  password: string;
  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.getWikiByKey(this.id);
      this.title = "Edit wiki";
    }

    //authen
    console.log('sign up');
    this.buildForm();

  }
  constructor(private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService) {
    // auth.getCurrentLoggedIn();
  }

  // addWiki(wikiForm) {
  onSubmit(wikiForm) {
    

    console.log(wikiForm);
    if (this.id) {
      this.firebaseService.editWiki(this.id, wikiForm.value).then(this.goToHome);
    } else {
      console.log(wikiForm);
      this.firebaseService.addWiki(wikiForm);
      this.auth.emailSignUp(this.wikiForm.value.email, this.wikiForm.value.password).then(this.goToHome)

    }

  }

  getWikiByKey(id) {
    this.firebaseService.getWiki(id).subscribe(data => {
      this.wiki = data;
    });
  }

  goToHome = () => {
    this.router.navigate(['/home']);

  }


  //authen
  buildForm(): void {
    this.wikiForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.pattern('^(?=.*[0–9])(?=.*[a-zA-Z])([a-zA-Z0–9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]),
      firstname: new FormControl,
      lastname: new FormControl,
      address: new FormControl,
      addressLat: new FormControl,
      addressLong: new FormControl,
      currentLat: new FormControl,
      currentLong: new FormControl,
      role: new FormControl,
      lineId: new FormControl,
      citizenId: new FormControl,
      phoneId: new FormControl,
      hireDate: new FormControl,
      status: new FormControl,
    });
  }

}
