import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OdooService {
  // Utiliser l'endpoint local qui gère la validation reCAPTCHA
  private apiUrl = '/api';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  createLead(leadData: any): Observable<any> {
    // L'endpoint local /api/leads gère la validation reCAPTCHA et transfère à Odoo
    return this.http.post(`${this.apiUrl}/leads`, leadData, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  createLeadWithFile(formData: FormData): Observable<any> {
    // Pas besoin de headers spécifiques, l'endpoint local gère tout
    return this.http.post(`${this.apiUrl}/leads`, formData)
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