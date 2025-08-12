
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { Role } from '../enums/user-role.enum';


@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: number;

    @Column({ length: 250 })
    name: string;

    @Column({ length: 200, unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ length: 15, nullable: true })
    telephone?: string;

    @Column({ length: 100, nullable: true })
    address: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    registration_date: Date;

    //role no defecto
    @Column({ type: 'enum', enum: Role })
    role: Role;

    // Cliente y admin_tienda deben tener store obligatorio
    @ManyToOne(() => Store, (store) => store.users, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'store_id' })
    store?: Store;
}





// export class User {}
