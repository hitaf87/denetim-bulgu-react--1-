export interface ApplicationSettingsCategory {
    id: string;
    name: string;
    description?: string;
}
export class ApplicationSettingsCategoryClass {
    id: string;
    name: string;
    description?: string;
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
