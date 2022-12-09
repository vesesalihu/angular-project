import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { IProject } from './models/project.model';
import { Observable, tap } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private _getProjects = environment.siteBaseUrl + "projects";

  private demo_key = "test123";

  readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `${this.demo_key}`
  });

  readonly requestOptions = { headers: this.headers };

  private _refreshrequired = new Subject<void>();
  get RequiredRefresh() {
    return this._refreshrequired;
  }

  constructor(private _http: HttpClient) { }

  public getProjectsData() {
    return this._http.get<IProject[]>(this._getProjects, this.requestOptions);
  }

  public postProject(name: string) {
    var x = { 'name': name };
    return this._http.post<any>(this._getProjects, x, this.requestOptions).pipe(
      tap(() => {
        this.RequiredRefresh.next();
      })
    );;
  }

  public deleteProject(id: string): Observable<any> {
    return this._http.delete(`${this._getProjects}/${id}`, this.requestOptions);
  }

  public updateProject(id: string, name: string): Observable<any> {
    var x = { 'name': name };
    return this._http.put(`${this._getProjects}/${id}`, x, this.requestOptions).pipe(
      tap(() => {
        this.RequiredRefresh.next();
      })
    );;
  }
}
