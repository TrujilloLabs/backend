import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../auth/entities/role.entity';
import { seedRolesAndPermissions } from './seed-roles';

@Injectable()
export class SeedService {
    constructor(private readonly dataSource: DataSource) { }

    async executeSeed() {
        // Primero crear roles y permisos
        await seedRolesAndPermissions(this.dataSource);
        
        // Luego crear el SuperAdmin
        const userRepo = this.dataSource.getRepository(User);
        const roleRepo = this.dataSource.getRepository(Role);
        
        const existing = await userRepo.findOne({ where: { email: process.env.SUPERADMIN_EMAIL } });
        if (existing) return { message: 'SuperAdmin ya existe', email: existing.email };

        const superAdminRole = await roleRepo.findOne({ where: { name: 'Super Admin' } });
        if (!superAdminRole) throw new Error('Super Admin role not found');

        const hashed = await bcrypt.hash(
            process.env.SUPERADMIN_PASSWORD || 'admin123',
            parseInt(process.env.BCRYPT_SALT || '10')
        );
        
        const user = userRepo.create({
            name: 'Super Admin',
            email: process.env.SUPERADMIN_EMAIL || 'super@admin.local',
            password: hashed,
            role: superAdminRole,
        });
        
        await userRepo.save(user);
        return { message: 'SuperAdmin creado con roles y permisos', email: user.email };
    }

    // ...otros métodos...
}