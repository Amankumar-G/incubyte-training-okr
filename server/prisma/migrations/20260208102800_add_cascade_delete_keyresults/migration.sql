-- DropForeignKey
ALTER TABLE "KeyResult" DROP CONSTRAINT "KeyResult_objectiveId_fkey";

-- AddForeignKey
ALTER TABLE "KeyResult" ADD CONSTRAINT "KeyResult_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE CASCADE ON UPDATE CASCADE;
