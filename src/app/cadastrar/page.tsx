import FichaProcessor from "@/components/FichaProcessor";

export default function Ficha() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <p className="text-gray-500">
          Faça upload das imagens das fichas para extrair e cadastrar os dados
        </p>
      </div>

      <FichaProcessor />
    </div>
  );
}
