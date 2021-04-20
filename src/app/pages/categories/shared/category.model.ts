import { BaseResourceModel } from "src/app/shared/models/base-resource.model";

export class Category extends BaseResourceModel {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string
    ) {
        super();//chama consturor
    }
    static fromJson(jsonData: any): Category {
        return Object.assign(new Category(), jsonData);//take date of form and create a new Entry
    }

}