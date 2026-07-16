"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Mobile: single toggle button that opens lateral sidebar with all options */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(true)} aria-label="Abrir menu" className="fixed bottom-4 right-4 z-50 p-3 bg-gray-900 border border-gray-400 rounded-full shadow-md">☰</button>

        {/* Mobile lateral sidebar when menuOpen */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="w-64 bg-white text-gray-900 p-4 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">Menu</div>
                <button onClick={() => setMenuOpen(false)} aria-label="Fechar" className="p-2">✕</button>
              </div>

              <nav className="flex flex-col gap-2">
                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">🏠 <span className="font-medium">Página Principal</span></Link>
                <Link href="/home" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">🏡 <span className="font-medium">Home</span></Link>
                <Link href="/projetos" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">📋 <span className="font-medium">Projetos</span></Link>
                {/* removed: Arquivos (global) and Avaliação links per request */}

                <div className="border-t my-2" />

                <Link href="/perfil" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">👤 <span className="font-medium">Perfil</span></Link>
                <Link href="/contato" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">✉️ <span className="font-medium">Contato</span></Link>
                <Link href="/sobre" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">ℹ️ <span className="font-medium">Sobre</span></Link>

                {user?.tipo === 'professor' && (
                  <>
                    <div className="border-t my-2" />
                    <div className="text-xs text-gray-500 uppercase px-3">Professor</div>
                    <Link href="/professor/gerenciar-projetos" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">🗂️ <span className="font-medium">Gerenciar Projetos</span></Link>
                    <Link href="/professor/criar-projeto" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">➕ <span className="font-medium">Criar Projeto</span></Link>
                    <Link href="/professor/arquivos" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">📁 <span className="font-medium">Arquivos (Prof.)</span></Link>
                    <Link href="/professor/custos" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">💰 <span className="font-medium">Custos</span></Link>
                    <Link href="/professor/cadastro-codigo-matricula" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">🏷️ <span className="font-medium">Cadastro Matrícula</span></Link>
                    <Link href="/professor/gerenciar-destaques" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">✨ <span className="font-medium">Gerenciar Destaques</span></Link>
                    <Link href="/professor/registros" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">📝 <span className="font-medium">Registros</span></Link>
                    <Link href="/professor/gerenciar-dados" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-50">🧾 <span className="font-medium">Gerenciar Dados</span></Link>
                  </>
                )}

                <div className="border-t my-2" />

                <div className="border-t mt-3 pt-3">
                  {user ? (
                    <>
                      <button onClick={() => { setMenuOpen(false); router.push('/home'); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Ir ao Painel</button>
                      <button onClick={() => { setMenuOpen(false); logout(); }} className="w-full text-left px-3 py-2 rounded text-rose-600 hover:bg-rose-50">Sair</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full px-3 py-2 rounded hover:bg-gray-50">Entrar</Link>
                      <Link href="/register" onClick={() => setMenuOpen(false)} className="block w-full px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700">Registrar</Link>
                    </>
                  )}
                </div>
              </nav>
            </div>

            <div className="flex-1 bg-black/40" onClick={() => setMenuOpen(false)} />
          </div>
        )}
      </div>

      {/* Desktop vertical compact sidebar */}
      <aside className="hidden md:flex flex-col bg-white border-r p-3 w-16 md:w-48 flex-shrink-0 items-center">
        <nav className="flex flex-col items-center gap-2">
          <Link href="/home" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm text-gray-900">🏠 <span className="hidden md:inline">Home</span></Link>
          <Link href="/projetos" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm text-gray-900">📋 <span className="hidden md:inline">Projetos</span></Link>
          <Link href="/perfil" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm text-gray-900">👤 <span className="hidden md:inline">Perfil</span></Link>

          {user?.tipo === 'professor' && (
            <>
              <Link href="/professor/gerenciar-projetos" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-700 text-sm text-white">🗂️ <span className="hidden md:inline">Gerenciar</span></Link>
              <Link href="/professor/criar-projeto" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-700 text-sm text-white">➕ <span className="hidden md:inline">Criar</span></Link>
              <Link href="/professor/custos" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-700 text-sm text-white">💰 <span className="hidden md:inline">Custos</span></Link>
              <Link href="/professor/cadastro-codigo-matricula" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-700 text-sm text-white">🏷️ <span className="hidden md:inline">Cadastro Matrícula</span></Link>
              <Link href="/professor/arquivos" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-700 text-sm text-white">📁 <span className="hidden md:inline">Arquivos</span></Link>
              <Link href="/professor/gerenciar-destaques" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-700 text-sm text-white">✨ <span className="hidden md:inline">Destaques</span></Link>
              <Link href="/professor/registros" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-700 text-sm text-white">📝 <span className="hidden md:inline">Registros</span></Link>
              <Link href="/professor/gerenciar-dados" className="w-full max-w-[220px] mx-auto flex items-center justify-center gap-3 px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-700 text-sm text-white">🧾 <span className="hidden md:inline">Gerenciar Dados</span></Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
