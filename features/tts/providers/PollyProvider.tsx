"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Polly } from "../interfaces/Polly";
import { postRequest } from "../utils/requests";
import { TTSSelectionContext } from "./TTSSelectionProvider";

export const PollyContext = createContext<Polly | undefined>(undefined);

const usePollyInstance = () => {
  const ttsSelection = useContext(TTSSelectionContext);
  const [polly, setPolly] = useState<Polly>();

  useEffect(() => {
    if (ttsSelection) {
      const body = {
        Language: "en",
        InputText: ttsSelection.text,
      };

      postRequest<Polly>(
        "https://web-next-api-dev.azurewebsites.net/api/",
        "polly/tts",
        body
      ).then(
        (response) => {
          if (response) {
            setPolly(response);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, [ttsSelection]);

  return polly;
};

const PollyProvider = ({ children }: { children: ReactNode }) => {
  const polly = usePollyInstance();

  return (
    <PollyContext.Provider value={polly}>{children}</PollyContext.Provider>
  );
};
export default PollyProvider;
