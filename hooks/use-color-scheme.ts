import { useAppTheme } from '@/src/context/ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
	const { scheme } = useAppTheme();
	return scheme;
}
