import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {
  private http = inject(HttpClient);
  private apiUrl = 'https://www.omdbapi.com/';
  private apiKey = 'ff282712'; 

  searchMovies(title: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?s=${encodeURIComponent(title)}&apikey=${this.apiKey}`);
  }

  getMovieDetails(imdbID: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?i=${imdbID}&plot=full&apikey=${this.apiKey}`);
  }
}