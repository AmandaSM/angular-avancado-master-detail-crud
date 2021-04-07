import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesModule } from './pages/categories/categories.module';
import { EntriesModule } from './pages/entries/entries.module';

const routes: Routes = [
  {path: 'entries' , loadChildren: './pages/entries/entries.module#EntriesModule' },
  {path: 'categories', loadChildren: './pages/categories/categories.module#CategoriesModule' }


  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
