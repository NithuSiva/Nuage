import { Routes } from '@angular/router';
import { CallApiComponent } from './call-api/call-api.component';
import { CommentsComponent } from './comments/comments.component';

export const routes: Routes = [
  { path: "recherche", component: CallApiComponent},
  { path: "comments", component: CommentsComponent}

];

