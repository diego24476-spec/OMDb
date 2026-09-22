import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {
  private apiKey = 'ff282712';
  private baseUrl = 'https://www.omdbapi.com/';

  constructor(private http: HttpClient) { }

  // Buscar por tipo ('' = todo, 'movie', 'series')
  getByType(search: string, type: string): Observable<any> {
    let url = `${this.baseUrl}?s=${search}&apikey=${this.apiKey}`;
    if (type) {
      url += `&type=${type}`;
    }
    return this.http.get(url);
  }

  getMovies(search: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?s=${search}&type=movie&apikey=${this.apiKey}`);
  }

  getSeries(search: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?s=${search}&type=series&apikey=${this.apiKey}`);
  }

  getEpisodes(imdbId: string, season: number): Observable<any> {
    return this.http.get(`${this.baseUrl}?i=${imdbId}&season=${season}&apikey=${this.apiKey}`);
  }

  getById(imdbId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?i=${imdbId}&apikey=${this.apiKey}`);
  }
}
