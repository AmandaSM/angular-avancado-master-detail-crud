import { Injectable, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from "rxjs/operators";
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})


export class EntryService extends BaseResourceService<Entry>{


  /*
    Don't need import CategoryService if you are not using in-memomory-database  
  */
  constructor( protected injector: Injector, private categoryService: CategoryService) { 

      super("api/entries", injector,Entry.fromJson)
  }


  create(entry: Entry): Observable<Entry> {

    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {       

        entry.category = category;

       return super.create(entry);

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
   
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {

        entry.category = category;

       return super.update(entry);

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

  //protected METHODS

  protected jsonDataToResources(jsonData: any[]): Entry[] {

    console.log(jsonData[0] as Entry);
    console.log(Object.assign(new Entry(), jsonData[0]));

    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry: Entry =Entry.fromJson(element);

      entries.push(entry);
    })

    return entries;
  }

  protected jsonDataToResource(jsonData: any): Entry {
    return Entry.fromJson(jsonData);
  }

}

