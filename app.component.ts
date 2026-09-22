import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OmdbService } from './services/omdb.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'omdb-app';
  
  // Variables para búsqueda
  searchTerm: string = '';
  searchType: 'movie' | 'series' = 'movie';
  results: any[] = [];
  loading: boolean = false;
  error: string = '';

  // Variables para episodios
  imdbId: string = '';
  season: number = 1;
  episodes: any[] = [];
  seasonData: any = null;

  constructor(private omdbService: OmdbService) {}

  buscar(): void {
    if (!this.searchTerm.trim()) return;

    this.loading = true;
    this.error = '';
    this.results = [];

    const obs = this.searchType === 'movie'
      ? this.omdbService.getMovies(this.searchTerm)
      : this.omdbService.getSeries(this.searchTerm);

    obs.subscribe({
      next: (data) => {
        this.loading = false;
        if (data.Response === 'True') {
          this.results = data.Search;
        } else {
          this.error = data.Error || 'Sin resultados';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al conectar con la API';
        console.error(err);
      }
    });
  }

  verEpisodios(): void {
    if (!this.imdbId.trim()) return;

    this.loading = true;
    this.error = '';
    this.episodes = [];
    this.seasonData = null;

    this.omdbService.getEpisodes(this.imdbId, this.season).subscribe({
      next: (data) => {
        this.loading = false;
        if (data.Response === 'True') {
          this.seasonData = data;
          this.episodes = data.Episodes || [];
        } else {
          this.error = data.Error || 'No se encontraron episodios';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al cargar episodios';
        console.error(err);
      }
    });
  }
}
