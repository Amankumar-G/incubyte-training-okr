-- prisma/migrations/<timestamp>-add-pgvector/migration.sql
CREATE
EXTENSION IF NOT EXISTS vector;

CREATE TABLE "Document"
(
    id        SERIAL PRIMARY KEY,
    title     TEXT NOT NULL,
    embedding VECTOR(3072) -- use 4 for demo purposes; real-world values are much bigger
);