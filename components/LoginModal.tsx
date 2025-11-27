import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock validation as requested
    setError('Credenciais inválidas.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-brand-black border border-gray-200 dark:border-neutral-800 w-full max-w-md p-8 rounded-lg shadow-2xl relative transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="bg-gray-100 dark:bg-neutral-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
            <Star className="text-yellow-500" size={32} fill="currentColor" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">Área Exclusiva 🌟</h2>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">Esse conteúdo é reservado com carinho para alunos da Formação. Se você já é aluno, faça seu login:</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase font-bold text-gray-500 dark:text-neutral-500 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white px-4 py-3 rounded focus:outline-none focus:border-brand-red transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-gray-500 dark:text-neutral-500 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white px-4 py-3 rounded focus:outline-none focus:border-brand-red transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-brand-red text-sm font-medium text-center animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 bg-brand-red hover:bg-brand-darkRed text-white font-bold py-3 rounded transition-all transform hover:translate-y-[-2px] uppercase tracking-wide"
          >
            Acessar Agora
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;