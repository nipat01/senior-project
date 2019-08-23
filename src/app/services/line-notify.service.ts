import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
type Headers = { [header: string]: string | string[] };

@Injectable({
    providedIn: 'root'
})
export class LineNotifyService {

    constructor(
        private httpClient: HttpClient,
    ) { }

    // postMessage(token: string, message: string): Observable<any> {
    postMessage(getmessage: string): Observable<any> {
        const url = 'https://notify-api.line.me/api/notify';
        const headers = new HttpHeaders({
            // 'url': 'https://notify-api.line.me/api/notify';
            'Access-Control-Allow-Origin' : 'https://notify-api.line.me',
            'Access-Control-Allow-Methods' : 'POST, GET, PUT, PATCH, DELETE, OPTIONS',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer UdN7DKK1OisfMWOEQaQsmtTTvspqFsGe7igVjKqxgR0',
        });
        const header = { headers: headers };
        const message = getmessage;
        console.log('url', url);
        console.log('body', { message: message });
        // console.log('options', options);

        return this.httpClient.post(url, { message: message }, header)
    }
}










// message = {
//     getMessage: '',
// }
