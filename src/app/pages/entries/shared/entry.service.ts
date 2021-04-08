import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from "rxjs/operators";

import { Entry } from './entry.model';
import { element } from 'protractor';
import { CategoryService } from '../../categories/shared/category.service';

@Injectable({
  providedIn: 'root'
})


export class EntryService {

  private apiPath: string = "api/entries";

  /*
    Don't need import CategoryService if you are not using in-memomory-database  
  */
  constructor(private http: HttpClient, private categoryService: CategoryService) { }

  getAll(): Observable<Entry[]> {

    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)//return api
    )

  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: Entry): Observable<Entry> {

    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {       

        entry.category = category;
        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        )

      })
    )

    /*in memory - database limitation 
    
      [ entry.category ]

      don´t relly have the value of category, just show in the screen the value 
      so when save the new entry that was created
    
      [ entry.category -> null ]
    
      and then don´t work the edit and delet button 
      just the code bellow already make the method work in others api

      [
        return this.http.post(this.apiPath, entry).pipe(
            catchError(this.handleError),
            map(this.jsonDataToEntry)

        )
      ]
    */
  }

  update(entry: Entry): Observable<Entry> {

    const url = `${this.apiPath}/${entry.id}`;    
   
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {

        entry.category = category;

        return this.http.put(url, entry).pipe(
          catchError(this.handleError),
          map(() => entry)//in memory database the post dont return nothing
        )

      })
    )
    
    /* 
    Just these code work in a real API
      [
        return this.http.put(url, entry).pipe(
          catchError(this.handleError)        
        )        
      ]
    */
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    console.log(url);
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  //PRIVATE METHODS

  private jsonDataToEntries(jsonData: any[]): Entry[] {

    console.log(jsonData[0] as Entry);
    console.log(Object.assign(new Entry(), jsonData[0]));

    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element);
      entries.push(entry);
    })

    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }
  private handleError(error: any): Observable<any> {
    console.log("api", this.apiPath);

    console.log("ERROR NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}

