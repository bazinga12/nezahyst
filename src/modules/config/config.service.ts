import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    console.log('=====', filePath)
    const dir = fs.readdirSync('.');
    console.log('Current dir', dir)
    const parent = fs.readdirSync('./../');
    console.log('Parent', parent)
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  isEnv(env: string) {
    return this.envConfig.APP_ENV === env;
  }
}
