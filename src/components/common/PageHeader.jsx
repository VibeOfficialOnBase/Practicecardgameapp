import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function PageHeader({ title, subtitle, backUrl }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 mb-8 pt-4">
      {backUrl && (
        <div className="mb-2">
          <Button
            variant="ghost"
            className="pl-0 hover:bg-transparent"
            onClick={() => navigate(backUrl)}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
        </div>
      )}
      <div>
        <h1 className="text-3xl md:text-4xl mb-2">{title}</h1>
        {subtitle && <p className="text-[var(--text-secondary)] text-lg">{subtitle}</p>}
      </div>
    </div>
  );
}
