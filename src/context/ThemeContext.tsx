import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme as useSystemScheme } from 'react-native';

export type Scheme = 'light' | 'dark';

type ThemeCtx = {
  scheme: Scheme;
  setScheme: (s: Scheme) => void;
  toggle: () => void;
};

const Ctx = createContext<ThemeCtx | undefined>(undefined);

export function ThemeProvider({ children, initialScheme }: { children: React.ReactNode; initialScheme?: Scheme | null }) {
  const sys = (initialScheme ?? useSystemScheme() ?? 'light') as Scheme;
  const [scheme, setScheme] = useState<Scheme>(sys);
  const toggle = useCallback(() => setScheme((s) => (s === 'light' ? 'dark' : 'light')), []);
  const value = useMemo(() => ({ scheme, setScheme, toggle }), [scheme, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppTheme must be used within ThemeProvider');
  return v;
}
