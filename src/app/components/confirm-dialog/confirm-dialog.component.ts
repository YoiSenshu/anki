import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Anuluj</button>
      <button mat-button color="warn" (click)="onYesClick()">Wyjdź</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      margin: 20px 0;
    }
    mat-dialog-actions {
      padding: 8px 0;
    }
  `]
})
export class ConfirmDialogComponent {
  dialogRef = inject(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
} 