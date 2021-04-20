import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from "@angular/forms";

import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/Entry.service';

import { PrimeNGConfig } from 'primeng/api';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit{

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
    protected entryService: EntryService,
    protected config: PrimeNGConfig,
    protected categoryService: CategoryService, 
    protected injector: Injector
  ) { 
    super(injector, new Entry(), entryService, Entry.fromJson)
  }
  ngOnInit(): void {

    super.ngOnInit();
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


  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
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


  private loadCategoires() {

    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );

  }


  protected editionPageTitle(): string {
    const categoryName = this.resource.name || "";//if dont't have anything to show, will show ("")
    return "Editando Categoria: " + categoryName;
  }

  protected creationPageTitle(): string {
    return 'Cadastro de Nova Categoria';
  }
}
