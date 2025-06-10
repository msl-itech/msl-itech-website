import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Lead {
  id?: number;
  name: string;
  email_from: string;
  phone: string;
  partner_name: string;
  stage_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiOdooService {

  private readonly apiUrl = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) { }

  
  /**
   * Crée un nouveau lead
   * @param leadData Les données du lead à créer
   * @returns Observable<Lead>
   */
  createLead(leadData: Partial<Lead>): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl, leadData);
  }

  /**
   * Récupère tous les leads
   * @returns Observable<Lead[]>
   */
  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiUrl);
  }
}
