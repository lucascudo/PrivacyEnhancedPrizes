import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form:FormGroup;
  constructor(
    private fb:FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email'] && params['password']) {
        this.form.setValue({
          email: params['email'],
          password: params['password'],
        });
      }
    });
  }

  login() {
    const val = this.form.value;
    if (val.email && val.password) {
      this.authService.login(val.email, val.password).subscribe(() => {
        this.authService.getProfile().subscribe(res => console.log('profile:', res)); // Authorized
        this.router.navigateByUrl('/');
      });
    }
  }
}
