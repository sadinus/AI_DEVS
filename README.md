# Skrypt AI_DEVS

Projekt do rozwiązywania zadań z API od AI_DEVS.

## Pierwsze uruchomienie

1. Pobieramy repozytorium na swój komputer `git clone 'https://github.com/sadinus/AI_DEVS'`
2. Instalujemy zależności projektu `npm i`
3. Utwórz plik `.env` w katalogu głównym, który będzie wyglądał następująco

   ```
   API_KEY=twój-api-key
   API_URL=https://tasks.aidevs.pl/
   ```

## Korzystanie ze skryptu

- Uwierzytelnienie i pobranie treści zadania `npm run task` (zawsze upewniamy się czy autoryzacja i pobranie zadania przebiegy pomyślnie, sprawdzając odpowiedź w konsoli)
- Wprowadzenie odpowiedzi:
  1.  zmodyfikuj plik `src/answer`, tak aby wprowadzał prawidłową odpowiedż i pobrany token
  2.  uruchomiamy skrypt `npm run answer`
