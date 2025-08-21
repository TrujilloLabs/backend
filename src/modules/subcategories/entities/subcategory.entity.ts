import { Category } from 'src/modules/categories/entities/category.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm'
@Entity({ name: 'subcategories' })
export class Subcategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150 })
    name: string;

    @Column({ default: true })
    isVisible: boolean;

    @ManyToOne(() => Category, (category) => category.subcategories, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @OneToMany(() => Product, (product) => product.subcategory)
    products: Product[];

    @Column({ name: 'store', type: 'uuid' })
    store: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}

