import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../auth/entities/role.entity';

export async function seedSuperAdmin(dataSource: DataSource) {
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);
    
    const existing = await userRepo.findOne({ where: { email: process.env.SUPERADMIN_EMAIL } });
    if (existing) return;

    const superAdminRole = await roleRepo.findOne({ where: { name: 'Super Admin' } });
    if (!superAdminRole) {
        console.error('Super Admin role not found. Please run roles seeder first.');
        return;
    }

    const hashed = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD || 'admin123', parseInt(process.env.BCRYPT_SALT || '10'));
    const user = userRepo.create({
        name: 'Super Admin',
        email: process.env.SUPERADMIN_EMAIL || 'super@admin.local',
        password: hashed,
        registration_date: new Date(),
        role: superAdminRole,
    });
    await userRepo.save(user);
    console.log('SuperAdmin creado:', user.email);
}
