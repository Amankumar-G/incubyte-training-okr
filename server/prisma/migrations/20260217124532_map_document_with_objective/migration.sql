/*
  Warnings:

  - A unique constraint covering the columns `[objectiveId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `objectiveId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "objectiveId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Document_objectiveId_key" ON "Document"("objectiveId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE CASCADE ON UPDATE CASCADE;
