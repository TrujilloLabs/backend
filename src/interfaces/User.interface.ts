import { Role } from '../enums/user-role.enum';
import { Store } from '../modules/stores/entities/store.entity';

export interface IUser {
    user_id: string; // UUID generado
    name: string;
    email: string;
    password: string;
    telephone?: string;
    address?: string;
    registration_date: Date;
    role: Role;
    store?: Store;
    // access_token?: string;
}
