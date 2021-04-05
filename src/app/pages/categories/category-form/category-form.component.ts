import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';


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
  submittingaForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
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

  ///Private Methods

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
}
