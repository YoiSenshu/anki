    import { Routes } from '@angular/router';
    import { HomeComponent } from './components/home/home.component';
    import { WordsetComponent } from './components/wordset/wordset.component';
    import { WordsetEditComponent } from './components/wordset/wordset-edit/wordset-edit.component';
    import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';
import { WordsetLearnComponent } from './components/wordset/wordset-learn/wordset-learn.component';

    export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    {
        path: 'wordset',
        children: [
        {
            path: ':id', component: WordsetComponent
        },
        { 
            path: ':id/edit', 
            component: WordsetEditComponent,
            canDeactivate: [UnsavedChangesGuard]
        },
        { 
            path: ':id/learn', 
            component: WordsetLearnComponent
        }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
    ];
