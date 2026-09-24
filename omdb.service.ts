import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class OmdbService {
  private http = inject(HttpClient);
  
  private apiUrl = environment.omdbApiUrl;
  private apiKey = environment.omdbApiKey;

  searchMovies(title: string, page: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('s', title)
      .set('page', page.toString())
      .set('apikey', this.apiKey);

    return this.http.get(this.apiUrl, { params });
  }

  getMovieByTitle(title: string): Observable<any> {
    const params = new HttpParams()
      .set('t', title)
      .set('plot', 'full')
      .set('apikey', this.apiKey);

    return this.http.get(this.apiUrl, { params });
  }

  getMovieDetails(imdbID: string): Observable<any> {
    const params = new HttpParams()
      .set('i', imdbID)
      .set('plot', 'full')
      .set('apikey', this.apiKey);

    return this.http.get(this.apiUrl, { params });
  }
}
