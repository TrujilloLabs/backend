import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { Roles } from './decorators/roles.decorator';
import { Permissions } from './decorators/permissions.decorator';

@Controller('test-roles')
@UseGuards(JwtAuthGuard)
export class TestRolesController {
    
    @Get('dashboard')
    @UseGuards(PermissionsGuard)
    @Permissions('dashboard:read')
    testDashboard() {
        return { message: 'Dashboard access granted', permission: 'dashboard:read' };
    }

    @Get('products')
    @UseGuards(PermissionsGuard)
    @Permissions('products:read')
    testProducts() {
        return { message: 'Products access granted', permission: 'products:read' };
    }

    @Get('admin-only')
    @UseGuards(RolesGuard)
    @Roles('Super Admin', 'Store Admin')
    testAdminOnly() {
        return { message: 'Admin access granted', roles: ['Super Admin', 'Store Admin'] };
    }

    @Get('super-admin-only')
    @UseGuards(RolesGuard, PermissionsGuard)
    @Roles('Super Admin')
    @Permissions('roles:manage_admins')
    testSuperAdminOnly() {
        return { message: 'Super Admin access granted' };
    }
}