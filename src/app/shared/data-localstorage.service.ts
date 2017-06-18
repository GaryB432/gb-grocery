import { Injectable } from '@angular/core';

@Injectable()
export class DataLocalstorageService {

  public getItem(key: string): any {
    return localStorage.getItem(key);
  }
  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  public setItem(key: string, data: string): void {
    localStorage.setItem(key, data);
  }

}
