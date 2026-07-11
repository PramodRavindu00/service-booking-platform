import { DocumentBuilder } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Service Booking Platform API')
  .setDescription('Documentation for Service Booking API')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT access token',
    },
    'access-token',
  )
  .addCookieAuth('refreshToken')
  .build();

export default swaggerConfig;
