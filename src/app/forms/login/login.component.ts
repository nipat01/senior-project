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



import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
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
        this.auth.emailLogin(this.loginForm.value.email, this.loginForm.value.password)
        // this.auth.emailSignUp(this.userForm.value.emailSignup, this.userForm.value.passwordSignup)
    }
}