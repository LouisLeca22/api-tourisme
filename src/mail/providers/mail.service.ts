import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Owner } from 'src/owners/owner.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendOwnerWelcome(owner: Owner): Promise<void> {
    await this.mailerService.sendMail({
      to: owner.email,
      subject:
        'Bienvenue sur API Tourisme : Votre passerelle vers les données touristiques',
      template: './welcome',
      context: {
        name: owner.name,
        email: owner.email,
        loginUrl: 'http://api-tourisme.onrender.com',
      },
    });
  }
}
