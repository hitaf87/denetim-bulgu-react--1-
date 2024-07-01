export interface FilterModel {
    startDate: string;
    endDate: string;
}

export class FilterModel {
    startDate: string;
    endDate: string;
    constructor(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}