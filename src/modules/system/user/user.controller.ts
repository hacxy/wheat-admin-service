import { Controller, Get, Post, Body, Query, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserListDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { CommonApiResponse } from '@/common/decorators/apiResponse';
import { PaginationPipe } from '@/common/pipes/pagination.pipe';
import { UserInfoVo } from './dto/user.vo';
import { CommonApiOperation } from '@/common/decorators/common-api-operation.dec';
import { XlsxService } from '@/common/xlsx/xlsx.service';
import { Response as Rs } from 'express';

@ApiTags('系统管理-用户管理')
@Controller('system/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly xlsxService: XlsxService
  ) {}

  @Post()
  @CommonApiOperation({ summary: '新建用户', permissionCode: 'system:user:add' })
  @CommonApiResponse()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @CommonApiOperation({ summary: '获取用户列表', permissionCode: 'system:user:list' })
  @CommonApiResponse({ type: 'array', itemType: UserInfoVo })
  findList(@Query(PaginationPipe) queryUserList: UserListDto) {
    return this.userService.findList(queryUserList);
  }

  @Get('export')
  @CommonApiOperation({ summary: '导出用户列表' })
  @CommonApiResponse()
  async exportJob(@Query(PaginationPipe) queryUserList: UserListDto, @Response() res: Rs) {
    const { titleName, xlsxData, fileName } = await this.userService.exportJob(queryUserList);
    const file = await this.xlsxService.exportExcel(titleName, xlsxData, fileName);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(fileName) + '.xlsx'); // 中文名需要进行url转码
    res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(file, 'binary');
  }
}
