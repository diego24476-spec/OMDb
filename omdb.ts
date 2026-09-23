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

 searchMovies(title: string, page: number = 1): Observable<any> {
    return this.http.get(
      `${this.apiUrl}?s=${encodeURIComponent(title)}&page=${page}&apikey=${this.apiKey}`
    );
  }

  getMovieByTitle(title: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}?t=${encodeURIComponent(title)}&plot=full&apikey=${this.apiKey}`
    );
  }

  getMovieDetails(imdbID: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}?i=${imdbID}&plot=full&apikey=${this.apiKey}`
    );
  }
}
