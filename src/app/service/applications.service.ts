import { Injectable } from '@angular/core';

export interface Application {
  id: number;
  img: string;
  title: string;
  component: any;
}


@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private Applications: Application[] = []

  constructor() { }

  addApp(app: Application) {
    this.Applications.push(app)
  }

  getApps(): Application[] {
    return this.Applications
  }



}
