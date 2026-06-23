export default function AvaliacaoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded shadow p-8">
          <h1 className="text-gray-800 text-2xl font-bold mb-4">Avaliação do Site</h1>
          <p className="text-gray-700 mb-4">A sua opinião é importante para melhorarmos o repositório IFPA. Por favor, deixe sua avaliação ou sugestão abaixo.</p>

          <div className="space-y-4">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSf-hU5GUbHQzJo8n-5AOvXGSyMoXxgf-5QE-Hsvq_FEPqaiew/viewform?usp=publish-editor" target="_blank" rel="noreferrer" className="inline-block px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">Abrir formulário de avaliação</a>
            <div className="text-sm text-gray-600">Ou envie um e-mail para <a href="mailto:repoifpa@gmail.com" className="underline">repoifpa@gmail.com</a> com seu feedback.</div>
          </div>
        </div>
      </main>
    </div>
  );
}
