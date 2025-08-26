import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Email de connexion',
    example: 'contact@aventurescevenoles.fr',
  })
  @IsEmail({}, { message: 'Adresse e-mail invalide' })
  @IsNotEmpty({ message: "L'adresse e-mail est obligatoire" })
  email: string;

  @ApiProperty({
    description: 'Mot de passe de connexion',
    example: 'MotDePasse1234!',
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le mot de passe est obligatoire' })
  password: string;
}
