import * as fs from 'fs';
import * as path from 'path';

// Template strings for different file types
const moduleTemplate = (
  name: string,
) => `import { Module } from '@nestjs/common';
import { ${capitalizeFirst(name)}Service } from './${name}.service';
import { ${capitalizeFirst(name)}Controller } from './${name}.controller';

@Module({
  controllers: [${capitalizeFirst(name)}Controller],
  providers: [${capitalizeFirst(name)}Service],
})
export class ${capitalizeFirst(name)}Module {}
`;

const controllerTemplate = (name: string) => `import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/common/constants/constants.permissions';
import { RequirePermissions } from 'src/common/decorators/permissions.decorators';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { throwErrorIfNotFound } from 'src/utils/response.utils';
import { Create${capitalizeFirst(name)}Dto, FindAll${capitalizeFirst(name)}Dto, Update${capitalizeFirst(name)}Dto } from './${name}.dto';
import { ${capitalizeFirst(name)}Service } from './${name}.service';

@ApiBearerAuth()
@Controller('${name}s')
export class ${capitalizeFirst(name)}Controller {
  constructor(private readonly ${name}Service: ${capitalizeFirst(name)}Service) {}

  @RequirePermissions(Permissions.${name.toUpperCase()}_CREATE)
  @Post()
  create(@Body() dto: Create${capitalizeFirst(name)}Dto) {
    return this.${name}Service.create(dto);
  }

  @RequirePermissions(Permissions.${name.toUpperCase()}_READ)
  @Post('get-list')
  findAll(@Body() dto: FindAll${capitalizeFirst(name)}Dto) {
    return this.${name}Service.findAll(dto);
  }

  @RequirePermissions(Permissions.${name.toUpperCase()}_READ)
  @Get('/:id')
  findOne(@Param() dto: FindOneLiDto) {
    return this.${name}Service.findOne(dto).then(throwErrorIfNotFound);
  }

  @Put('/:id')
  @RequirePermissions(Permissions.${name.toUpperCase()}_UPDATE)
  update(@Param() find_dto: FindOneLiDto, @Body() dto: Update${capitalizeFirst(name)}Dto) {
    return this.${name}Service.update(find_dto, dto);
  }

  @Delete(':id')
  remove(@Param() find_dto: FindOneLiDto) {
    return this.${name}Service.remove(find_dto);
  }
}
`;

const serviceTemplate = (
  name: string,
) => `import { Injectable } from '@nestjs/common';
import { ${name} } from '@prisma/client';
import { FindOneLiDto } from 'src/common/dto/common.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  getPaginationOptions,
  getPaginationResponse,
} from 'src/utils/pagination.utils';
import { ICrudService } from '../../common/interfaces/crud.interface';
import { Create${capitalizeFirst(name)}Dto, FindAll${capitalizeFirst(name)}Dto, Update${capitalizeFirst(name)}Dto } from './${name}.dto';

@Injectable()
export class ${capitalizeFirst(name)}Service implements ICrudService<${name}> {
  constructor(private prisma: PrismaService) {}

  async create(create${capitalizeFirst(name)}Dto: Create${capitalizeFirst(name)}Dto) {
    // custom implement
  }

  async findOne(dto: FindOneLiDto) {
    return this.prisma.${name}.findFirst({
      where: dto,
    });
  }

  async update(find_dto: FindOneLiDto, dto: Update${capitalizeFirst(name)}Dto) {
    await this.prisma.${name}.update({
      where: find_dto,
      data: dto,
    });

    return this.findOne(find_dto);
  }

  async remove(find_dto: FindOneLiDto) {
    await this.prisma.${name}.update({
      where: find_dto,
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findAll(dto: FindAll${capitalizeFirst(name)}Dto) {
    const pagination = await getPaginationResponse({
      items: this.prisma.${name}.findMany({
        where: dto.filter,
        ...getPaginationOptions(dto),
      }),
      count: this.prisma.${name}.count({ where: dto.filter }),
      dto,
    });

    return pagination;
  }
}
`;

// Helper function to capitalize first letter
function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to create module files
function createModuleFiles(moduleName: string, basePath: string) {
  const modulePath = path.join(basePath, 'src', 'modules', moduleName);
  console.log(modulePath);
  
  // Create module directory if it doesn't exist
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
  }

  // Create module files
  const files = [
    {
      name: `${moduleName}.module.ts`,
      content: moduleTemplate(moduleName),
    },
    {
      name: `${moduleName}.controller.ts`,
      content: controllerTemplate(moduleName),
    },
    {
      name: `${moduleName}.service.ts`,
      content: serviceTemplate(moduleName),
    },
    {
      name: `${moduleName}.dto.ts`,
      content: '', // Empty DTO file as requested
    },
  ];

  files.forEach((file) => {
    const filePath = path.join(modulePath, file.name);
    fs.writeFileSync(filePath, file.content);
    console.log(`Created ${file.name}`);
  });
}

// Main execution
const moduleNames = [
  'customer',
];

// Get the base path (assuming the script is run from the project root)
const basePath = process.cwd();

// Create modules
moduleNames.forEach((moduleName) => {
  console.log(`\nGenerating ${moduleName} module...`);
  createModuleFiles(moduleName, basePath);
});

console.log('\nAll modules generated successfully!');
