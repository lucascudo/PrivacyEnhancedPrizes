import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form:FormGroup;
  constructor(
    private fb:FormBuilder,
    private authService: AuthService,
    private router: Router) {

    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  login() {
    const val = this.form.value;
    if (val.email && val.password) {
      this.authService.getProfile().subscribe(res => console.log('profile:', res)); // Unauthorized
      this.authService.login(val.email, val.password).subscribe(() => {
        console.log(`User ${val.email} is logged in`);
        this.authService.getProfile().subscribe(res => console.log('profile:', res)); // Authorized
        this.router.navigateByUrl('/');
      });
    }
  }
}
