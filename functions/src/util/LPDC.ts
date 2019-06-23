import { BaseController } from "../controller/base_controller";

// Low-priority data cache
export class LPDC {
    async getOrQuery<T extends BaseController<T2>, T2>(id: string, query: (id:string)=>Promise<T>) {
        const data = (await query(id)) as T;
        await data.ensureDataExistInLocal();
        return data;
    }
    set<T>(c: BaseController<T>) {
        
    }
}

export var lpdc = new LPDC();