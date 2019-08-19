import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
        const headers: Headers = {
            // 'url': 'https://notify-api.line.me/api/notify';
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer UdN7DKK1OisfMWOEQaQsmtTTvspqFsGe7igVjKqxgR0'
        };
        const options = { headers };
        const message =  getmessage ;

        return this.httpClient.post(url, {message}, options);
    }
}










// message = {
//     getMessage: '',
// }
