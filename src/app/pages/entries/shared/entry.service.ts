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
  constructor(protected injector: Injector, private categoryService: CategoryService) {

    super("api/entries", injector, Entry.fromJson)
  }


  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServe(entry, super.create.bind(this))
  }

  update(entry: Entry): Observable<Entry> {

    return this.setCategoryAndSendToServe(entry, super.update.bind(this))

  }

  private setCategoryAndSendToServe(entry: Entry, sendFn: any):Observable<any> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry)
      }),
      catchError(this.handleError)
    );

    //#region OBS
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
   //#endregion
  }

}

