import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider
{
  data: any;

  constructor(public http: HttpClient){}

  load(value)
  {
    if(this.data)
    {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.http.get('https://opentdb.com/api.php?amount=5&difficulty='+value).subscribe(data => {
        this.data = data;
        resolve(this.data);
      });
    });
  }
}
