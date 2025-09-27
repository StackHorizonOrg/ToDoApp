/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_idUtente_fkey`;

-- DropTable
DROP TABLE `Task`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Utente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cognome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cellulare` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `notifWhatsapp` BOOLEAN NOT NULL DEFAULT false,
    `notifEmail` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Utente_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titolo` VARCHAR(191) NOT NULL,
    `descrizione` VARCHAR(191) NULL,
    `stato` VARCHAR(191) NOT NULL DEFAULT 'in corso',
    `dataOra` DATETIME(3) NOT NULL,
    `idUtente` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `Evento_idUtente_fkey` FOREIGN KEY (`idUtente`) REFERENCES `Utente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
