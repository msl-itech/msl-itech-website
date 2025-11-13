import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OdooService {
  private apiUrl = environment.odooApiUrl;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-signature': environment.xSignature,
    'x-client-id': environment.xClientId
  });

  constructor(private http: HttpClient) { }

  createLead(leadData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leads`, leadData, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  createLeadWithFile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'x-signature': environment.xSignature,
      'x-client-id': environment.xClientId
    });

    return this.http.post(`${this.apiUrl}/leads`, formData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateLead(leadId: number, leadData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/leads/${leadId}`, leadData, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Une erreur s\'est produite:', error);
    return throwError(() => new Error(error.message || 'Erreur du serveur'));
  }
} 