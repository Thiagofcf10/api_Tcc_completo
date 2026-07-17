"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { useState } from 'react';

export default function TopNav() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      router.push('/');
    }
  };

  const goHome = () => router.push('/');

  const goToProfile = () => router.push('/perfil');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="w-full bg-gradient-to-r from-green-800 to-cyan-800 border-b-4 border-green-800 shadow-lg sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white text-green-900 rounded-lg flex items-center justify-center text-lg md:text-xl font-bold shadow-lg">
              IF
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-bold text-white">REPOSITÓRIOS DE PROJETOS</h1>
              <p className="text-xs text-green-100">IFPA</p>
            </div>
          </div>

          {/* Navegação Central - Botões Essenciais (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={goBack}
              className="px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-all text-sm"
              title="Voltar"
            >
              ← Voltar
            </button>
            <button
              onClick={goHome}
              className="px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-all text-sm"
              title="Ir para principal"
            >
              🏠 Principal
            </button>
            <button
              onClick={() => router.push('/projetos')}
              className="px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-all text-sm"
              title="Buscar projetos"
            >
              🔍 Projetos
            </button>
          </div>

          {/* Área de Autenticação e Menu */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Auth Area */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm text-blue-100 font-semibold">
                    Olá, <strong className="text-white">{user.nome_usuario?.split(' ')[0]}</strong>
                  </span>
                  <button
                    onClick={goToProfile}
                    className="px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-colors text-sm"
                  >
                    👤 Perfil
                  </button>
                  <button
                    onClick={() => router.push('/home')}
                    className="px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-all text-sm"
                  >
                    📊 Painel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-bold"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-colors text-sm"
                  >
                    🔓 Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 bg-green-400 hover:bg-green-500 text-green-900 rounded-lg transition-colors font-bold text-sm"
                  >
                    ✍️ Registrar
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Quick Actions */}
            <div className="flex md:hidden items-center gap-2">
              {user ? (
                <button
                  onClick={() => router.push('/perfil')}
                  className="p-2 text-white hover:bg-blue-700 rounded-lg transition-all font-bold"
                  title="Perfil"
                >
                  👤
                </button>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-white hover:bg-blue-700 rounded-lg transition-all font-bold"
                  title="Entrar"
                >
                  🔐
                </Link>
              )}
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              className="md:hidden p-2 text-white hover:bg-blue-700 rounded-lg transition-all font-bold text-lg"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu - Apenas Essenciais */}
        {menuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t-2 border-green-500 bg-green-800 rounded-lg animate-in fade-in duration-400 -mx-4 px-4 pb-3">
            <nav className="flex flex-col gap-1">
              {/* Navigation Buttons */}
              <button
                onClick={() => { setMenuOpen(false); goBack(); }}
                className="w-full text-left px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-all text-sm"
              >
                ← Voltar
              </button>
              <button
                onClick={() => { setMenuOpen(false); goHome(); }}
                className="w-full text-left px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-all text-sm"
              >
                🏠 Principal
              </button>
              <button
                onClick={() => { setMenuOpen(false); router.push('/projetos'); }}
                className="w-full text-left px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-all text-sm"
              >
                🔍 Projetos
              </button>

              {/* Divider */}
              <div className="border-t-2 border-green-500 my-2" />

              {/* Auth Section */}
              {user ? (
                <>
                  <button
                    onClick={() => { setMenuOpen(false); router.push('/perfil'); }}
                    className="w-full text-left px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-all text-sm"
                  >
                    👤 Perfil
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); router.push('/home'); }}
                    className="w-full text-left px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-all text-sm"
                  >
                    📊 Ir ao Painel
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="w-full text-left px-3 py-2 text-white font-bold bg-red-600 hover:bg-red-700 rounded-lg transition-all text-sm"
                  >
                    🚪 Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-3 py-2 text-white font-semibold hover:bg-green-500 rounded-lg transition-all text-sm"
                  >
                    🔓 Entrar
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full px-3 py-2 bg-green-400 text-green-900 hover:bg-green-500 rounded-lg transition-all text-sm font-bold"
                  >
                    ✍️ Registrar
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

