import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionsRepository: Repository<Permission>,
    ) {}

    async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
        const role = this.rolesRepository.create({
            name: createRoleDto.name,
            description: createRoleDto.description || '',
        });
        
        if (createRoleDto.permissionIds?.length) {
            const permissions = await this.permissionsRepository.findByIds(createRoleDto.permissionIds);
            role.permissions = permissions;
        }
        
        return this.rolesRepository.save(role);
    }

    async findAllRoles(): Promise<Role[]> {
        return this.rolesRepository.find({ relations: ['permissions'] });
    }

    async findRoleById(id: string): Promise<Role> {
        const role = await this.rolesRepository.findOne({
            where: { id },
            relations: ['permissions'],
        });
        
        if (!role) {
            throw new NotFoundException(`Role with id ${id} not found`);
        }
        
        return role;
    }

    async assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<Role> {
        const role = await this.findRoleById(roleId);
        const permissions = await this.permissionsRepository.findByIds(permissionIds);
        
        role.permissions = permissions;
        return this.rolesRepository.save(role);
    }

    async createPermission(name: string, description: string): Promise<Permission> {
        const permission = this.permissionsRepository.create({ name, description });
        return this.permissionsRepository.save(permission);
    }

    async findAllPermissions(): Promise<Permission[]> {
        return this.permissionsRepository.find();
    }
}