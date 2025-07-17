document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi HTML
    const passwordOutput = document.getElementById('passwordOutput');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');
    const numAnimalsInput = document.getElementById('numAnimals');
    const numLengthInput = document.getElementById('numLength');
    const includeUppercaseCheckbox = document.getElementById('includeUppercase');
    const strengthIndicator = document.getElementById('strengthIndicator');

    // Array di nomi di animali (puoi espanderlo!)
    const animals = [
        'leone', 'tigre', 'elefante', 'giraffa', 'serpente', 'aquila', 'orso', 'zebra',
        'cervo', 'lupo', 'volpe', 'puma', 'koala', 'panda', 'scoiattolo', 'fenicottero',
        'rinoceronte', 'ippopotamo', 'coccodrillo', 'canguro', 'iguana', 'pinguino',
        'balena', 'delfino', 'squalo', 'polpo', 'tartaruga', 'alligatore', 'bufalo',
        'chimpanzé', 'gorilla', 'struzzo', 'ghepardo', 'furetto', 'castoro', 'ornitorinco',
        'tasso', 'suricato', 'cammello', 'lama', 'alpaca', 'fenice', 'unicorno' // Anche un tocco di fantasia!
    ];

    // Caratteri speciali sicuri
    const specialChars = '!@#$%^&*()_-+=[]{};:,.<>?';

    // Funzione per ottenere un elemento casuale da un array
    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Funzione per capitalizzare la prima lettera di una stringa
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Funzione per generare una stringa di numeri casuali
    function generateRandomNumberString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    // Funzione principale per generare la password
    function generatePassword() {
        const numAnimalsToUse = parseInt(numAnimalsInput.value);
        const numberSequenceLength = parseInt(numLengthInput.value);
        const shouldIncludeUppercase = includeUppercaseCheckbox.checked;

        if (numAnimalsToUse < 1 || numberSequenceLength < 1) {
            alert("Il numero di animali e la lunghezza dei numeri devono essere almeno 1.");
            return '';
        }

        let animalSegment = '';
        let generatedAnimals = [];

        // 1. Genera e concatena i nomi degli animali
        for (let i = 0; i < numAnimalsToUse; i++) {
            let animal = getRandomItem(animals);
            if (shouldIncludeUppercase && Math.random() > 0.5) { // Capitalizza casualmente
                animal = capitalizeFirstLetter(animal);
            }
            generatedAnimals.push(animal);
        }
        animalSegment = generatedAnimals.join('');

        // 2. Genera la sequenza numerica
        let numberSegment = generateRandomNumberString(numberSequenceLength);

        // 3. Scegli i tre caratteri speciali
        const charStart = getRandomItem(specialChars);
        const charEnd = getRandomItem(specialChars);
        const charMiddle = getRandomItem(specialChars);

        // 4. Assembla la password in base alle regole:
        // Inizio: charStart
        // Poi: Segmento Animali
        // Poi: (temporaneamente) Segmento Numeri
        // Fine: charEnd
        // Infine, inserisce charMiddle al centro.

        let rawPassword = charStart + animalSegment + numberSegment + charEnd;

        // Inserisci il carattere speciale al centro
        // Trova il punto medio, arrotondando per eccesso per evitare problemi con lunghezze pari
        const midPoint = Math.floor(rawPassword.length / 2); 
        let finalPassword = rawPassword.slice(0, midPoint) + charMiddle + rawPassword.slice(midPoint);

        return finalPassword;
    }

    // Funzione per valutare la forza della password
    function evaluatePasswordStrength(password) {
        let strength = 0;
        let feedback = '';

        // Controlli sulla lunghezza
        if (password.length < 8) {
            strength = 0;
            feedback = 'Molto debole: troppo corta.';
        } else if (password.length < 12) {
            strength += 20;
            feedback = 'Debole: considera una lunghezza maggiore.';
        } else if (password.length >= 12) {
            strength += 40; // Base per password lunghe
        }

        // Tipi di caratteri
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChars = /[!@#$%^&*()_\-+=\[\]{};:,.<>?]/.test(password);

        let charTypesCount = 0;
        if (hasLowercase) charTypesCount++;
        if (hasUppercase) charTypesCount++;
        if (hasNumbers) charTypesCount++;
        if (hasSpecialChars) charTypesCount++;

        if (charTypesCount >= 4) {
            strength += 60; // Tutti i tipi di caratteri
        } else if (charTypesCount === 3) {
            strength += 40;
            feedback += ' Include 3 tipi di caratteri.';
        } else if (charTypesCount === 2) {
            strength += 20;
            feedback += ' Include 2 tipi di caratteri.';
        } else {
            feedback += ' Troppo pochi tipi di caratteri.';
        }

        // Aggiorna l'indicatore di forza
        if (strength >= 90) {
            strengthIndicator.textContent = 'Forza: Fortissima! 💪';
            strengthIndicator.className = 'strength-indicator strong';
        } else if (strength >= 70) {
            strengthIndicator.textContent = 'Forza: Forte 👍';
            strengthIndicator.className = 'strength-indicator strong';
        } else if (strength >= 40) {
            strengthIndicator.textContent = 'Forza: Media 🤔' + (feedback ? ' - ' + feedback : '');
            strengthIndicator.className = 'strength-indicator medium';
        } else {
            strengthIndicator.textContent = 'Forza: Debole 😟' + (feedback ? ' - ' + feedback : '');
            strengthIndicator.className = 'strength-indicator weak';
        }
    }

    // Event Listeners
    generateButton.addEventListener('click', () => {
        const newPassword = generatePassword();
        passwordOutput.value = newPassword;
        evaluatePasswordStrength(newPassword);
    });

    copyButton.addEventListener('click', () => {
        if (passwordOutput.value) {
            navigator.clipboard.writeText(passwordOutput.value).then(() => {
                copyButton.textContent = 'Copiato!';
                // Resetta il testo del bottone dopo 2 secondi
                setTimeout(() => {
                    copyButton.textContent = 'Copia';
                }, 2000);
            }).catch(err => {
                console.error('Errore nella copia: ', err);
                alert('Impossibile copiare la password. Controlla i permessi del browser.');
            });
        }
    });

    // Genera una password all'avvio dell'applicazione
    generateButton.click();
});