## Features

- Selected text player
- Previous/Next word button functionality
- Previous/Next sentence button functionality
- Selection that stays until the player closes (Except for Firefox)
- Supports selection across different react components
- Active word highlight (Except for Firefox)
- Polly integration
- No rerender of react components for TTS or Highlight
- Reads and highlights correctly on all tested markup structures
- Works on all browsers and devices
- Change playback rate
- Automatic punctuations on sentence endings for text given to polly, to get correct sentence seperations.
- Change language
- Ignore elements that has specific data-attribute
- Support for alternative being used for TTS on element instead of what is visually shown

## Missing

- Support all languages specified here [https://bitbucket.org/alineadigital/next-api/src/master/Alinea.Api.Next/Controllers/PollyController.cs](https://bitbucket.org/alineadigital/next-api/src/master/Alinea.Api.Next/Controllers/PollyController.cs)
- Switch polly audio files when needed (it only uses first file currently)
- Full page player
- Duration slider

## Wish list

- Firefox Highlight API support [https://bugzilla.mozilla.org/show_bug.cgi?id=1703961](https://bugzilla.mozilla.org/show_bug.cgi?id=1703961)
- Auto detect text language
- Support multiple spoken languages at the same time
- Audio streaming instead of mp3
- Some way of giving ::highlight higher z-index than ::selection
- More options for ::highlight styling
