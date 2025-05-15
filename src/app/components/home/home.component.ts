import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WordsetListComponent } from '../wordset-list/wordset-list.component';
import { WordsetService } from '../../services/wordset.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, WordsetListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private wordsetService: WordsetService,
    private router: Router
  ) {}

  createWordset(): void {
    this.wordsetService.createEmpty().subscribe(wordset => {
      this.router.navigate(['/wordset', wordset.id, 'edit']);
    });
  }
} 