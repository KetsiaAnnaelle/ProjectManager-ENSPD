import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Un composant bouton simple pour le test
const SimpleButton = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

describe('Tests basiques du composant Bouton', () => {
    it('devrait rendre le bouton avec le texte correct', () => {
        render(<SimpleButton>Cliquez-moi</SimpleButton>);
        const bouton = screen.getByText('Cliquez-moi');
        expect(bouton).toBeDefined();
    });
});
