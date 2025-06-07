/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) { }

    @Get()
    getCategories(@Request() req) {
        return this.categoriesService.findAllByUser(req.user.userId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createCategory(
        @Body() body: { name: string },
        @Request() req
    ) {
        return this.categoriesService.create({
            name: body.name,
            userId: req.user.userId,
        });
    }


    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateCategory(
        @Param('id') id: string,
        @Body() body: Partial<{ name: string }>,
        @Request() req
    ) {
        return this.categoriesService.update(id, {
            ...body,
            userId: req.user.userId,
        });
    }


    @Delete(':id')
    deleteCategory(@Param('id') id: string, @Request() req) {
        return this.categoriesService.delete(id, req.user.userId);
    }
}
