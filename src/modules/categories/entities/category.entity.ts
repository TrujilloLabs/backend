import { Product } from 'src/modules/product/entities/product.entity';
import { Store } from 'src/modules/stores/entities/store.entity';
import { Subcategory } from 'src/modules/subcategories/entities/subcategory.entity';
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

    @OneToMany(() => Subcategory, (subcategory) => subcategory.category, {
        cascade: true,
    })
    subcategories: Subcategory[];

    //storeId uuid
    @Column({ name: 'store', type: 'uuid' })
    store: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}

