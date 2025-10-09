import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GoogleTokenDto {
  @ApiProperty({
    description: 'Google ID Token obtenu via Google Sign-In',
    example:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFiYzEyMyJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiIxMDIyMzM0NDU1NjY3Nzg4OTkwMDEiLCJhenAiOiIxMjM0NTY3ODkwLWFiY2RlZmdoaWprbG1ub3BxcnN0dXYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxMjM0NTY3ODkwLWFiY2RlZmdoaWprbG1ub3BxcnN0dXYuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMzYwMCwiZW1haWwiOiJ0ZXN0LnVzZXJAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IlRlc3QgVXNlciIsInBpY3R1cmUiOiJodHRwczovL2V4YW1wbGUuY29tL2F2YXRhcj5wbmciLCJnaXZlbl9uYW1lIjoiVGVzdCIsImZhbWlseV9uYW1lIjoiVXNlciJ9.TU9DS19TSUdOQVRVUkU',
  })
  @IsNotEmpty()
  token: string;
}
