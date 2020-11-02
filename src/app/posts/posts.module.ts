import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CategorySectionComponent } from './category-section/category-section.component';
import { PostByCategoryComponent } from './post-by-category/post-by-category.component';
import { PostsByCreatorComponent } from './posts-by-creator/posts-by-creator.component';

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent,
    CategorySectionComponent,
    PostByCategoryComponent,
    PostsByCreatorComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})

export class PostsModule {}
