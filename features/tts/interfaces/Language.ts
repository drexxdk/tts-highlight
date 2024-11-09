import { LanguageCode } from "./LanguageCode";

export interface Language {
  // it has to be named "id" for HeadlessUI selection logic to work
  id: LanguageCode;
  name: string;
}
