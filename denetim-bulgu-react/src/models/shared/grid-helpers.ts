export class ActionIconModel {
    name: string;
    icon?: string;
    tooltip?: string;
    constructor(name: string, icon: string, tooltip: string) {
        this.name = name;
        this.icon = icon;
        this.tooltip = tooltip;
    }
}
export class PagedRequestOrderModel {
    orderBy: string;
    directionDesc: boolean;

    constructor(orderBy: string, directionDesc: boolean) {
        this.orderBy = orderBy;
        this.directionDesc = directionDesc;
    }
}

export class PagedRequestModel {
    pageIndex: number;
    pageSize: number;
    order: Array<PagedRequestOrderModel>;
    constructor(
        pageIndex: number,
        pageSize: number,
        order: Array<PagedRequestOrderModel>,
    ) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.order = order;
    }
}

export class PagedRequestSearchModel implements PagedRequestModel {
    pageIndex: number;
    pageSize: number;
    order: Array<PagedRequestOrderModel>;
    searchValue: string;

    constructor(
        pageIndex: number,
        pageSize: number,
        order: Array<PagedRequestOrderModel>,
        searchValue: string,
    ) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.order = order;
        this.searchValue = searchValue;
    }
}

export class GridSettingsModel implements IGridSettingsModel {
    constructor(
        pageIndex: number,
        pageSize: number,
        directionDesc: boolean,
        orderBy: string,
    ) {
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.directionDesc = directionDesc;
        this.orderBy = orderBy;
    }
    pageIndex: number;
    pageSize: number;
    directionDesc: boolean;
    orderBy: string;
}

export interface IGridSettingsModel {
    pageIndex: number;
    pageSize: number;
    directionDesc: boolean;
    orderBy: string;
}

export const GetRequestQueryString = (
    requestModel: PagedRequestModel,
): string => {
    // eslint-disable-next-line prettier/prettier
    let queryString =
        'PageIndex=' +
        requestModel.pageIndex +
        '&PageSize=' +
        requestModel.pageSize;

    if (requestModel.order) {
        requestModel.order.forEach((item, i) => {
            queryString +=
                // eslint-disable-next-line prettier/prettier
                '&Orders[' +
                i +
                '].ColumnName=' +
                item.orderBy +
                '&Orders[' +
                i +
                '].DirectionDesc=' +
                item.directionDesc;
        });
    }
    return queryString;
};
