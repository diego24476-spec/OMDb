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
  selectedType: string = '';
  movies: any[] = [];
  errorMessage: string = '';
  
  currentPage: number = 1;
  totalResults: number = 0;

  selectedSeries: any = null;
  seasons: number[] = [];
  episodes: any[] = [];
  selectedSeason: number = 1;
  loadingEpisodes: boolean = false;

  onSearch() {
    if (!this.searchQuery.trim()) return;

    this.selectedSeries = null;
    this.episodes = [];

    this.omdbService.getByType(this.searchQuery, this.selectedType).subscribe({
      next: (data: any) => {
        console.log('RESULTADOS BÚSQUEDA:', data);
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
        console.error('ERROR BÚSQUEDA:', err);
        this.errorMessage = 'Ocurrió un error al consultar la API.';
      }
    });
  }

    selectSeries(series: any) {
    this.selectedSeries = series;
    this.loadingEpisodes = true;
    this.errorMessage = '';

    this.omdbService.getById(series.imdbID).subscribe({
      next: (data: any) => {
        let totalSeasons = 1;
        if (data && data.Response === 'True' && data.totalSeasons) {
          totalSeasons = parseInt(data.totalSeasons, 10) || 1;
        }
        this.seasons = Array.from({ length: totalSeasons }, (_, i) => i + 1);
        this.loadSeason(1);
      },
      error: () => {
        // Si falla la consulta de detalles, igual abrimos la temporada 1
        this.seasons = [];
        this.loadSeason(1);
      }
    });
  }

  loadSeason(seasonNum: number) {
    this.selectedSeason = seasonNum;
    this.loadingEpisodes = true;

    this.omdbService.getEpisodes(this.selectedSeries.imdbID, seasonNum).subscribe({
      next: (data: any) => {
        if (data && data.Response === 'True') {
          this.episodes = data.Episodes || [];
          this.errorMessage = '';
        } else {
          this.episodes = [];
          this.errorMessage = data?.Error || 'No se pudieron cargar los episodios de la API.';
        }
        this.loadingEpisodes = false; // <--- ESTO QUITA EL CARGANDO SÍ O SÍ
      },
      error: () => {
        this.episodes = [];
        this.errorMessage = 'Error de conexión con la API de OMDb.';
        this.loadingEpisodes = false; // <--- ESTO QUITA EL CARGANDO SÍ O SÍ
      }
    });
  }


  backToSearch() {
    this.selectedSeries = null;
    this.episodes = [];
    this.seasons = [];
    this.errorMessage = '';
  }
}
