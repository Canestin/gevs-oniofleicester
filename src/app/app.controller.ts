import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiExcludeEndpoint()
  @Get()
  @Header('Content-Type', 'text/html')
  42() {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tagira API</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            height: 90vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;
          }
          h1{
            font-size: 4.5vw;
          }
          p{
            font-size: 1.5vw;
          }
        </style>
      </head>
      <body>
      <h1>GEVS API</h1>
      <p>Valley of Shangri-La</p>
      </body>
    </html>
    `;
  }

  @ApiExcludeEndpoint()
  @Get('docs')
  @Header('Content-Type', 'text/html')
  docs() {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tagira API Reference</title>
        <!-- needed for adaptive design -->
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <redoc spec-url='/swagger-json'></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
      </body>
    </html>
    `;
  }
}
