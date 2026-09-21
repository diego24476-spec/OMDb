import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OmdbService } from './services/omdb';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private omdbService = inject(OmdbService);

  searchQuery: string = '';
  movies: any[] = [];
  errorMessage: string = '';

  onSearch() {
    if (!this.searchQuery.trim()) return;

    this.omdbService.searchMovies(this.searchQuery).subscribe({
      next: (data) => {
        if (data.Response === 'True') {
          this.movies = data.Search;
          this.errorMessage = '';
        } else {
          this.movies = [];
          this.errorMessage = data.Error;
        }
      },
      error: (err) => {
        this.errorMessage = 'Ocurrió un error al consultar la API.';
        console.error(err);
      }
    });
  }
}