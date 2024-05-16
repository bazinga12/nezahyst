import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  get(key: string): string {
    console.log('CONFIG', key, process.env[key])
    return process.env[key]
  }
}
