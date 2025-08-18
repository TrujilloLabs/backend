import { Product } from 'src/modules/product/entities/product.entity';
import { Store } from 'src/modules/stores/entities/store.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    DeleteDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150 })
    name: string;

    @Column({ default: true })
    isVisible: boolean;

    // Relación recursiva: categoría puede tener subcategorías
    @ManyToOne(() => Category, (category) => category.subcategories, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    parentCategory: Category;

    @OneToMany(() => Category, (category) => category.parentCategory)
    subcategories: Category[];

    //storeId uuid
    @Column({ name: 'store', type: 'uuid' })
    store: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}

