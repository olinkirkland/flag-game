
import { Subject } from 'rxjs';

export interface WebSocketDispatch {
    type: string;
    payload?: any;
    rawEvent?: MessageEvent;
}

export default class WebSocketController {
    private static instance: WebSocketController | null = null;
    private subject: Subject<WebSocketDispatch> = new Subject<WebSocketDispatch>();
    private ws: WebSocket | null = null;

    private constructor() {}

    public static getInstance(): WebSocketController {
        return this.instance || (this.instance = new this());
    }

    public connect(url: string): Promise<WebSocket> {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(url);
            this.ws.onopen = () => {
                resolve(this.ws!);
            };
            this.ws.onerror = (error) => {
                reject(error);
            };
            this.ws.onmessage = (event) => {
                let data: any;
                try {
                    data = JSON.parse(event.data);
                } catch {
                    data = event.data;
                }
                this.dispatch({ type: 'message', payload: data, rawEvent: event });
            };
            this.ws.onclose = (event) => {
                this.dispatch({ type: 'close', payload: event });
            };
        });
    }

    private dispatch(d: WebSocketDispatch): void {
        this.subject.next(d);
    }

    public addEventListener(callback: (d: WebSocketDispatch) => void): void {
        this.subject.subscribe(callback);
    }

    public removeEventListener(): void {
        this.subject.unsubscribe();
    }

    public send(data: any): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
        }
    }

    public close(): void {
        this.ws?.close();
    }
}
