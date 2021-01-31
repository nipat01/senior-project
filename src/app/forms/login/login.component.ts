// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }



import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnChanges {

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('button', changes.color.currentValue);
    const button = document.querySelector('button');
    // nav.classList.replace('bg-header', 'warning');
    console.log(button.className)
  }

  loginForm: FormGroup;

  get color() {
    return AppComponent.COLOR ? AppComponent.COLOR : AppComponent.DEFAULTCOLOR;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    auth.getCurrentLoggedIn();
  }
  ngOnInit() {
    this.buildForm();
  }
  buildForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.pattern('^(?=.*[0–9])(?=.*[a-zA-Z])([a-zA-Z0–9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ])
    });
  }
  login(): void {
    console.log(this.loginForm.value.email + this.loginForm.value.password)
    if (this.loginForm.value.email && this.loginForm.value.password) {
      this.auth.emailLogin(this.loginForm.value.email, this.loginForm.value.password)
    }
    else window.alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    // this.auth.emailSignUp(this.userForm.value.emailSignup, this.userForm.value.passwordSignup)
  }
}
