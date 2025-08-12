import { AuthStore } from "./auth-store.interface";


export interface RequestWithUser extends Request {
    store: AuthStore;
}