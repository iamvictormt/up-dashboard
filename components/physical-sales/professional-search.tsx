'use client';

import { UIEvent, useEffect, useRef, useState } from 'react';
import { Loader2, Search, UserCheck, X } from 'lucide-react';
import { searchProfessionals } from '@/lib/physical-sales-api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProfessionalSearchResult } from '@/types';

// Busca só quando o lojista para de digitar por esse tempo
const SEARCH_DELAY_MS = 3000;

interface ProfessionalSearchProps {
  selected: ProfessionalSearchResult | null;
  onSelect: (professional: ProfessionalSearchResult | null) => void;
}

export function ProfessionalSearch({ selected, onSelect }: ProfessionalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProfessionalSearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [searched, setSearched] = useState(false);
  // Descarta respostas de buscas antigas (texto mudou enquanto a requisição estava no ar)
  const requestId = useRef(0);

  const load = async (q: string, nextPage: number) => {
    const id = ++requestId.current;
    setIsSearching(true);
    try {
      const data = await searchProfessionals(q, nextPage);
      if (id !== requestId.current) return;
      setResults((prev) => (nextPage === 1 ? data.items : [...prev, ...data.items]));
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch {
      if (id === requestId.current && nextPage === 1) setResults([]);
    } finally {
      if (id === requestId.current) {
        setIsSearching(false);
        setSearched(true);
      }
    }
  };

  useEffect(() => {
    const q = query.trim();
    requestId.current++;
    setResults([]);
    setHasMore(false);
    setSearched(false);
    setIsSearching(false);

    if (q.length < 3) {
      setIsWaiting(false);
      return;
    }

    setIsWaiting(true);
    const timer = setTimeout(() => {
      setIsWaiting(false);
      load(q, 1);
    }, SEARCH_DELAY_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleScroll = (event: UIEvent<HTMLUListElement>) => {
    const el = event.currentTarget;
    if (hasMore && !isSearching && el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      load(query.trim(), page + 1);
    }
  };

  if (selected) {
    return (
      <div className="space-y-2">
        <Label variant="light">Profissional</Label>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4">
          <div className="flex items-center gap-3">
            <UserCheck className="h-5 w-5 shrink-0 text-emerald-700" />
            <div>
              <p className="font-semibold text-[#511A2B]">{selected.name}</p>
              <p className="text-sm text-[#511A2B]/70">
                {[selected.profession, selected.officeName, selected.document].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="rounded-lg p-2 text-[#511A2B]/60 transition hover:bg-white hover:text-[#511A2B]"
            title="Trocar profissional"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const showList = results.length > 0;

  return (
    <div className="space-y-2">
      <Label variant="light" optional>
        Profissional
      </Label>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#511A2B]/50" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          variant="light"
          className="pl-10"
          placeholder="Busque pelo CPF ou nome do profissional"
          role="combobox"
          aria-expanded={showList}
          aria-controls="professional-search-results"
        />
        {isSearching || isWaiting ? (
          <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#511A2B]/50" />
        ) : null}

        {showList ? (
          <ul
            id="professional-search-results"
            role="listbox"
            onScroll={handleScroll}
            className="absolute z-20 mt-1 max-h-72 w-full divide-y divide-[#511A2B]/10 overflow-y-auto rounded-xl border border-[#511A2B]/15 bg-white shadow-lg"
          >
            {results.map((professional) => (
              <li key={professional.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(professional);
                    setQuery('');
                  }}
                  className="w-full px-4 py-3 text-left transition hover:bg-[#FFEDC1]/60"
                >
                  <p className="font-medium text-[#511A2B]">{professional.name}</p>
                  <p className="text-sm text-[#511A2B]/60">
                    {[professional.profession, professional.officeName, professional.document]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </button>
              </li>
            ))}
            {isSearching ? (
              <li className="flex justify-center py-3">
                <Loader2 className="h-4 w-4 animate-spin text-[#511A2B]/50" />
              </li>
            ) : hasMore ? (
              <li className="py-2 text-center text-xs text-[#511A2B]/50">Role para ver mais</li>
            ) : null}
          </ul>
        ) : null}
      </div>

      {searched && !isSearching && results.length === 0 ? (
        <p className="text-sm text-[#511A2B]/70">
          Nenhum profissional encontrado. Registre a venda mesmo assim: será gerado um código para o profissional
          resgatar depois.
        </p>
      ) : (
        <p className="text-xs text-[#511A2B]/60">
          {isWaiting
            ? 'A busca começa quando você parar de digitar.'
            : 'Com o profissional selecionado, os pontos são creditados na hora. Sem profissional, é gerado um código de resgate.'}
        </p>
      )}
    </div>
  );
}
