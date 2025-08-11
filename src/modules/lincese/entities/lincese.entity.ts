import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
// import { Store } from './store.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity({ name: 'licenses' })
export class License {
    @PrimaryGeneratedColumn()
    license_id: number;

    @OneToOne(() => Store, (store) => store.license, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'store_id' })
    store: Store;

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'date' })
    end_date: Date;

    @Column({ type: 'enum', enum: ['activa', 'vencida', 'suspendida'], default: 'activa' })
    state: 'activa' | 'vencida' | 'suspendida';

    @Column({ type: 'enum', enum: ['mensual', 'anual'], default: 'mensual' })
    plan: 'mensual' | 'anual';
}



// export class Lincese {}
