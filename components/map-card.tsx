'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dinamicamente importa Leaflet apenas no cliente
const Map = dynamic(() => import('./map-inner'), { ssr: false });

interface MapCardProps {
  cep: string;
}

export default function MapCard({ cep }: MapCardProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        const address = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const geo = await geoRes.json();

        if (geo.length > 0) {
          setCoords([parseFloat(geo[0].lat), parseFloat(geo[0].lon)]);
        }
      } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
      }
    };

    if (cep) fetchCoords();
  }, [cep]);
  console.log(coords)

  if (!coords) return <p>Carregando mapa...</p>;

  return <Map coords={coords} />;
}
