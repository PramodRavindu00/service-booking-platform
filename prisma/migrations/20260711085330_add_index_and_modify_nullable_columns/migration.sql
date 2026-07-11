-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "updatedBy" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_serviceId_idx" ON "Booking"("serviceId");
