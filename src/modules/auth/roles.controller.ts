import { Controller, Post, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { Roles } from './decorators/roles.decorator';
import { Permissions } from './decorators/permissions.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @Post()
    @Roles('Super Admin')
    @Permissions('roles:manage_admins')
    async createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.createRole(createRoleDto);
    }

    @Get()
    @Permissions('roles:read')
    async findAllRoles() {
        return this.rolesService.findAllRoles();
    }

    @Get('permissions')
    @Permissions('roles:read')
    async findAllPermissions() {
        return this.rolesService.findAllPermissions();
    }

    @Put(':id/permissions')
    @Roles('Super Admin')
    @Permissions('roles:manage_admins')
    async assignPermissions(
        @Param('id') id: string,
        @Body() assignPermissionsDto: AssignPermissionsDto
    ) {
        return this.rolesService.assignPermissionsToRole(id, assignPermissionsDto.permissionIds);
    }
}