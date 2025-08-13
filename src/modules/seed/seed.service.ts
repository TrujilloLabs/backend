import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../users/enums/user-role.enum';

@Injectable()
export class SeedService {
    constructor(private readonly dataSource: DataSource) { }

    async executeSeed() {
        const repo = this.dataSource.getRepository(User);
        const existing = await repo.findOne({ where: { email: process.env.SUPERADMIN_EMAIL } });
        if (existing) return { message: 'SuperAdmin ya existe', email: existing.email };

        const hashed = await bcrypt.hash(
            process.env.SUPERADMIN_PASSWORD || 'admin123',
            parseInt(process.env.BCRYPT_SALT || '10')
        );
        const user = repo.create({
            name: 'Super Admin',
            email: process.env.SUPERADMIN_EMAIL || 'super@admin.local',
            password: hashed,
            role: Role.SUPER_ADMIN,
        });
        await repo.save(user);
        return { message: 'SuperAdmin creado', email: user.email };
    }

    // ...otros métodos...
}