import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
// import { User } from '../users/user.entity';
import { User } from '../../users/entities/user.entity';
import { License } from '../../lincese/entities/lincese.entity';

@Entity({ name: 'stores' })
export class Store {
    @PrimaryGeneratedColumn()
    store_id: number;

    @Column({ length: 150 })
    name: string;

    @Column({ length: 500 })
    logo_url: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: ['activa', 'inactiva'], default: 'inactiva' })
    state: 'activa' | 'inactiva';

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creation_date: Date;

    @OneToMany(() => User, (u) => u.store)
    users: User[];

    @OneToOne(() => License, (l) => l.store, { cascade: true })
    license: License;
}


// export class Store {}
