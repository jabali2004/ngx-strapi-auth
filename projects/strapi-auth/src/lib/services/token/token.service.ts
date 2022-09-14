import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Token } from '../../types/models/Token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string;

  constructor() {}

  /**
   * Return token if given
   */
  public getToken(): string {
    if (!this.token) {
      this.token = sessionStorage.getItem('token') || null;

      return this.token;
    }

    return this.token;
  }

  /**
   * Set token variable and write token to local storage
   */
  public setToken(token: string): void {
    this.token = token;
    sessionStorage.setItem('token', token);
  }

  /**
   * Delete token in local storage
   */
  public deleteToken(): void {
    this.token = null;
    sessionStorage.removeItem('token');
  }

  /**
   * Decode token
   */
  private decodeToken(token: string): Token | void {
    try {
      return jwt_decode(token) as Token;
    } catch (error) {
      return;
    }
  }
}
