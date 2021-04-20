import { Component } from '@angular/core';
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';
import { Entry } from '../shared/Entry.model';
import { EntryService } from '../shared/Entry.service';

@Component({
  selector: 'app-Entry-list',
  templateUrl: './Entry-list.component.html',
  styleUrls: ['./Entry-list.component.css']
})
export class EntryListComponent extends BaseResourceListComponent<Entry> {

  constructor(private entryService: EntryService) {
    super(entryService)
   }

}
