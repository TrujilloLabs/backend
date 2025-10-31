import { DataSource } from 'typeorm';
import { Role } from '../auth/entities/role.entity';
import { Permission } from '../auth/entities/permission.entity';

export const seedRolesAndPermissions = async (dataSource: DataSource) => {
    const permissionRepository = dataSource.getRepository(Permission);
    const roleRepository = dataSource.getRepository(Role);

    // Crear permisos basados en el dashboard
    const permissions = [
        { name: 'dashboard:read', description: 'View dashboard' },
        { name: 'reports:read', description: 'View reports' },
        { name: 'orders:read', description: 'View orders' },
        { name: 'orders:update', description: 'Update orders' },
        { name: 'products:read', description: 'View products' },
        { name: 'products:create', description: 'Create products' },
        { name: 'products:update', description: 'Update products' },
        { name: 'products:delete', description: 'Delete products' },
        { name: 'categories:read', description: 'View categories' },
        { name: 'categories:create', description: 'Create categories' },
        { name: 'inventory:read', description: 'View inventory' },
        { name: 'inventory:update', description: 'Update inventory' },
        { name: 'purchaseOrders:read', description: 'View purchase orders' },
        { name: 'purchaseOrders:create', description: 'Create purchase orders' },
        { name: 'purchaseOrders:update', description: 'Update purchase orders' },
        { name: 'customers:read', description: 'View customers' },
        { name: 'notifications:read', description: 'View notifications' },
        { name: 'notifications:create', description: 'Create notifications' },
        { name: 'settings:read', description: 'View settings' },
        { name: 'settings:update', description: 'Update settings' },
        { name: 'roles:read', description: 'View roles' },
        { name: 'roles:manage_admins', description: 'Manage admin users' },
        { name: 'roles:manage_employees', description: 'Manage employee users' },
    ];

    // Crear permisos si no existen
    const createdPermissions: Permission[] = [];
    for (const permData of permissions) {
        let permission = await permissionRepository.findOne({ where: { name: permData.name } });
        if (!permission) {
            permission = permissionRepository.create(permData);
            permission = await permissionRepository.save(permission);
        }
        createdPermissions.push(permission);
    }

    // Crear roles
    const allPermissions = createdPermissions;
    const superAdminPermissions = allPermissions.filter(p => p.name !== 'roles:manage_employees');
    const storeAdminPermissions = allPermissions.filter(p => 
        !p.name.includes('roles:manage_admins')
    );
    const sellerPermissions = allPermissions.filter(p => 
        ['orders:read', 'products:read', 'customers:read'].includes(p.name)
    );

    const roles = [
        { name: 'Super Admin', description: 'Full system access', permissions: superAdminPermissions },
        { name: 'Store Admin', description: 'Store management access', permissions: storeAdminPermissions },
        { name: 'Seller', description: 'Basic sales access', permissions: sellerPermissions },
    ];

    for (const roleData of roles) {
        let role = await roleRepository.findOne({ where: { name: roleData.name } });
        if (!role) {
            role = roleRepository.create({
                name: roleData.name,
                description: roleData.description,
                permissions: roleData.permissions,
            });
            await roleRepository.save(role);
            console.log(`Created role: ${roleData.name}`);
        }
    }

    console.log('Roles and permissions seeded successfully');
};