import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
// import { User, UserRole } from '../modules/users/user.entity';
import { User, UserRole } from '../../modules/users/entities/user.entity';

export async function seedSuperAdmin(dataSource: DataSource) {
    const repo = dataSource.getRepository(User);
    const existing = await repo.findOne({ where: { email: process.env.SUPERADMIN_EMAIL } });
    if (existing) return;

    const hashed = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD || 'admin123', parseInt(process.env.BCRYPT_SALT || '10'));
    const user = repo.create({
        name: 'Super Admin',
        email: process.env.SUPERADMIN_EMAIL || 'super@admin.local',
        password: hashed,
        role: UserRole.SUPER_ADMIN,
    });
    await repo.save(user);
    console.log('SuperAdmin creado:', user.email);
}
