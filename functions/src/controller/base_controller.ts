import { DocumentReference } from "@google-cloud/firestore";

export class BaseController<T> {
    public data?: T;

    public get id() { return this.ref.id; }

    constructor(protected ref: DocumentReference, 
        data?: any) {
        this.data = data;
    }

    async delete() {
        await this.ref.delete();
    }

    async ensureDataExistInLocal() {
        if (this.data) return;
        this.data = (await this.ref.get()).data() as any;
    }
}