import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiDataService {

  private dataSubject$ = new BehaviorSubject<any>('');
  data$: any = this.dataSubject$.asObservable();

  private url: String = "";

  constructor() { }

  setUrl(url: String) { this.url = url; }

  setData(data: any) { 
    this.dataSubject$.next(data);
    console.log(this.dataSubject$);
  }


}
