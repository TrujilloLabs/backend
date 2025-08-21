import { Repository } from "typeorm";
import { Subcategory } from "./entities/subcategory.entity";
import { CreateSubcategoryDto } from "./dto/create-subcategory.dto";



export class CreateSubcategoryFinder {
    constructor(
        private readonly subcategoryRepository: Repository<Subcategory>,
    ) { }

    async buildSubcategoryEntity(dto: CreateSubcategoryDto, storeId: string): Promise<Subcategory> {
        return this.subcategoryRepository.create({
            name: dto.name,
            store: storeId,
            isVisible: dto.isVisible ?? true,
        });
    }
}