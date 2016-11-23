export class Calendar {
    days: Array<any>;
    period: { month: string, year: string };
    title: string;

    constructor() {
        this.days = [];
        this.period = { month: '', year: '' };
        this.title = '';
    }
}
