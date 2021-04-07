import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import toastr from "toastr";
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string; //edit or create
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMensages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    
    this.setCurrentAction();//action executing
    this.buildCategoryForm();//construir form
    this.loadCategory();//carregar novamente a lista de categorias
  }

  ngAfterContentChecked() {

    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == "new") {
      this.createCategory();
    } else {//== "edit"
      this.updateCategory();
    }
  }

  // Private Methods

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      //take content that is in the url [0] 
      // /categories/new
      this.currentAction = "new"
    } else {
      this.currentAction = "edit"
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  private loadCategory() {
    if (this.currentAction == "edit") {

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))//take from url/route the value of id 
      )
        .subscribe(
          (category) => {
            this.category = category;
            this.categoryForm.patchValue(category)
          },
          (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
        )
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = "Cadastro de Nova Categoria"
    }
    else {
      const categoryName = this.category.name || "" //after content roda 1 vez, antes de carregar categoria 
      this.pageTitle = "Editando Categoria: " + categoryName;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);//take date of form and create a new Category
    this.categoryService.create(category)
      .subscribe(
        category => this.actionsForSucess(category),
        error => this.actionsForError(error)
      )
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category)
    .subscribe(
      category => this.actionsForSucess(category),
      error => this.actionsForError(error)
    )
  }

  private actionsForSucess(category: Category) {
    toastr.success('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-sunglasses-fill" viewBox="0 0 16 16">    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM2.31 5.243A1 1 0 0 1 3.28 4H6a1 1 0 0 1 1 1v.116A4.22 4.22 0 0 1 8 5c.35 0 .69.04 1 .116V5a1 1 0 0 1 1-1h2.72a1 1 0 0 1 .97 1.243l-.311 1.242A2 2 0 0 1 11.439 8H11a2 2 0 0 1-1.994-1.839A2.99 2.99 0 0 0 8 6c-.393 0-.74.064-1.006.161A2 2 0 0 1 5 8h-.438a2 2 0 0 1-1.94-1.515L2.31 5.243zM4.969 9.75A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .866-.5z"/>  </svg>','Solicitação processada com sucesso!');
    // nomedosite.com/categories/new
    // nomedosite.com/categories/
    // nomedosite.com/categories/:id/edit

    //redirect/reload componenet page

    this.router.navigateByUrl("categories", { skipLocationChange: true })//don't show up in to the browser history
      .then(
        () => this.router.navigate(["categories", category.id, "edit"])
      )
  }

  private actionsForError(error) {

    toastr.error("Ocorreu um erro ao processar a sua solicitação");
    this.submittingForm = false;

    if (error.status === 422) {//error when server can´t save date
      this.serverErrorMensages = JSON.parse(error._body).errors; // return [strings]
    }else{
      //conection server error
      this.serverErrorMensages = ["Falha na comunicação com o servidor. Por favor, tente novamente mais tarde."]
    }

  }
}
