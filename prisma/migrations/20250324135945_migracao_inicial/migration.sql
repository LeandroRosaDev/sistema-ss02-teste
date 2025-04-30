-- CreateTable
CREATE TABLE "ficha_individual" (
    "id_ficha" SERIAL NOT NULL,
    "imagem_frente_ficha" BYTEA,
    "imagem_verso_ficha" BYTEA,
    "ocr_ficha" TEXT,
    "class_polegar_dir" VARCHAR(2),
    "class_polegar_esq" VARCHAR(2),
    "nome" VARCHAR(80),
    "registro" VARCHAR(10),

    CONSTRAINT "ficha_individual_pkey" PRIMARY KEY ("id_ficha")
);

-- CreateTable
CREATE TABLE "ficha_individual_homolog" (
    "id_ficha" SERIAL NOT NULL,
    "imagem_frente_ficha" BYTEA,
    "imagem_verso_ficha" BYTEA,
    "ocr_ficha" TEXT,
    "class_polegar_dir" VARCHAR(2),
    "class_polegar_esq" VARCHAR(2),
    "nome" VARCHAR(80),

    CONSTRAINT "ficha_individual_homolog_pkey" PRIMARY KEY ("id_ficha")
);

-- CreateTable
CREATE TABLE "identidade_digital" (
    "idcarteira" BYTEA NOT NULL,
    "registro" BYTEA NOT NULL,
    "nome" BYTEA NOT NULL,
    "regantigo" BYTEA NOT NULL,
    "categoria" BYTEA,
    "nascimento" BYTEA NOT NULL,
    "nip" BYTEA,
    "cpf" BYTEA,
    "assinatura" BYTEA,
    "foto" BYTEA,
    "digital" BYTEA,
    "pai" BYTEA NOT NULL,
    "mae" BYTEA NOT NULL,
    "nacionalidade" BYTEA NOT NULL,
    "naturalidade" BYTEA NOT NULL,
    "dtvalidade" BYTEA NOT NULL,
    "doc_origem" BYTEA,
    "tipo" BYTEA,
    "cedula" BYTEA NOT NULL,
    "observacao2" BYTEA,
    "dtgravacao" BYTEA,
    "idchancela" BYTEA,
    "observacao" BYTEA,
    "filiacao1" BYTEA,
    "filiacao2" BYTEA,
    "status" BYTEA NOT NULL,
    "created_at" BYTEA,
    "updated_at" BYTEA,
    "foto_fantasma" BYTEA,
    "foto_qrcode" BYTEA,
    "observacao3" BYTEA,

    CONSTRAINT "identidade_digital_cripto_pkey" PRIMARY KEY ("registro")
);
