import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './Pages/layout/layout.component';
import { InnerLayoutComponent } from './Pages/inner-layout/inner-layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
  },
  {
    path: '',
    component: InnerLayoutComponent,
    loadChildren: () =>
      import('./Pages/inner-layout/inner-layout.module').then(
        (m) => m.InnerLayoutModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
