import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { Auth } from './auth/decorators/auth.decorator';
import { AuthType } from './auth/enums/auth-type.enum';

@Controller()
@ApiExcludeController()
export class AppController {
  @Get()
  @Auth(AuthType.None)
  getRoot(@Res() res: Response) {
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Votre passerelle vers les données touristiques" />
  <link rel="canonical" href="https://api-tourisme.onrender.com/" />
  <meta property="og:title" content="API Tourisme – Données et services touristiques" />
  <meta property="og:description" content="Votre passerelle vers les données touristiques" />
  <meta property="og:url" content="https://api-tourisme.onrender.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://api-tourisme.onrender.com/images/preview.png" />
  <meta property="og:site_name" content="API Tourisme" />
  <meta property="og:locale" content="fr_FR" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="API Tourisme – Données et services touristiques" />
  <meta name="twitter:description" content="Votre passerelle vers les données touristiques" />
  <meta name="twitter:image" content="https://api-tourisme.onrender.com/images/preview.png" />
  <style>
    body {
      font-family: system-ui, sans-serif;
      background-color: #fdfdfd;
      margin: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      color: #333;
      text-align: center;
    }
    svg {
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
      stroke: #2c3e50;
      fill: none;
      stroke-width: 2;
    }
    h1 {
      margin: 0;
      font-size: 2rem;
    }
    p {
      margin-top: 0.5rem;
      font-size: 1.2rem;
      color: #666;
    }
    a.button {
      margin-top: 1rem;
      display: inline-block;
      text-decoration: none;
      background-color: #2c3e50;
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 4px;
      transition: background 0.2s ease;
    }
    a.button:hover {
      background-color: #1a252f;
    }
    footer {
      margin-top: 2rem;
      font-size: 0.9rem;
      color: #777;
    }
    footer a {
      color: #2c3e50;
      text-decoration: none;
    }
    footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16 8 14 14 8 16 10 10 16 8" />
  </svg>
  <h1>api-tourisme</h1>
  <p>Votre passerelle vers les données touristiques</p>
  <a href="/doc" class="button">Voir la documentation</a>

  <footer>
    Créé par © <a href="http://louis-leca.web.app" target="_blank">Louis Leca</a>
  </footer>
</body>
</html>
`;

    res.type('html').send(html);
  }
}
