# AI_DEVS

Projekt do rozwiązywania zadań z API od AI_DEVS.

## Wymagany software

1. Poleceniem `node -v` sprawdź wersję Node.js, jeśli komenda jest nieznana pobierz [Node.js](https://nodejs.org/en/download),
2. Poleceniem `git -v` sprawdź wersję Git, jeśli komenda jest nieznana pobierz [Git](https://git-scm.com/downloads),
3. Dowolny edytor tekstu, np. [Visual Studio Code](https://code.visualstudio.com/).

## Pierwsze uruchomienie

1. Pobierz repozytorium `git clone 'https://github.com/sadinus/AI_DEVS'`,
2. Otwórz folder projektu w edytorze tekstu i uruchom terminal w tej samej ścieżce,
3. Zainstaluj zależności projektu, wpisując w konsoli `npm i`,
4. Utwórz plik `.env` w katalogu głównym, który będzie wyglądał następująco:

   ```
   API_URL=https://tasks.aidevs.pl/
   ```

5. Ustaw API key w zmiennej środowiskowej zgodnie z [dokumentacją](https://platform.openai.com/docs/quickstart?context=node),

6. Uzupełnij pliki `src/task.ts` oraz `src/answer.ts` zgodnie z komentarzami.

## Korzystanie ze skryptu

- Uwierzytelnienie i pobranie treści zadania `npm run task` (zawsze upewniamy się czy autoryzacja i pobranie zadania przebiegy pomyślnie, sprawdzając odpowiedź w konsoli).
- Wprowadzenie odpowiedzi:
  1.  Zmodyfikuj plik `src/answer`, tak aby wprowadzał prawidłową odpowiedż i pobrany token,
  2.  Uruchomiamy skrypt `npm run answer`.
