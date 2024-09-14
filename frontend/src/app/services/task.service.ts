import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskAPIUrl = 'http://localhost:3000/api/task';

  constructor(private http: HttpClient) {}

  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.taskAPIUrl, task);
  }

  getAllTasks(): Observable<any> {
    return this.http.get(`${this.taskAPIUrl}/tasks`);
  }
}
