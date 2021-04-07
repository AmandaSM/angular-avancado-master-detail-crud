import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { Entry } from '../shared/Entry.model';
import { EntryService } from '../shared/Entry.service';

@Component({
  selector: 'app-Entry-list',
  templateUrl: './Entry-list.component.html',
  styleUrls: ['./Entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[]
  constructor(private entryService: EntryService) { }

  ngOnInit(): void {
    this.entryService.getAll().subscribe(
      entries => this.entries = entries,
      error => alert('Error ao carregar a lista')   
    )
  }

  deleteEntry(entry){
    const mustDelete = confirm('Deseja realmente excluir este item ');

    if(mustDelete){
    this.entryService.delete(entry.id).subscribe(
      ()=> this.entries = this.entries.filter(element => element != entry), // array  without the Entry that is deleted
      ()=>alert("Erro ao tentar excluir! ")
      )
    }
  }
}
