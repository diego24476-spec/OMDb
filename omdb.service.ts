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

  getByType(search: string, type: string, year: string = ''): Observable<any> {
  let url = `${this.baseUrl}?s=${encodeURIComponent(search)}&apikey=${this.apiKey}`;
  
  if (type) {
    url += `&type=${type}`;
  }
  if (year) {
    url += `&y=${encodeURIComponent(year)}`;
  }
  
  return this.http.get(url);
}

  getMovies(search: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?s=${encodeURIComponent(search)}&type=movie&apikey=${this.apiKey}`);
  }

  getSeries(search: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?s=${encodeURIComponent(search)}&type=series&apikey=${this.apiKey}`);
  }

  getEpisodes(imdbId: string, season: number): Observable<any> {
    return this.http.get(`${this.baseUrl}?i=${imdbId}&season=${season}&apikey=${this.apiKey}`);
  }

  getById(imdbId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?i=${imdbId}&apikey=${this.apiKey}`);
  }
}
