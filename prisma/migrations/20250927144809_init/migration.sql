-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cognome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cellulare` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `notifWhatsapp` BOOLEAN NOT NULL DEFAULT false,
    `notifEmail` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titolo` VARCHAR(191) NOT NULL,
    `descrizione` VARCHAR(191) NULL,
    `stato` VARCHAR(191) NOT NULL DEFAULT 'in corso',
    `dataOra` DATETIME(3) NOT NULL,
    `idUtente` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_idUtente_fkey` FOREIGN KEY (`idUtente`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
