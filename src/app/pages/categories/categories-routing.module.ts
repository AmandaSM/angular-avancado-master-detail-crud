import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';


const routes: Routes = [
  {path:'', component: CategoryListComponent},
  {path:'new', component: CategoryFormComponent},
  {path:':id/edit', component: CategoryFormComponent}
];
//nomesite.com/categories => list (master)
//nomesite.com/categories/ new => form (details)
//nomesite.com/categories/ {{id:}}/edit => form (details)
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }//requisição  da classe principal de rotas
