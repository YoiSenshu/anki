import { Injectable, inject } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

export interface CanComponentDeactivate {
  hasUnsavedChanges: () => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  private dialog = inject(MatDialog);

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | boolean {
    if (!component.hasUnsavedChanges()) {
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Niezapisane zmiany',
        message: 'Czy na pewno chcesz wyjść bez zapisywania?'
      }
    });

    return dialogRef.afterClosed();
  }
} 