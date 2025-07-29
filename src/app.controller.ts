import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  @Get()
  getRoot(@Res() res: Response) {
    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>api-tourisme</title>
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
          a {
            margin-top: 1rem;
            display: inline-block;
            text-decoration: none;
            background-color: #2c3e50;
            color: white;
            padding: 0.6rem 1.2rem;
            border-radius: 4px;
            transition: background 0.2s ease;
          }
          a:hover {
            background-color: #1a252f;
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
        <a href="/doc">Voir la documentation</a>
      </body>
      </html>
    `;
    res.type('html').send(html);
  }
}
