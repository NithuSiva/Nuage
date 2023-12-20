import { Routes } from '@angular/router';
import { CallApiComponent } from './call-api/call-api.component';
import { CommentsComponent } from './comments/comments.component';
import { PresentationComponent } from './presentation/presentation.component';

export const routes: Routes = [
  { path: '', component: PresentationComponent},
  { path: "recherche", component: CallApiComponent},
  { path: "comments", component: CommentsComponent}

];

