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

  selectedSeries: any = null;
  seasons: number[] = [];
  selectedSeason: number = 1;
  episodes: any[] = [];
  loadingEpisodes: boolean = false;

  onSearch() {
    if (!this.searchQuery.trim()) return;

    this.selectedSeries = null;
    const yearString = this.searchYear ? this.searchYear.toString() : '';

    this.omdbService.getByType(this.searchQuery, this.selectedType, yearString).subscribe({
      next: (data: any) => {
        if (data.Response === 'True') {
          this.movies = data.Search;
          this.errorMessage = '';
        } else {
          this.movies = [];
          this.errorMessage = data.Error;
        }
      },
      error: (err: any) => {
        this.errorMessage = 'Ocurrió un error al consultar la API.';
        console.error(err);
      }
    });
  }

  selectSeries(series: any) {
    this.selectedSeries = series;
    this.omdbService.getById(series.imdbID).subscribe({
      next: (data: any) => {
        if (data.Response === 'True') {
          const totalSeasons = parseInt(data.totalSeasons, 10) || 1;
          this.seasons = Array.from({ length: totalSeasons }, (_, i) => i + 1);
          this.loadSeason(1);
        }
      },
      error: (err: any) => console.error(err)
    });
  }

  loadSeason(season: number) {
    this.selectedSeason = season;
    this.loadingEpisodes = true;
    
    this.omdbService.getEpisodes(this.selectedSeries.imdbID, season).subscribe({
      next: (data: any) => {
        this.loadingEpisodes = false;
        if (data.Response === 'True') {
          this.episodes = data.Episodes || [];
        } else {
          this.episodes = [];
        }
      },
      error: (err: any) => {
        this.loadingEpisodes = false;
        console.error(err);
      }
    });
  }

  backToSearch() {
    this.selectedSeries = null;
    this.episodes = [];
  }
}
