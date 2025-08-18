import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const StoreId = createParamDecorator(
    (_, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user.store_id; // Extrae de forma segura
    }
);