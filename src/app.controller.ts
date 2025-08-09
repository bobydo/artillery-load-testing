import { Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  @Get('login')
  getLogin(@Res() res: Response) {
    // Serve the static login.html file
    return res.sendFile(join(process.cwd(), 'public', 'login.html'));
  }

  @Post('login')
  postLogin(@Res() res: Response) {
    // For demo: just return the login page with welcome message (simulate success)
    // In a real app, you'd check credentials here
    return res.sendFile(join(process.cwd(), 'public', 'login.html'));
  }
}
