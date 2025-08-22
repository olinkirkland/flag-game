import { Subject } from 'rxjs';
import { ComponentOptions } from 'vue';

export interface TooltipDispatch {
    tooltip: ComponentOptions | null; // null means close
    tooltipConfig?: any;
}

export default class TooltipController {
    private static instance: TooltipController | null = null;
    private subject: Subject<TooltipDispatch> = new Subject<TooltipDispatch>();

    private constructor() {}

    public static getInstance(): TooltipController {
        return this.instance || (this.instance = new this());
    }

    private dispatch(d: TooltipDispatch): void {
        this.subject.next(d);
    }

    public static open(
        tooltip: ComponentOptions<any>,
        tooltipConfig?: any
    ): void {
        this.getInstance().dispatch({
            tooltip,
            tooltipConfig
        });
    }

    public static close(callback?: Function): void {
        this.getInstance().dispatch({ tooltip: null });
        if (callback) callback();
    }

    public addEventListener(callback: (d: TooltipDispatch) => void): void {
        this.subject.subscribe(callback);
    }

    public removeEventListener(): void {
        this.subject.unsubscribe();
    }
}
