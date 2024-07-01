export interface ApplicationSettingModel {
    id: string;
    key: string;
    value: string;
    valueType: string;
    categoryId: string;
    isStatic: boolean;
}
export class ApplicationSettingsClass {
    id: string;
    key: string;
    value: string;
    valueType: string;
    categoryId: string;
    isStatic: boolean;
    constructor(id, key, value, valueType, categoryId, isStatic) {
        this.id = id;
        this.key = key;
        this.value = value;
        this.valueType = valueType;
        this.categoryId = categoryId;
        this.isStatic = isStatic;
    }
}
