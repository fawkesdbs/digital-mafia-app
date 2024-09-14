import { Injectable } from '@angular/core';
import { gapi } from 'gapi-script';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private clientId = '614257370060-4nk9tssa768onb8u28ccen9ri26borou.apps.googleusercontent.com'; // Replace with your Google OAuth 2.0 Client ID

  constructor() {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: this.clientId,
        scope: 'profile email',
      }).then(() => {
        console.log('Google Auth initialized');
      }).catch((error: any) => {
        console.error('Google Auth initialization error:', error);
      });
    });
  }

  signIn(): Promise<void> {
    return new Promise((resolve, reject) => {
      const auth2 = gapi.auth2.getAuthInstance();
      if (!auth2) {
        console.error('Google Auth instance not available');
        reject(new Error('Google Auth instance not available'));
        return;
      }
      auth2.signIn().then(
        () => {
          console.log('User signed in');
          resolve();
        },
        (error: any) => {
          console.error('Sign-in error:', error);
          reject(error);
        }
      );
    });
  }

  signOut(): void {
    const auth2 = gapi.auth2.getAuthInstance();
    if (auth2) {
      auth2.signOut();
      console.log('User signed out');
    } else {
      console.error('Google Auth instance not available');
    }
  }

  getAuthToken(): string | null {
    const auth2 = gapi.auth2.getAuthInstance();
    if (auth2) {
      const user = auth2.currentUser.get();
      return user.isSignedIn() ? user.getAuthResponse().access_token : null;
    }
    console.error('Google Auth instance not available');
    return null;
  }
}
