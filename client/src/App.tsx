
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { UIConfig } from '../../server/src/schema';

function App() {
  const [uiConfig, setUiConfig] = useState<UIConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usesFallback, setUsesFallback] = useState(false);

  // Fallback configuration to ensure the button is always displayed
  const fallbackConfig: UIConfig = {
    buttonText: 'hello',
    buttonColor: 'red',
    buttonAction: null
  };

  // useCallback to memoize function used in useEffect
  const loadUIConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const config = await trpc.getUIConfig.query();
      setUiConfig(config);
      setUsesFallback(false);
    } catch (err) {
      console.error('Failed to load UI configuration, using fallback:', err);
      // Use fallback configuration to ensure the button is displayed
      setUiConfig(fallbackConfig);
      setUsesFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps since trpc is stable

  // useEffect with proper dependencies
  useEffect(() => {
    loadUIConfig();
  }, [loadUIConfig]);

  // Handle button click (no action as per requirement)
  const handleButtonClick = () => {
    // Button performs no action when clicked as specified
    console.log('Button clicked - no action performed');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // Always render the button, either from server config or fallback
  const config = uiConfig || fallbackConfig;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {usesFallback && (
        <p className="text-sm text-gray-500 mb-4">
          Using fallback configuration (server unavailable)
        </p>
      )}
      <Button
        onClick={handleButtonClick}
        className={`
          px-6 py-3 text-white font-medium rounded-md shadow-md
          ${config.buttonColor === 'red' 
            ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
            : 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2
        `}
      >
        {config.buttonText}
      </Button>
    </div>
  );
}

export default App;
