/*
  Warnings:

  - You are about to drop the column `cover` on the `testimonials` table. All the data in the column will be lost.
  - Added the required column `price_per_unit` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderSettingType" AS ENUM ('FIXED', 'PERCENTAGE');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "price_per_unit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "portfolios" ADD COLUMN     "price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "testimonials" DROP COLUMN "cover";

-- CreateTable
CREATE TABLE "order_images" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "portfolio_image_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_settings" (
    "id" TEXT NOT NULL,
    "serviceCharge" BOOLEAN DEFAULT false,
    "service_type" "OrderSettingType" NOT NULL DEFAULT 'FIXED',
    "value" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_images_order_id_portfolio_image_id_key" ON "order_images"("order_id", "portfolio_image_id");

-- AddForeignKey
ALTER TABLE "order_images" ADD CONSTRAINT "order_images_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_images" ADD CONSTRAINT "order_images_portfolio_image_id_fkey" FOREIGN KEY ("portfolio_image_id") REFERENCES "portfolio_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
