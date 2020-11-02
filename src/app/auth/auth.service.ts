import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private postCreator: string;
  private postCreatorName: string;
  private postCreatorOccupation: string;
  private postCreatorCompany: string;
  private authenticatedUser: any = {};
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getPostCreator() {
    return this.postCreator;
  }

  getPostCreatorName() {
    return this.postCreatorName;
  }

  getPostCreatorOccupation() {
    return this.postCreatorOccupation;
  }

  getPostCreatorCompany() {
    return this.postCreatorCompany;
  }

  getAuthenticatedUser() {
    return this.authenticatedUser;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    occupation: string,
    company: string
  ) {
    const authData: AuthData = {
      email,
      password,
      firstName,
      lastName,
      occupation,
      company,
    };
    this.http.post(BACKEND_URL + 'signup', authData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        email: string;
        lastName: string;
        firstName: string;
        occupation: string;
        company: string;
      }>(BACKEND_URL + 'login', authData)
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authenticatedUser.firstName = response.firstName;
            this.authenticatedUser.lastName = response.lastName;
            this.authenticatedUser.occupation = response.occupation;
            this.authenticatedUser.company = response.company;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(
              token,
              expirationDate,
              this.userId,
              this.authenticatedUser.firstName,
              this.authenticatedUser.lastName,
              this.authenticatedUser.occupation,
              this.authenticatedUser.company
            );
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  confirmEmail(token) {
    return this.http
      .post(BACKEND_URL + 'confirmation', { token });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.authenticatedUser.firstName = authInformation.firstName;
      this.authenticatedUser.lastName = authInformation.lastName;
      this.authenticatedUser.occupation = authInformation.occupation;
      this.authenticatedUser.company = authInformation.company;
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    firstName: string,
    lastName: string,
    occupation: string,
    company: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('occupation', occupation);
    localStorage.setItem('company', company);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('occupation');
    localStorage.removeItem('company');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const occupation = localStorage.getItem('occupation');
    const company = localStorage.getItem('company');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      firstName,
      lastName,
      occupation,
      company,
    };
  }

  sendEmail(data) {
    return this.http.post(BACKEND_URL + 'sendEmail', data);
  }
}
