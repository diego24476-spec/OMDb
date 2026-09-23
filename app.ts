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
 
  currentPage: number = 1;
  totalResults: number = 0;
  get totalPages(): number {
    return Math.ceil(this.totalResults / 10); // OMDb devuelve 10 resultados por página
  }

  selectedMovie: any = null;

  onSearch(page: number = 1) {
    if (!this.searchQuery.trim()) return;

    this.currentPage = page;

    this.omdbService.searchMovies(this.searchQuery, page).subscribe({
      next: (data) => {
        if (data.Response === 'True') {
          this.movies = data.Search;
          this.totalResults = Number(data.totalResults);
          this.errorMessage = '';
        } else {
          this.movies = [];
          this.totalResults = 0;
          this.errorMessage = data.Error;
        }
      },
      error: (err) => {
        this.errorMessage = 'Ocurrió un error al consultar la API.';
        console.error(err);
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.onSearch(page);
  }

  verDetalles(imdbID: string) {
    this.omdbService.getMovieDetails(imdbID).subscribe({
      next: (data) => {
        if (data.Response === 'True') {
          this.selectedMovie = data;
        }
      },
      error: (err) => console.error(err)
    });
  }

  cerrarDetalles() {
    this.selectedMovie = null;
  }
}
