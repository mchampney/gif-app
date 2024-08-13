import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

@Injectable({ providedIn: 'root' })
export class GifsService {
  private _tagsHistory: string[] = [];
  public gifList: Gif[] = [];
  private apiUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'WsCRIsEo8chz74H4rZVYM1u1Zl7YlQJj';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag))
      this._tagsHistory = this.tagsHistory.filter((oldTag) => oldTag != tag);

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private loadLocalStorage() {
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    if (this.tagsHistory.length === 0) return;
    this.searchTag(this.tagsHistory[0]);
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 20)
      .set('q', tag);

    this.http
      .get<SearchResponse>(`${this.apiUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
      });
  }
}
