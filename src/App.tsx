/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Palette, HelpCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TABELA = [
  { max: 600, valor: 5.32 },
  { max: 800, valor: 10.64 },
  { max: 1000, valor: 21.28 },
  { max: 3000, valor: 31.92 },
  { max: 5000, valor: 42.56 },
  { max: Infinity, valor: 53.20 }
];

const TAXA_FIXA = 130.16;

type Theme = 'theme-midnight' | 'theme-black' | 'theme-purple' | 'theme-blue' | 'theme-light';

interface CalculationResult {
  pesoEixo: number;
  pesoPbt: number;
  totalEixo: number;
  totalPbt: number;
  unidadesEixo: number;
  unidadesPbt: number;
  divEixo: number;
  divPbt: number;
  rateEixo: number;
  ratePbt: number;
  totalFinal: number;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('theme-midnight');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eixo, setEixo] = useState('');
  const [pbt, setPbt] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState('');

  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getValorFaixa = (peso: number) => {
    return TABELA.find(f => peso <= f.max)?.valor || 0;
  };

  const formatar = (v: number) => {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleCalculate = () => {
    const pesoEixo = parseFloat(eixo) || 0;
    const pesoPbt = parseFloat(pbt) || 0;

    setError('');
    setResult(null);

    if (pesoEixo <= 0 && pesoPbt <= 0) {
      setError("Informe pelo menos um peso excedido.");
      return;
    }

    let somaVariavel = 0;
    let totalEixo = 0;
    let unidadesEixo = 0;
    let divEixo = 0;
    let rateEixo = 0;

    if (pesoEixo > 0) {
      divEixo = pesoEixo / 200;
      unidadesEixo = Math.ceil(divEixo);
      rateEixo = getValorFaixa(pesoEixo);
      totalEixo = unidadesEixo * rateEixo;
      somaVariavel += totalEixo;
    }

    let totalPbt = 0;
    let unidadesPbt = 0;
    let divPbt = 0;
    let ratePbt = 0;

    if (pesoPbt > 0) {
      divPbt = pesoPbt / 200;
      unidadesPbt = Math.ceil(divPbt);
      ratePbt = getValorFaixa(pesoPbt);
      totalPbt = unidadesPbt * ratePbt;
      somaVariavel += totalPbt;
    }

    const totalFinal = somaVariavel + TAXA_FIXA;

    setResult({
      pesoEixo,
      pesoPbt,
      totalEixo,
      totalPbt,
      unidadesEixo,
      unidadesPbt,
      divEixo,
      divPbt,
      rateEixo,
      ratePbt,
      totalFinal
    });
  };

  const themes: { id: Theme; label: string; color: string }[] = [
    { id: 'theme-midnight', label: 'Midnight', color: '#0f172a' },
    { id: 'theme-black', label: 'Total Black', color: '#000000' },
    { id: 'theme-purple', label: 'Roxo', color: '#2e1065' },
    { id: 'theme-blue', label: 'Azul Royal', color: '#1e3a8a' },
    { id: 'theme-light', label: 'Claro', color: '#f8fafc' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center p-5 font-sans">
      {/* Top Controls */}
      <div className="w-full max-w-[500px] flex justify-end mb-4 relative">
        <div className="relative" ref={themeMenuRef}>
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--text)] font-semibold text-sm cursor-pointer hover:opacity-90 transition-all"
          >
            <Palette size={18} className="text-[var(--primary)]" />
            Escolher Cor
          </button>

          <AnimatePresence>
            {isThemeMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-12 right-0 w-40 bg-[var(--card)] border border-[var(--border)] rounded-xl p-2 shadow-2xl z-50 flex flex-col gap-1"
              >
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg text-xs text-[var(--text)] hover:bg-white/10 transition-colors w-full text-left"
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: t.color }}
                    />
                    {t.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* App Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] bg-[var(--card)] p-6 rounded-2xl shadow-2xl border border-[var(--border)]"
      >
        <h1 className="text-xl font-bold text-center text-[var(--primary)] mb-6 uppercase tracking-widest">
          Weight Calculator
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[var(--danger)] text-white p-3 rounded-lg text-center text-sm mb-4"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[var(--secondary)]">
              Excesso de Eixo (kg)
            </label>
            <input
              type="number"
              value={eixo}
              onChange={(e) => setEixo(e.target.value)}
              placeholder="Ex: 1670"
              className="w-full p-3.5 bg-[var(--input-bg)] border-2 border-[var(--border)] rounded-xl text-base text-[var(--text)] focus:border-[var(--primary)] outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[var(--secondary)]">
              Excesso de PBT (kg) - Opcional
            </label>
            <input
              type="number"
              value={pbt}
              onChange={(e) => setPbt(e.target.value)}
              placeholder="Ex: 2880"
              className="w-full p-3.5 bg-[var(--input-bg)] border-2 border-[var(--border)] rounded-xl text-base text-[var(--text)] focus:border-[var(--primary)] outline-none transition-all"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-bold text-lg cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
          >
            CALCULAR MULTA
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 overflow-hidden"
            >
              <div className="space-y-4">
                {result.pesoEixo > 0 && (
                  <div className="bg-white/5 p-4 rounded-xl border-l-4 border-[var(--primary)]">
                    <h3 className="font-bold text-[var(--text)] text-sm">Excesso de Eixo ({result.pesoEixo}kg)</h3>
                    <div className="text-xs text-[var(--secondary)] mt-2 space-y-1">
                      <p>Divisão (peso / 200): <span className="text-[var(--text)] font-mono">{result.divEixo.toFixed(2)}</span></p>
                      <p>Número arredondado (unidades): <span className="text-[var(--text)] font-mono">{result.unidadesEixo}</span></p>
                      <p>Valor por unidade: {formatar(result.rateEixo)}</p>
                      <p className="font-mono font-bold text-[var(--text)] pt-1 border-t border-white/10">
                        Cálculo: {result.unidadesEixo} unidades x {formatar(result.rateEixo)} = {formatar(result.totalEixo)}
                      </p>
                    </div>
                  </div>
                )}

                {result.pesoPbt > 0 && (
                  <div className="bg-white/5 p-4 rounded-xl border-l-4 border-[var(--primary)]">
                    <h3 className="font-bold text-[var(--text)] text-sm">Excesso de PBT ({result.pesoPbt}kg)</h3>
                    <div className="text-xs text-[var(--secondary)] mt-2 space-y-1">
                      <p>Divisão (peso / 200): <span className="text-[var(--text)] font-mono">{result.divPbt.toFixed(2)}</span></p>
                      <p>Número arredondado (unidades): <span className="text-[var(--text)] font-mono">{result.unidadesPbt}</span></p>
                      <p>Valor por unidade: {formatar(result.ratePbt)}</p>
                      <p className="font-mono font-bold text-[var(--text)] pt-1 border-t border-white/10">
                        Cálculo: {result.unidadesPbt} unidades x {formatar(result.ratePbt)} = {formatar(result.totalPbt)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-[var(--success)]/10 border-2 border-[var(--success)] p-5 rounded-2xl text-center">
                  <div className="text-[var(--secondary)] text-[10px] mb-3 space-y-1">
                    <p>Soma das Variáveis: {formatar(result.totalEixo + result.totalPbt)}</p>
                    <p>Taxa Fixa: + {formatar(TAXA_FIXA)}</p>
                  </div>
                  <strong className="block text-[var(--success)] text-[10px] uppercase tracking-widest mb-1">
                    Total Final a Pagar
                  </strong>
                  <span className="block text-4xl font-extrabold text-[var(--success)]">
                    {formatar(result.totalFinal)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Help Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all z-40"
      >
        <HelpCircle size={28} />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[var(--card)] p-8 rounded-3xl max-w-sm w-full text-center border border-[var(--border)] shadow-2xl"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[var(--primary)]/20 rounded-full flex items-center justify-center">
                  <Info size={32} className="text-[var(--primary)]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[var(--primary)] mb-2">Precisa de Ajuda?</h3>
              <p className="text-[var(--text)] text-sm leading-relaxed mb-6">
                Em caso de dúvidas ou problemas com a URL, entre em contato com a equipe de TI responsável.
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-bold cursor-pointer hover:brightness-110 transition-all"
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
