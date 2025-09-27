/*
  Warnings:

  - A unique constraint covering the columns `[cellulare]` on the table `Utente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `OTP` to the `Utente` table without a default value. This is not possible if the table is not empty.
  - Made the column `cellulare` on table `Utente` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Evento` DROP FOREIGN KEY `Evento_idUtente_fkey`;

-- DropIndex
DROP INDEX `Evento_idUtente_fkey` ON `Evento`;

-- AlterTable
ALTER TABLE `Evento` ADD COLUMN `utenteId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Utente` ADD COLUMN `OTP` VARCHAR(191) NOT NULL,
    ADD COLUMN `verificato` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `cellulare` VARCHAR(191) NOT NULL,
    MODIFY `notifEmail` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `Utente_cellulare_key` ON `Utente`(`cellulare`);

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_utenteId_fkey` FOREIGN KEY (`utenteId`) REFERENCES `Utente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
