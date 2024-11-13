import { useEffect } from 'react';
import { Polly, PollyRequest } from '../interfaces/Polly';
import { PollyBody } from '../interfaces/PollyBody';
import { useTTSWithHighlightStore } from '../stores/useTTSWithHighlightStore';
import { postRequest } from '../utils/requests';

const POLLY_API_ROOT = 'https://web-next-api-dev.azurewebsites.net/api/';
const POLLY_API_URL = 'polly/tts';

export const useLoadPolly = () => {
  const textSelection = useTTSWithHighlightStore((state) => state.textSelection);
  const polly = useTTSWithHighlightStore((state) => state.polly);
  const selectedLanguage = useTTSWithHighlightStore((state) => state.selectedLanguage);
  const playRequested = useTTSWithHighlightStore((state) => state.playRequested);
  const setPolly = useTTSWithHighlightStore((state) => state.setPolly);
  useEffect(() => {
    if (textSelection && selectedLanguage && !polly && playRequested) {
      const body: PollyBody = {
        Language: selectedLanguage.id,
        InputText: textSelection.inputText,
      };
      if (textSelection.inputText) {
        postRequest<PollyRequest>(POLLY_API_ROOT, POLLY_API_URL, body).then(
          (response) => {
            if (response) {
              const polly: Polly = {
                audio: response.Audio,
                marks: response.Marks,
                hasMultipleWords: response.Marks.filter((mark) => mark.type === 'word').length > 1,
                hasMultipleSentences: response.Marks.filter((mark) => mark.type === 'sentence').length > 1,
              };
              setPolly(polly);
            }
          },
          (error) => {
            console.log(error);
          },
        );
      }
    }
  }, [textSelection, selectedLanguage, setPolly, polly, playRequested]);
};
