import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from "rxjs/operators";

import { Entry } from './entry.model';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries";

  constructor(private http: HttpClient) { }

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
    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )

  }

  update(entry: Entry): Observable<Entry> {

    const url = `${this.apiPath}/${entry.id}`;

    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)//in memory database the post dont return nothing
    )
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
    const entries: Entry[] = [];
    jsonData.forEach(element => entries.push(element as Entry));
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return jsonData as Entry;
  }
  private handleError(error: any): Observable<any> {
    console.log("api",this.apiPath);

    console.log("ERROR NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}

