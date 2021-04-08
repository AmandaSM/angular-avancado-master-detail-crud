import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Entry } from '../shared/entry.model';

import toastr from "toastr";
import { EntryService } from '../shared/Entry.service';
import { PrimeNGConfig } from 'primeng/api';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string; //edit or create
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,//qtd de decimais
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private config: PrimeNGConfig,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {

    this.setCurrentAction();//action executing
    this.buildEntryForm();//construir form
    this.loadEntry();//carregar novamente a lista de categorias
    this.loadCategoires();

    //config locale calendar
    this.config.setTranslation({

      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
      monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
        'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      clear: 'Limpar'
    });

  }


  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {

    this.submittingForm = true;

    if (this.currentAction == "new") {

      this.createEntry();

    } else {

      //== "edit"
      this.updateEntry();
    }

  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }

  // Private Methods

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      //take content that is in the url [0] 
      // /entries/new
      this.currentAction = "new"
    } else {
      this.currentAction = "edit"
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry() {
    if (this.currentAction == "edit") {

      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get("id")))//take from url/route the value of id 
      )
        .subscribe(
          (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(entry)
          },
          (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
        )
    }
  }

  private loadCategoires() {

    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );

  }

  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = "Cadastro de Nova Lançamento"
    }
    else {
      const entryName = this.entry.name || "" //after content roda 1 vez, antes de carregar categoria 
      this.pageTitle = "Editando Lançamento: " + entryName;
    }
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);//take date of form and create a new Entry
    this.entryService.create(entry)
      .subscribe(
        entry => this.actionsForSucess(entry),
        error => this.actionsForError(error)
      )
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry)
      .subscribe(
        entry => this.actionsForSucess(entry),
        error => this.actionsForError(error)
      )
  }

  private actionsForSucess(entry: Entry) {
    toastr.success('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-sunglasses-fill" viewBox="0 0 16 16">    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM2.31 5.243A1 1 0 0 1 3.28 4H6a1 1 0 0 1 1 1v.116A4.22 4.22 0 0 1 8 5c.35 0 .69.04 1 .116V5a1 1 0 0 1 1-1h2.72a1 1 0 0 1 .97 1.243l-.311 1.242A2 2 0 0 1 11.439 8H11a2 2 0 0 1-1.994-1.839A2.99 2.99 0 0 0 8 6c-.393 0-.74.064-1.006.161A2 2 0 0 1 5 8h-.438a2 2 0 0 1-1.94-1.515L2.31 5.243zM4.969 9.75A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .866-.5z"/>  </svg>', 'Solicitação processada com sucesso!');
    // nomedosite.com/entries/new
    // nomedosite.com/entries/
    // nomedosite.com/entries/:id/edit

    //redirect/reload componenet page

    this.router.navigateByUrl("entries", { skipLocationChange: true })//don't show up in to the browser history
      .then(
        () => this.router.navigate(["entries", entry.id, "edit"])
      )
  }

  private actionsForError(error) {

    toastr.error('Ocorreu um erro ao processar a sua solicitação, <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-dizzy-fill ml-2" viewBox="0 0 16 16">    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM4.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM8 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>  </svg>');
    this.submittingForm = false;

    if (error.status === 422) {//error when server can´t save date
      this.serverErrorMessages = JSON.parse(error._body).errors; // return [strings]
    } else {
      //conection server error
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente novamente mais tarde."]
    }

  }
}
