import { DocumentBuilder } from "@nestjs/swagger";

const swaggerConfig = new DocumentBuilder()
.setTitle('Service Booking Platform API')
.setDescription(
  'Documentation for Service Booking API',
)
.setVersion('1.0')
.build();

export default swaggerConfig