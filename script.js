document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi HTML
    const passwordOutput = document.getElementById('passwordOutput');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');
    const numAnimalsInput = document.getElementById('numAnimals');
    const includeUppercaseCheckbox = document.getElementById('includeUppercase');
    const strengthIndicator = document.getElementById('strengthIndicator');

    // Variabile per l'array degli animali. Verrà popolata dinamicamente.
    let animals = []; 

    // Caratteri speciali ristretti come richiesto
    const specialChars = '@#$%&*?!+';

    // Funzione per ottenere un elemento casuale da un array
    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Funzione per capitalizzare la prima e l'ultima lettera di una stringa
    function applyCapitalization(animalName) {
        if (animalName.length === 0) return '';
        if (animalName.length === 1) return animalName.charAt(0).toUpperCase();
        
        let firstChar = animalName.charAt(0).toUpperCase();
        let lastChar = animalName.charAt(animalName.length - 1).toUpperCase();
        let middleChars = animalName.slice(1, -1).toLowerCase();
        
        return firstChar + middleChars + lastChar;
    }

    // Funzione per generare una stringa di numeri casuali
    function generateRandomNumberString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    // Funzione per generare un numero casuale di caratteri speciali (tra 1 e 3)
    function generateRandomSpecialChars(min = 1, max = 3) {
        const numChars = Math.floor(Math.random() * (max - min + 1)) + min;
        let chars = '';
        for (let i = 0; i < numChars; i++) {
            chars += getRandomItem(specialChars);
        }
        return chars;
    }

    // Funzione principale per generare la password
    function generatePassword() {
        // Se la lista degli animali non è ancora caricata, avvisa e esci
        if (animals.length === 0) {
            strengthIndicator.textContent = 'Caricamento animali in corso... Riprova tra un istante.';
            strengthIndicator.className = 'strength-indicator weak';
            return '';
        }

        const numAnimalsToUse = parseInt(numAnimalsInput.value);
        const shouldIncludeUppercase = includeUppercaseCheckbox.checked;

        if (numAnimalsToUse < 1) {
            alert("Il numero di animali deve essere almeno 1.");
            return '';
        }

        // Controllo per evitare di chiedere più animali di quanti disponibili
        if (numAnimalsToUse > animals.length) {
            alert(`Non ci sono abbastanza animali unici. Scegli un numero massimo di ${animals.length} animali.`);
            return '';
        }

        let passwordSegments = [];
        let availableAnimals = [...animals]; // Crea una copia per non modificare l'array originale
        let totalAnimalCharsLength = 0; // Inizializza la lunghezza totale dei caratteri degli animali

        // 1. Genera i nomi degli animali unici con maiuscole (prima e ultima lettera) e caratteri speciali alla fine
        for (let i = 0; i < numAnimalsToUse; i++) {
            const randomIndex = Math.floor(Math.random() * availableAnimals.length);
            let animal = availableAnimals[randomIndex];
            availableAnimals.splice(randomIndex, 1); // Rimuovi l'animale selezionato

            totalAnimalCharsLength += animal.length; // Aggiungi la lunghezza dell'animale (senza speciali)

            if (shouldIncludeUppercase) {
                animal = applyCapitalization(animal);
            } else {
                animal = animal.toLowerCase(); // Se non maiuscole, assicurati sia tutto minuscolo
            }

            // Aggiungi 1 o più caratteri speciali alla fine del nome dell'animale
            animal += generateRandomSpecialChars();
            passwordSegments.push(animal);
        }

        // 2. Separa gli animali con uno o più caratteri speciali (se ci sono più animali)
        let animalPartsWithSeparators = '';
        if (passwordSegments.length > 0) {
            animalPartsWithSeparators = passwordSegments[0];
            for (let i = 1; i < passwordSegments.length; i++) {
                animalPartsWithSeparators += generateRandomSpecialChars(); // Separatore tra animali
                animalPartsWithSeparators += passwordSegments[i];
            }
        }
        
        // 3. Genera la sequenza numerica basata sulla lunghezza degli animali
        let numberSequenceLength = Math.max(3, Math.min(6, Math.floor(totalAnimalCharsLength / 2)));
        
        let numberSegment = generateRandomNumberString(numberSequenceLength);

        // 4. Assembla la password finale
        let finalPassword = animalPartsWithSeparators + numberSegment;

        return finalPassword;
    }

    // Funzione per valutare la forza della password (nessuna modifica)
    function evaluatePasswordStrength(password) {
        let strength = 0;
        let feedback = '';

        if (password.length < 14) {
            strength = 0;
            feedback = 'Molto debole: troppo corta (minimo 14-16 caratteri suggeriti).';
        } else if (password.length < 18) {
            strength += 25;
            feedback = 'Debole: considera una lunghezza maggiore.';
        } else if (password.length >= 18) {
            strength += 50;
        }

        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChars = /[@#$%&*?!+]/.test(password);

        let charTypesCount = 0;
        if (hasLowercase) charTypesCount++;
        if (hasUppercase) charTypesCount++;
        if (hasNumbers) charTypesCount++;
        if (hasSpecialChars) charTypesCount++;

        if (charTypesCount >= 4) {
            strength += 50;
        } else if (charTypesCount === 3) {
            strength += 30;
            feedback += ' Include 3 tipi di caratteri.';
        } else if (charTypesCount === 2) {
            strength += 10;
            feedback += ' Include 2 tipi di caratteri.';
        } else {
            feedback += ' Troppo pochi tipi di caratteri.';
        }

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
        // Solo valuta la forza se la password è stata effettivamente generata
        if (newPassword) { 
            evaluatePasswordStrength(newPassword);
        }
    });

    copyButton.addEventListener('click', () => {
        if (passwordOutput.value) {
            navigator.clipboard.writeText(passwordOutput.value).then(() => {
                copyButton.textContent = 'Copiato!';
                setTimeout(() => {
                    copyButton.textContent = 'Copia';
                }, 2000);
            }).catch(err => {
                console.error('Errore nella copia: ', err);
                alert('Impossibile copiare la password. Controlla i permessi del browser.');
            });
        }
    });

    // --- NUOVA LOGICA: Caricamento dinamico degli animali ---
    async function loadAnimals() {
        try {
            // Utilizza fetch per caricare il file animals.json
            const response = await fetch('animals.json');
            if (!response.ok) {
                throw new Error(`Errore di caricamento: ${response.status} ${response.statusText}`);
            }
            animals = await response.json(); // Parcela la risposta JSON nell'array animals
            console.log('Animali caricati con successo:', animals.length);
            // Genera la prima password solo dopo che gli animali sono stati caricati
            generateButton.click(); 
        } catch (error) {
            console.error("Impossibile caricare la lista degli animali:", error);
            strengthIndicator.textContent = "Errore: impossibile caricare lista animali. Riprova più tardi.";
            strengthIndicator.className = 'strength-indicator weak';
            // Disabilita il pulsante di generazione se non si possono caricare gli animali
            generateButton.disabled = true;
        }
    }

    // Carica gli animali all'avvio dell'applicazione
    loadAnimals();
});