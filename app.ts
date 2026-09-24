import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OmdbService } from './services/omdb.service'; 

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
  searchYear: string | number = ''; 
  selectedType: string = '';
  movies: any[] = [];
  errorMessage: string = '';
  
  currentPage: number = 1;
  totalResults: number = 0;

  get totalPages(): number {
    return Math.ceil(this.totalResults / 10); 
  }

  selectedMovie: any = null;

  onSearch(page: number = 1): void {
    if (!this.searchQuery.trim()) return;

    this.currentPage = page;

    this.omdbService.searchMovies(this.searchQuery, page).subscribe({
      next: (data) => {
        if (data.Response === 'True') {
          this.movies = data.Search;
          this.totalResults = parseInt(data.totalResults, 10) || 0;
          this.errorMessage = '';
        } else {
          this.movies = [];
          this.totalResults = 0;
          this.errorMessage = data.Error || 'No se encontraron resultados.';
        }
      },
      error: (err) => {
        this.movies = [];
        this.totalResults = 0;
        this.errorMessage = 'Ocurrió un error al consultar la API.';
        console.error(err);
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.onSearch(page);
  }

  verDetalles(imdbID: string): void {
    if (!imdbID) return;

    this.omdbService.getMovieDetails(imdbID).subscribe({
      next: (data) => {
        if (data.Response === 'True') {
          this.selectedMovie = data;
        } else {
          console.error(data.Error);
        }
      },
      error: (err) => console.error(err)
    });
  }

  cerrarDetalles(): void {
    this.selectedMovie = null;
  }
}
