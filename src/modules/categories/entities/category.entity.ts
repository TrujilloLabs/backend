import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 150, unique: true })
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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

