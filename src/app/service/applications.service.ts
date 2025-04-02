import { Injectable } from '@angular/core';

interface App {
  img: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private Apps = []


  constructor() { }


}
