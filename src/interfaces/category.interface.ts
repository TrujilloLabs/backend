



export interface ICategory {
    id: string;
    name: string;
    isVisible: boolean;

    // Relación recursiva: opcional para evitar ciclos infinitos al serializar.
    parentCategory?: ICategory;

    // Arreglo de subcategorías.
    subcategories: ICategory[];

    // ID de la tienda a la que pertenece la categoría.
    store: string;

    createdAt: Date;
    updatedAt: Date;
}