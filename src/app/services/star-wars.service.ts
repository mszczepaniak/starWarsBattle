import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, StarWarsItem } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class StarWarsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRandomItem(resource: string): Observable<StarWarsItem> {
    const id = Math.floor(Math.random() * 100) + 1;
    return this.http
      .get<ApiResponse<StarWarsItem>>(`${this.baseUrl}/${resource}/${id}`)
      .pipe(map((response) => response.result.properties));
  }
}
