import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvdWlzIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzI2MDQ4MDAwfQ.rXfA4v7zFlcb0LRc93fGgWmrlu_aFjqb_oZZz9iVxos',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
