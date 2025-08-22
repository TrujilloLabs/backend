import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeInsert,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from 'src/modules/subcategories/entities/subcategory.entity';

const decimalToNumber = {
    to: (value?: number | null) => value,
    from: (value?: string | null) => (value != null ? Number(value) : null),
};

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @Column('decimal', {
        name: 'price_cop',
        precision: 10,
        scale: 2,
        transformer: decimalToNumber,
    })
    priceCop: number;

    @Column('decimal', {
        name: 'price_usd',
        precision: 10,
        scale: 2,
        nullable: true,
        transformer: decimalToNumber,
    })
    priceUsd?: number | null;

    @Column({ name: 'image_url', length: 500, nullable: true })
    imageUrl?: string;

    // Relación lógica con Store (solo guardamos el UUID, no hacemos join)
    @Column({ name: 'store_id', type: 'uuid' })
    storeId: string;

    // Relación física con Category
    @ManyToOne(() => Subcategory, (subcategory) => subcategory.products, { eager: true })
    @JoinColumn({ name: 'subcategory_id' })
    subcategory: Subcategory;

    //slug
    @Column({ length: 150, unique: true })
    slug: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    //delete
    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date;

    //insertar slug
    @BeforeInsert()
    async generateSlug() {
        if (!this.slug) {
            this.slug = this.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '')
                .substring(0, 150);
        }
    }
}
