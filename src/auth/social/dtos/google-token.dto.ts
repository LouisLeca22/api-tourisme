import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GoogleTokenDto {
  @ApiProperty({
    description: 'Google ID Token obtenu via Google Sign-In',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyM2M1MzUyMC1kZWU0LTQwZjYtOWRjZC02M2VkODE4YjUxYTQiLCJlbWFpbCI6ImNvbnRhY3RAYmlzdHJvZGVseW9uLmZyIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTYyMjg3MzUsImV4cCI6MTc1NjIzMjMzNSwiYXVkIjoibG9jYWxob3N0OjMwMDAiLCJpc3MiOiJsb2NhbGhvc3Q6MzAwMCJ9.85FrmGAo6YZREpoqGAWW5ZjS_baubVzD45E08ACAfcs',
  })
  @IsNotEmpty()
  token: string;
}
