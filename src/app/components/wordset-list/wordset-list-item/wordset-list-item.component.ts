import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Wordset } from '../../../models/wordset.model';

@Component({
  selector: 'app-wordset-list-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wordset-list-item.component.html',
  styleUrls: ['./wordset-list-item.component.css']
})
export class WordsetListItemComponent {
  @Input() wordset!: Wordset;
} 