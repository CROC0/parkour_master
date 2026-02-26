import { Question } from '@/types';

const questionsByYear: Record<number, Question[]> = {
  1: [
    // Maths
    { question: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is 3 + 4?', options: ['5', '6', '7', '8'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 5 - 2?', options: ['1', '2', '3', '4'], answerIndex: 2, subject: 'Maths' },
    { question: 'How many fingers are on 2 hands?', options: ['8', '9', '10', '11'], answerIndex: 2, subject: 'Maths' },
    { question: 'Which number comes after 9?', options: ['8', '10', '11', '12'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is 2 + 2?', options: ['2', '3', '4', '5'], answerIndex: 2, subject: 'Maths' },
    { question: 'How many days are in a week?', options: ['5', '6', '7', '8'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 10 - 4?', options: ['4', '5', '6', '7'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 1 + 1?', options: ['1', '2', '3', '4'], answerIndex: 1, subject: 'Maths' },
    { question: 'How many sides does a rectangle have?', options: ['2', '3', '4', '5'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 9 - 5?', options: ['2', '3', '4', '5'], answerIndex: 2, subject: 'Maths' },
    { question: 'Which number is the biggest?', options: ['3', '7', '5', '9'], answerIndex: 3, subject: 'Maths' },
    // English
    { question: 'Which letter makes the "ssss" sound?', options: ['b', 's', 't', 'p'], answerIndex: 1, subject: 'English' },
    { question: 'What comes at the end of a sentence?', options: ['comma', 'question mark or full stop', 'apostrophe', 'dash'], answerIndex: 1, subject: 'English' },
    { question: 'Which word rhymes with "cat"?', options: ['dog', 'bat', 'cup', 'hen'], answerIndex: 1, subject: 'English' },
    { question: 'How many vowels are in the alphabet?', options: ['4', '5', '6', '7'], answerIndex: 1, subject: 'English' },
    { question: 'What letter makes the "mmm" sound?', options: ['n', 'b', 'm', 'p'], answerIndex: 2, subject: 'English' },
    { question: 'Which word starts with the letter "D"?', options: ['cat', 'dog', 'hat', 'sun'], answerIndex: 1, subject: 'English' },
    // Science
    { question: 'What do plants need to grow?', options: ['Only water', 'Only sun', 'Sun, water and soil', 'Just soil'], answerIndex: 2, subject: 'Science' },
    { question: 'Which animal lays eggs?', options: ['Cat', 'Dog', 'Chicken', 'Cow'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the sun?', options: ['A planet', 'A star', 'A moon', 'A cloud'], answerIndex: 1, subject: 'Science' },
    { question: 'How many legs does an insect have?', options: ['4', '6', '8', '10'], answerIndex: 1, subject: 'Science' },
    { question: 'Which season is the coldest in Australia?', options: ['Summer', 'Autumn', 'Winter', 'Spring'], answerIndex: 2, subject: 'Science' },
  ],
  2: [
    // Maths
    { question: 'What is 7 + 8?', options: ['13', '14', '15', '16'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 12 - 5?', options: ['5', '6', '7', '8'], answerIndex: 2, subject: 'Maths' },
    { question: 'How many centimetres are in a metre?', options: ['10', '50', '100', '1000'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is double 6?', options: ['10', '11', '12', '13'], answerIndex: 2, subject: 'Maths' },
    { question: 'Which shape has 4 equal sides?', options: ['Rectangle', 'Triangle', 'Square', 'Circle'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 5 + 9?', options: ['12', '13', '14', '15'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 4 × 3?', options: ['10', '11', '12', '13'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 20 - 8?', options: ['10', '11', '12', '13'], answerIndex: 2, subject: 'Maths' },
    { question: 'How many sides does a pentagon have?', options: ['4', '5', '6', '7'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is half of 16?', options: ['6', '7', '8', '9'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 3 + 9?', options: ['11', '12', '13', '14'], answerIndex: 1, subject: 'Maths' },
    // English
    { question: 'What is a noun?', options: ['An action word', 'A describing word', 'A naming word', 'A joining word'], answerIndex: 2, subject: 'English' },
    { question: 'Which word is spelled correctly?', options: ['becaus', 'because', 'becauze', 'becawse'], answerIndex: 1, subject: 'English' },
    { question: 'How many syllables are in "elephant"?', options: ['2', '3', '4', '5'], answerIndex: 1, subject: 'English' },
    { question: 'What is an adjective?', options: ['An action word', 'A describing word', 'A naming word', 'A joining word'], answerIndex: 1, subject: 'English' },
    { question: 'Which word is a verb?', options: ['happy', 'cat', 'jump', 'blue'], answerIndex: 2, subject: 'English' },
    { question: 'Which punctuation mark is used for questions?', options: ['Full stop', 'Exclamation mark', 'Comma', 'Question mark'], answerIndex: 3, subject: 'English' },
    { question: 'What is the opposite of "hot"?', options: ['Warm', 'Cold', 'Wet', 'Dry'], answerIndex: 1, subject: 'English' },
    // Science
    { question: 'What state of matter is ice?', options: ['Gas', 'Liquid', 'Solid', 'Plasma'], answerIndex: 2, subject: 'Science' },
    { question: 'What do we call baby frogs?', options: ['Tadpoles', 'Calves', 'Kittens', 'Piglets'], answerIndex: 0, subject: 'Science' },
    { question: 'Which season comes after summer in Australia?', options: ['Spring', 'Winter', 'Autumn', 'Summer'], answerIndex: 2, subject: 'Science' },
    { question: 'What do we call animals that eat both plants and meat?', options: ['Herbivores', 'Carnivores', 'Omnivores', 'Predators'], answerIndex: 2, subject: 'Science' },
  ],
  3: [
    // Maths
    { question: 'What is 6 × 7?', options: ['36', '40', '42', '48'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 48 ÷ 6?', options: ['6', '7', '8', '9'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is half of 50?', options: ['20', '25', '30', '35'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is ¼ of 20?', options: ['4', '5', '8', '10'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is 3 × 8?', options: ['21', '22', '23', '24'], answerIndex: 3, subject: 'Maths' },
    { question: 'How many minutes in an hour?', options: ['30', '45', '60', '100'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 7 × 8?', options: ['54', '56', '58', '60'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is 45 ÷ 5?', options: ['7', '8', '9', '10'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is ½ of 30?', options: ['10', '12', '15', '20'], answerIndex: 2, subject: 'Maths' },
    { question: 'How many seconds are in a minute?', options: ['30', '45', '60', '100'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 9 × 4?', options: ['32', '34', '36', '38'], answerIndex: 2, subject: 'Maths' },
    // English
    { question: 'What is a verb?', options: ['A naming word', 'An action word', 'A describing word', 'A joining word'], answerIndex: 1, subject: 'English' },
    { question: 'What is the plural of "child"?', options: ['childs', 'childes', 'children', 'childrens'], answerIndex: 2, subject: 'English' },
    { question: 'What is a noun?', options: ['An action word', 'A describing word', 'A naming word', 'A joining word'], answerIndex: 2, subject: 'English' },
    { question: 'Which word is spelled correctly?', options: ['frend', 'freind', 'friend', 'freiend'], answerIndex: 2, subject: 'English' },
    // Science
    { question: 'What does a plant use to make food from sunlight?', options: ['Roots', 'Flowers', 'Leaves', 'Seeds'], answerIndex: 2, subject: 'Science' },
    { question: 'Which planet is closest to the Sun?', options: ['Earth', 'Venus', 'Mars', 'Mercury'], answerIndex: 3, subject: 'Science' },
    { question: 'What does a magnet do?', options: ['Produces light', 'Attracts magnetic metals', 'Creates heat', 'Makes electricity'], answerIndex: 1, subject: 'Science' },
    { question: 'In a food chain, what is an animal that eats plants called?', options: ['Predator', 'Carnivore', 'Primary consumer', 'Decomposer'], answerIndex: 2, subject: 'Science' },
    // HASS
    { question: 'What is the capital city of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], answerIndex: 2, subject: 'HASS' },
    { question: 'Which ocean is on the east coast of Australia?', options: ['Indian Ocean', 'Pacific Ocean', 'Southern Ocean', 'Arctic Ocean'], answerIndex: 1, subject: 'HASS' },
    { question: 'What famous rock is found in the Northern Territory?', options: ['Blue Mountains', 'Uluru', 'Mount Kosciuszko', 'The Pinnacles'], answerIndex: 1, subject: 'HASS' },
  ],
  4: [
    // Maths
    { question: 'What is 9 × 9?', options: ['72', '79', '81', '84'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 72 ÷ 8?', options: ['7', '8', '9', '10'], answerIndex: 2, subject: 'Maths' },
    { question: 'What fraction is the same as 0.5?', options: ['¼', '⅓', '½', '¾'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the perimeter of a square with sides of 5cm?', options: ['10 cm', '15 cm', '20 cm', '25 cm'], answerIndex: 2, subject: 'Maths' },
    { question: 'Round 347 to the nearest hundred.', options: ['300', '340', '350', '400'], answerIndex: 0, subject: 'Maths' },
    { question: 'What is 8 × 7?', options: ['54', '56', '58', '60'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is 63 ÷ 9?', options: ['6', '7', '8', '9'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the area of a rectangle 8m × 3m?', options: ['11 m²', '22 m²', '24 m²', '30 m²'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 3/4 as a decimal?', options: ['0.25', '0.5', '0.75', '1.0'], answerIndex: 2, subject: 'Maths' },
    // English
    { question: 'What is an adjective?', options: ['An action word', 'A naming word', 'A describing word', 'A joining word'], answerIndex: 2, subject: 'English' },
    { question: 'What is a synonym for "happy"?', options: ['Sad', 'Angry', 'Joyful', 'Tired'], answerIndex: 2, subject: 'English' },
    { question: 'What does "antonym" mean?', options: ['A word with the same meaning', 'A word with the opposite meaning', 'A word that sounds the same', 'A describing word'], answerIndex: 1, subject: 'English' },
    { question: 'What is a conjunction?', options: ['A naming word', 'An action word', 'A joining word', 'A describing word'], answerIndex: 2, subject: 'English' },
    // Science
    { question: 'How does sound travel?', options: ['Through light waves', 'Through vibrations', 'Through magnets', 'Through heat'], answerIndex: 1, subject: 'Science' },
    { question: 'What type of energy does the Sun give us?', options: ['Chemical energy', 'Sound energy', 'Light and heat energy', 'Kinetic energy'], answerIndex: 2, subject: 'Science' },
    { question: 'Which planet is closest to Earth on average?', options: ['Mars', 'Jupiter', 'Venus', 'Saturn'], answerIndex: 2, subject: 'Science' },
    // HASS
    { question: 'What is the largest state in Australia?', options: ['NSW', 'Victoria', 'Queensland', 'Western Australia'], answerIndex: 3, subject: 'HASS' },
    { question: 'How many states are in Australia?', options: ['5', '6', '7', '8'], answerIndex: 1, subject: 'HASS' },
    { question: 'Who were the first people to live in Australia?', options: ['British settlers', 'Aboriginal and Torres Strait Islander peoples', 'Dutch explorers', 'Chinese settlers'], answerIndex: 1, subject: 'HASS' },
    { question: 'What is the subject that studies countries, climates, and landforms?', options: ['Biology', 'Geography', 'Geology', 'Astronomy'], answerIndex: 1, subject: 'HASS' },
    { question: 'What is the longest river in Australia?', options: ['Darling River', 'Murray River', 'Murrumbidgee River', 'Lachlan River'], answerIndex: 1, subject: 'HASS' },
    { question: 'What event happened on 26 January 1788 in Australia?', options: ['Federation of Australia', 'First Fleet arrived', 'Gold rush began', 'ANZAC Day'], answerIndex: 1, subject: 'HASS' },
  ],
  5: [
    // Maths
    { question: 'What is 25% of 200?', options: ['25', '40', '50', '75'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 3.5 × 4?', options: ['12', '13', '14', '15'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the area of a rectangle 6m × 4m?', options: ['10 m²', '20 m²', '24 m²', '28 m²'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the lowest common multiple of 4 and 6?', options: ['8', '10', '12', '24'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 15% of 60?', options: ['6', '7', '9', '10'], answerIndex: 2, subject: 'Maths' },
    { question: '0.75 as a fraction is:', options: ['¼', '½', '⅔', '¾'], answerIndex: 3, subject: 'Maths' },
    { question: 'What are prime numbers?', options: ['Numbers divisible by 2', 'Numbers with exactly two factors: 1 and itself', 'Numbers greater than 10', 'Even numbers'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is 2³?', options: ['5', '6', '8', '9'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the perimeter of a square with sides of 9cm?', options: ['18 cm', '27 cm', '36 cm', '81 cm'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 40% of 50?', options: ['15', '20', '25', '30'], answerIndex: 1, subject: 'Maths' },
    { question: 'In BODMAS, what comes after brackets?', options: ['Addition', 'Multiplication', 'Division', 'Orders (powers)'], answerIndex: 3, subject: 'Maths' },
    // English
    { question: 'What is a metaphor?', options: ['A direct comparison using "like" or "as"', 'A comparison saying something IS something else', 'A repeated sound at the start of words', 'An exaggeration'], answerIndex: 1, subject: 'English' },
    { question: 'What is an adverb?', options: ['A naming word', 'A word that describes a verb', 'A joining word', 'A describing word for nouns'], answerIndex: 1, subject: 'English' },
    { question: 'What type of text is written to persuade?', options: ['Narrative', 'Procedural', 'Persuasive', 'Descriptive'], answerIndex: 2, subject: 'English' },
    // Science
    { question: 'What gas do plants absorb to make food?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the Earth\'s largest layer?', options: ['Crust', 'Mantle', 'Outer core', 'Inner core'], answerIndex: 1, subject: 'Science' },
    { question: 'Which planet is the largest in our solar system?', options: ['Saturn', 'Uranus', 'Neptune', 'Jupiter'], answerIndex: 3, subject: 'Science' },
    { question: 'What is the process by which water enters the atmosphere as vapour?', options: ['Condensation', 'Precipitation', 'Evaporation', 'Transpiration'], answerIndex: 2, subject: 'Science' },
    // HASS
    { question: 'Which explorer first circumnavigated Australia by sea?', options: ['James Cook', 'Matthew Flinders', 'Arthur Phillip', 'Abel Tasman'], answerIndex: 1, subject: 'HASS' },
    { question: 'What year did Australia become a federation?', options: ['1788', '1851', '1901', '1942'], answerIndex: 2, subject: 'HASS' },
    { question: 'In democracy, who holds power?', options: ['The military', 'The king or queen', 'The people', 'The church'], answerIndex: 2, subject: 'HASS' },
    { question: 'What year did the gold rush begin in Victoria?', options: ['1788', '1851', '1901', '1927'], answerIndex: 1, subject: 'HASS' },
  ],
  6: [
    // Maths
    { question: 'What is 12²?', options: ['122', '132', '144', '156'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the volume of a cube with sides of 3cm?', options: ['9 cm³', '18 cm³', '27 cm³', '36 cm³'], answerIndex: 2, subject: 'Maths' },
    { question: 'Convert 3/4 to a percentage.', options: ['50%', '65%', '75%', '80%'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the mean of 4, 8, 6, 10, 2?', options: ['5', '6', '7', '8'], answerIndex: 1, subject: 'Maths' },
    { question: 'If a ratio is 2:3 and the first part is 10, what is the second part?', options: ['12', '13', '14', '15'], answerIndex: 3, subject: 'Maths' },
    { question: 'What is -3 × 4?', options: ['-7', '-12', '7', '12'], answerIndex: 1, subject: 'Maths' },
    { question: 'What do the angles in a triangle add up to?', options: ['90°', '180°', '270°', '360°'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is 4² ÷ 4?', options: ['1', '2', '4', '8'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 3/5 as a decimal?', options: ['0.3', '0.5', '0.6', '0.8'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the median of 3, 5, 7, 9, 11?', options: ['5', '6', '7', '9'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 20% of 150?', options: ['20', '25', '30', '35'], answerIndex: 2, subject: 'Maths' },
    // English
    { question: 'What is alliteration?', options: ['Repetition of vowel sounds', 'Repetition of consonant sounds at the start of words', 'Comparing two unlike things', 'A word that sounds like its meaning'], answerIndex: 1, subject: 'English' },
    { question: 'What is onomatopoeia?', options: ['A word that is an exaggeration', 'A word that sounds like what it describes', 'Comparing two things using like or as', 'Giving human qualities to objects'], answerIndex: 1, subject: 'English' },
    { question: 'What is the purpose of a persuasive text?', options: ['To entertain', 'To inform', 'To convince the reader', 'To describe a process'], answerIndex: 2, subject: 'English' },
    // Science
    { question: 'What is the smallest planet in our solar system?', options: ['Mars', 'Venus', 'Mercury', 'Pluto'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the process where water vapour cools and becomes liquid?', options: ['Evaporation', 'Condensation', 'Precipitation', 'Transpiration'], answerIndex: 1, subject: 'Science' },
    { question: 'What is the term for plants that make their own food using sunlight?', options: ['Consumers', 'Decomposers', 'Producers', 'Omnivores'], answerIndex: 2, subject: 'Science' },
    { question: 'What causes day and night?', options: ['The Moon moving around Earth', 'The Earth\'s revolution around the Sun', 'The Earth\'s rotation on its axis', 'The Sun moving around Earth'], answerIndex: 2, subject: 'Science' },
    { question: 'What type of energy is stored in food?', options: ['Kinetic energy', 'Chemical energy', 'Nuclear energy', 'Sound energy'], answerIndex: 1, subject: 'Science' },
    // HASS
    { question: 'Which Australian state has the most people?', options: ['Victoria', 'New South Wales', 'Queensland', 'Western Australia'], answerIndex: 1, subject: 'HASS' },
    { question: 'What was the significance of 1 January 1901 in Australia?', options: ['The first fleet arrived', 'Australia became a federation', 'The first prime minister was elected', 'World War I began'], answerIndex: 1, subject: 'HASS' },
    { question: 'Which ancient wonder of the world is still standing?', options: ['Hanging Gardens of Babylon', 'Colossus of Rhodes', 'Great Pyramid of Giza', 'Lighthouse of Alexandria'], answerIndex: 2, subject: 'HASS' },
  ],
  7: [
    // Maths
    { question: 'Solve for x: 3x + 5 = 20', options: ['4', '5', '6', '7'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the probability of rolling a 6 on a standard die?', options: ['1/4', '1/5', '1/6', '1/8'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the value of π to 2 decimal places?', options: ['3.12', '3.14', '3.16', '3.18'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is -5 + 8?', options: ['-3', '2', '3', '13'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the HCF of 12 and 18?', options: ['3', '4', '6', '9'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the formula for the area of a circle?', options: ['2πr', 'πr²', 'πd', '2πd'], answerIndex: 1, subject: 'Maths' },
    { question: 'Solve: 2x + 4 = 14', options: ['4', '5', '6', '7'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the ratio 12:8 simplified?', options: ['6:4', '3:2', '4:3', '2:3'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is 30% of 90?', options: ['24', '27', '30', '33'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the circumference formula for a circle?', options: ['πr²', '2πr', 'πd²', 'πr'], answerIndex: 1, subject: 'Maths' },
    // Science
    { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Cell membrane', 'Mitochondria', 'Ribosome'], answerIndex: 2, subject: 'Science' },
    { question: 'What type of rock is formed from cooled magma?', options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Composite'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the chemical symbol for water?', options: ['HO', 'H₂O', 'H₂O₂', 'HO₂'], answerIndex: 1, subject: 'Science' },
    { question: 'What does cell respiration do?', options: ['Breathing air in and out', 'Releasing energy from glucose', 'Making food from sunlight', 'Absorbing nutrients through roots'], answerIndex: 1, subject: 'Science' },
    { question: 'What makes a chemical change different from a physical change?', options: ['Physical changes are permanent', 'Chemical changes produce new substances', 'Physical changes involve heat', 'There is no difference'], answerIndex: 1, subject: 'Science' },
    { question: 'What is the backbone scientifically called?', options: ['Cranium', 'Femur', 'Vertebral column', 'Sternum'], answerIndex: 2, subject: 'Science' },
    // History & English
    { question: 'Which ancient civilisation built the pyramids?', options: ['Greeks', 'Romans', 'Egyptians', 'Mesopotamians'], answerIndex: 2, subject: 'History' },
    { question: 'In what year did Captain Cook arrive in Australia?', options: ['1750', '1770', '1788', '1800'], answerIndex: 1, subject: 'History' },
    { question: 'Which civilisation first developed democracy?', options: ['Roman', 'Egyptian', 'Greek', 'Persian'], answerIndex: 2, subject: 'History' },
    { question: 'What is a simile?', options: ['A comparison using "is"', 'A comparison using "like" or "as"', 'An exaggeration', 'A word that imitates a sound'], answerIndex: 1, subject: 'English' },
    { question: 'What is a conjunction?', options: ['A naming word', 'A word that connects clauses', 'An action word', 'A describing word'], answerIndex: 1, subject: 'English' },
    { question: 'How does a simile differ from a metaphor?', options: ['There is no difference', 'A simile uses "like" or "as", a metaphor does not', 'A metaphor uses "like" or "as", a simile does not', 'Similes are shorter'], answerIndex: 1, subject: 'English' },
  ],
  8: [
    // Maths
    { question: 'Solve: 2x - 3 = 11', options: ['5', '6', '7', '8'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 4³?', options: ['12', '24', '48', '64'], answerIndex: 3, subject: 'Maths' },
    { question: 'What is the area of a triangle with base 10cm and height 6cm?', options: ['16 cm²', '25 cm²', '30 cm²', '60 cm²'], answerIndex: 2, subject: 'Maths' },
    { question: 'Expand: 3(x + 4)', options: ['3x + 4', '3x + 7', '3x + 12', 'x + 12'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the gradient of the line y = 3x + 2?', options: ['2', '3', '5', '6'], answerIndex: 1, subject: 'Maths' },
    { question: 'Solve: 5x - 3 = 22', options: ['4', '5', '6', '7'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the probability of flipping heads on a fair coin?', options: ['1/4', '1/3', '1/2', '2/3'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the formula for the area of a triangle?', options: ['base × height', '½ × base × height', '2 × base × height', 'base + height'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the Pythagorean theorem?', options: ['a + b = c', 'a² + b² = c²', 'a × b = c', 'a² - b² = c²'], answerIndex: 1, subject: 'Maths' },
    // Science
    { question: 'What is the formula for speed?', options: ['distance × time', 'distance + time', 'distance ÷ time', 'time ÷ distance'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the atomic number of oxygen?', options: ['6', '7', '8', '9'], answerIndex: 2, subject: 'Science' },
    { question: 'What type of bond holds atoms together by sharing electrons?', options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'], answerIndex: 1, subject: 'Science' },
    { question: 'How many protons does carbon have?', options: ['4', '6', '8', '12'], answerIndex: 1, subject: 'Science' },
    { question: 'What law states that matter cannot be created or destroyed?', options: ['Law of Energy', 'Law of Conservation of Mass', 'Law of Gravity', 'Hooke\'s Law'], answerIndex: 1, subject: 'Science' },
    { question: 'What is the key difference between mitosis and meiosis?', options: ['They are the same process', 'Mitosis produces 2 identical cells; meiosis produces 4 sex cells', 'Meiosis produces 2 identical cells; mitosis produces 4 sex cells', 'Mitosis only happens in plants'], answerIndex: 1, subject: 'Science' },
    // History & English
    { question: 'What was the Industrial Revolution primarily associated with?', options: ['Agriculture', 'Steam power and factories', 'Art and culture', 'Exploration at sea'], answerIndex: 1, subject: 'History' },
    { question: 'What year did World War I begin?', options: ['1910', '1912', '1914', '1918'], answerIndex: 2, subject: 'History' },
    { question: 'Why were convicts sent to Australia?', options: ['To fight in wars', 'Punishment for crimes', 'To mine gold', 'To trade goods'], answerIndex: 1, subject: 'History' },
    { question: 'What is the theme of a text?', options: ['The main character', 'The plot summary', 'The central message or idea', 'The setting'], answerIndex: 2, subject: 'English' },
    { question: 'What is the key difference between fact and opinion?', options: ['Facts are more important', 'Facts can be proven; opinions are personal views', 'Opinions can be proven; facts are personal views', 'There is no difference'], answerIndex: 1, subject: 'English' },
    { question: 'What is the purpose of a thesis statement in an essay?', options: ['To summarise a story', 'To state the main argument', 'To introduce characters', 'To describe a setting'], answerIndex: 1, subject: 'English' },
    { question: 'What type of government does Australia have?', options: ['Monarchy', 'Republic', 'Constitutional monarchy and parliamentary democracy', 'Dictatorship'], answerIndex: 2, subject: 'Civics' },
  ],
  9: [
    // Maths
    { question: 'What is the gradient of a line through (0,3) and (2,7)?', options: ['1', '2', '3', '4'], answerIndex: 1, subject: 'Maths' },
    { question: 'Solve: x² = 49', options: ['x = 7', 'x = ±7', 'x = -7', 'x = 14'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is sin(30°)?', options: ['0.25', '0.5', '0.75', '1'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the Pythagorean theorem?', options: ['a + b = c', 'a² + b² = c²', 'a × b = c²', 'a² × b² = c'], answerIndex: 1, subject: 'Maths' },
    { question: 'Factorise: x² - 9', options: ['(x+3)(x-3)', '(x-3)²', '(x+9)(x-1)', '(x+3)²'], answerIndex: 0, subject: 'Maths' },
    { question: 'What is the quadratic formula?', options: ['x = (-b ± √(b²-4ac)) / 2a', 'x = (b ± √(b²+4ac)) / 2a', 'x = -b / 2a', 'x = b ± √(b²-4ac)'], answerIndex: 0, subject: 'Maths' },
    { question: 'What is tan(45°)?', options: ['0', '0.5', '1', '√2'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the interquartile range?', options: ['The range of all data', 'Q3 minus Q1', 'Q1 minus Q3', 'The median minus the mean'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is √(-1) called in mathematics?', options: ['Undefined', 'The imaginary unit i', 'Negative one', 'Zero'], answerIndex: 1, subject: 'Maths' },
    // Science
    { question: 'What is Newton\'s First Law of Motion?', options: ['F = ma', 'An object in motion stays in motion unless acted on by a force', 'Every action has an equal and opposite reaction', 'Energy cannot be created or destroyed'], answerIndex: 1, subject: 'Science' },
    { question: 'What is the chemical formula for carbon dioxide?', options: ['CO', 'CO₂', 'C₂O', 'C₂O₂'], answerIndex: 1, subject: 'Science' },
    { question: 'What carries genetic information in a cell?', options: ['RNA', 'ATP', 'DNA', 'Protein'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the key difference between ionic and covalent bonds?', options: ['Ionic bonds share electrons; covalent bonds transfer them', 'Covalent bonds share electrons; ionic bonds transfer them', 'They are the same', 'Ionic bonds are weaker'], answerIndex: 1, subject: 'Science' },
    { question: 'Which organelle is responsible for photosynthesis?', options: ['Mitochondria', 'Ribosome', 'Chloroplast', 'Nucleus'], answerIndex: 2, subject: 'Science' },
    { question: 'What is momentum?', options: ['Mass × acceleration', 'Mass × velocity', 'Force × distance', 'Mass × gravity'], answerIndex: 1, subject: 'Science' },
    // History & English
    { question: 'What was the cause of World War I?', options: ['Assassination of Archduke Franz Ferdinand and rising tensions', 'The bombing of Pearl Harbour', 'The rise of Hitler', 'The Russian Revolution'], answerIndex: 0, subject: 'History' },
    { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], answerIndex: 2, subject: 'History' },
    { question: 'What were the Stolen Generations?', options: ['Children taken during WWII', 'Aboriginal and Torres Strait Islander children removed from families by the government', 'Children sent to Australia as convicts', 'Child soldiers in WWI'], answerIndex: 1, subject: 'History' },
    { question: 'What does the High Court of Australia do?', options: ['Make new laws', 'Interpret and apply the Constitution', 'Elect the Prime Minister', 'Manage foreign affairs'], answerIndex: 1, subject: 'Civics' },
    { question: 'What literary device gives human qualities to non-human things?', options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], answerIndex: 2, subject: 'English' },
    { question: 'What is a complex sentence?', options: ['A very long sentence', 'A sentence with an independent and dependent clause', 'A sentence with two main clauses', 'A sentence with three or more commas'], answerIndex: 1, subject: 'English' },
    { question: 'What distinguishes a novella from a novel?', options: ['Novellas are longer than novels', 'Novellas are shorter than novels', 'They are the same', 'Novellas are always non-fiction'], answerIndex: 1, subject: 'English' },
  ],
  10: [
    // Maths
    { question: 'Factorise: x² + 5x + 6', options: ['(x+1)(x+6)', '(x+2)(x+3)', '(x-2)(x-3)', '(x+2)(x-3)'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is cos(60°)?', options: ['0.25', '0.5', '√2/2', '1'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the standard deviation a measure of?', options: ['The average value', 'The spread of data', 'The median', 'The mode'], answerIndex: 1, subject: 'Maths' },
    { question: 'Solve: 2x² - 8 = 0', options: ['x = ±2', 'x = 2', 'x = 4', 'x = ±4'], answerIndex: 0, subject: 'Maths' },
    { question: 'What is the derivative of x²?', options: ['x', '2x', 'x³', '2x²'], answerIndex: 1, subject: 'Maths' },
    { question: 'Solve: x² - 5x + 6 = 0', options: ['x = 1, 6', 'x = 2, 3', 'x = -2, -3', 'x = 1, -6'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is cos(0°)?', options: ['0', '0.5', '1', '-1'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the probability of drawing an ace from a standard 52-card deck?', options: ['1/52', '1/13', '1/4', '1/12'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is log₂(8)?', options: ['2', '3', '4', '8'], answerIndex: 1, subject: 'Maths' },
    // Science
    { question: 'What is Ohm\'s Law?', options: ['V = P/I', 'V = IR', 'V = I/R', 'V = I²R'], answerIndex: 1, subject: 'Science' },
    { question: 'What is pH 7?', options: ['Acidic', 'Neutral', 'Alkaline', 'Highly acidic'], answerIndex: 1, subject: 'Science' },
    { question: 'What is natural selection?', options: ['Humans selecting which animals to breed', 'Organisms with favourable traits surviving and reproducing more', 'Random genetic mutations only', 'The extinction of species'], answerIndex: 1, subject: 'Science' },
    { question: 'What does Newton\'s Second Law state?', options: ['Objects in motion stay in motion', 'Force equals mass times acceleration', 'Every action has an equal and opposite reaction', 'Energy is conserved'], answerIndex: 1, subject: 'Science' },
    { question: 'What organises elements in the periodic table?', options: ['Alphabetical order', 'Atomic number', 'Mass number', 'Discovery date'], answerIndex: 1, subject: 'Science' },
    { question: 'What is mitosis used for in the body?', options: ['Sexual reproduction', 'Growth and repair', 'Producing gametes', 'Digestion'], answerIndex: 1, subject: 'Science' },
    // History, Civics & English
    { question: 'What was apartheid?', options: ['A South African policy of racial segregation', 'A form of government in China', 'A war in the Middle East', 'An economic policy in the USA'], answerIndex: 0, subject: 'History' },
    { question: 'What was the Cold War?', options: ['A war fought in Antarctica', 'A period of geopolitical tension between the USA and USSR', 'A war fought in Siberia', 'A conflict over oil'], answerIndex: 1, subject: 'History' },
    { question: 'When was the Universal Declaration of Human Rights adopted?', options: ['1945', '1948', '1950', '1955'], answerIndex: 1, subject: 'History' },
    { question: 'What is the role of the Australian Senate?', options: ['To make laws alone', 'To review legislation and represent state interests', 'To appoint the Prime Minister', 'To lead the military'], answerIndex: 1, subject: 'Civics' },
    { question: 'What is the Australian Constitution?', options: ['A list of Australia\'s laws', 'The supreme law that establishes Australia\'s government', 'A treaty with Indigenous Australians', 'A list of citizens\' rights'], answerIndex: 1, subject: 'Civics' },
    { question: 'What literary term describes a story within a story?', options: ['Foreshadowing', 'Flashback', 'Frame narrative', 'Epilogue'], answerIndex: 2, subject: 'English' },
    { question: 'What is the difference between denotation and connotation?', options: ['They are the same', 'Denotation is literal meaning; connotation is implied meaning', 'Connotation is literal meaning; denotation is implied meaning', 'Denotation only applies to poetry'], answerIndex: 1, subject: 'English' },
  ],
  11: [
    // Maths
    { question: 'What is the derivative of x³?', options: ['x²', '2x²', '3x²', '3x³'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the integral of 2x?', options: ['2', 'x²', 'x² + C', '2x² + C'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is log₁₀(1000)?', options: ['2', '3', '4', '10'], answerIndex: 1, subject: 'Maths' },
    { question: 'Simplify: x² × x³', options: ['x⁵', 'x⁶', 'x', '2x⁵'], answerIndex: 0, subject: 'Maths' },
    { question: 'What is the product rule for derivatives?', options: ["f'g + fg'", "f'g - fg'", "f'g × fg'", "f/g'"], answerIndex: 0, subject: 'Maths' },
    { question: 'What is lim(x→∞) of 1/x?', options: ['1', '0', '∞', 'undefined'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the domain of f(x) = √x?', options: ['All real numbers', 'x > 0', 'x ≥ 0', 'x < 0'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the binomial theorem used for?', options: ['Expanding powers of binomial expressions', 'Solving quadratic equations', 'Finding derivatives', 'Calculating permutations'], answerIndex: 0, subject: 'Maths' },
    // Physics, Chemistry, Biology
    { question: 'What is the kinetic energy formula?', options: ['KE = mv', 'KE = ½mv²', 'KE = mgh', 'KE = ma'], answerIndex: 1, subject: 'Physics' },
    { question: 'In physics, what is an elastic collision?', options: ['Objects stick together', 'Kinetic energy is conserved', 'Momentum is not conserved', 'Objects deform permanently'], answerIndex: 1, subject: 'Physics' },
    { question: 'What is enthalpy change?', options: ['Change in temperature only', 'Heat energy exchanged at constant pressure', 'Change in volume', 'Work done by a system'], answerIndex: 1, subject: 'Chemistry' },
    { question: 'What is Avogadro\'s number?', options: ['6.02 × 10²³', '3.14 × 10²³', '1.60 × 10⁻¹⁹', '9.8 m/s²'], answerIndex: 0, subject: 'Chemistry' },
    { question: 'What is the Hardy-Weinberg principle used for?', options: ['Predicting weather patterns', 'Modelling population genetics in equilibrium', 'Measuring biodiversity', 'Classifying organisms'], answerIndex: 1, subject: 'Biology' },
    { question: 'How do dominant and recessive alleles differ?', options: ['Dominant alleles are always expressed; recessive only when homozygous', 'Recessive alleles are always expressed', 'They mean the same thing', 'Dominant alleles are rarer'], answerIndex: 0, subject: 'Biology' },
    // Economics & English
    { question: 'What economic system is characterised by private ownership and free markets?', options: ['Communism', 'Socialism', 'Capitalism', 'Feudalism'], answerIndex: 2, subject: 'Economics' },
    { question: 'What is opportunity cost?', options: ['The price of a product', 'The value of the next best alternative given up', 'The cost of production', 'Government taxes'], answerIndex: 1, subject: 'Economics' },
    { question: 'What is the narrative perspective of a story told by "I"?', options: ['Third person omniscient', 'Third person limited', 'First person', 'Second person'], answerIndex: 2, subject: 'English' },
    { question: 'What is a protagonist?', options: ['The main villain', 'The main character of a story', 'A side character', 'The narrator'], answerIndex: 1, subject: 'English' },
    { question: 'What is dramatic irony?', options: ['When a character is being funny', 'When the audience knows something a character does not', 'When two characters argue', 'When a story ends unexpectedly'], answerIndex: 1, subject: 'English' },
    { question: 'What is a hypothesis?', options: ['A proven theory', 'A testable prediction or explanation', 'A conclusion', 'An observation'], answerIndex: 1, subject: 'Science' },
    { question: 'What is the difference between accuracy and precision?', options: ['They are the same', 'Accuracy is closeness to the true value; precision is repeatability', 'Precision is closeness to the true value; accuracy is repeatability', 'Accuracy only applies to measurements'], answerIndex: 1, subject: 'Science' },
  ],
  12: [
    // Maths
    { question: 'What is the derivative of sin(x)?', options: ['-cos(x)', 'cos(x)', '-sin(x)', 'tan(x)'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is ∫cos(x)dx?', options: ['-sin(x) + C', 'sin(x) + C', '-cos(x) + C', 'cos(x) + C'], answerIndex: 1, subject: 'Maths' },
    { question: 'If P(A) = 0.4 and P(B) = 0.5 and they are independent, what is P(A and B)?', options: ['0.1', '0.2', '0.45', '0.9'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the limit of (sin x / x) as x → 0?', options: ['0', '1', '∞', 'undefined'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the chain rule in calculus?', options: ["d/dx[f(g(x))] = f'(g(x)) · g'(x)", "d/dx[f(g(x))] = f'(x) · g'(x)", "d/dx[f(g(x))] = f'(g(x))", "d/dx[f(g(x))] = f(g'(x))"], answerIndex: 0, subject: 'Maths' },
    { question: 'What is ∫eˣ dx?', options: ['eˣ + C', 'xeˣ + C', 'e^(x+1) + C', '1/eˣ + C'], answerIndex: 0, subject: 'Maths' },
    { question: 'What does the fundamental theorem of calculus state?', options: ['Integration and differentiation are inverse operations', 'Every continuous function is differentiable', 'The integral of a constant is zero', 'Derivatives are always positive'], answerIndex: 0, subject: 'Maths' },
    { question: 'What does a p-value measure in statistics?', options: ['The probability a result is due to chance', 'The standard deviation', 'The effect size', 'The sample size needed'], answerIndex: 0, subject: 'Maths' },
    // Physics & Chemistry
    { question: 'What does E = mc² represent?', options: ['Kinetic energy', 'Mass-energy equivalence', 'Gravitational potential energy', 'Electric field energy'], answerIndex: 1, subject: 'Physics' },
    { question: 'What is the photoelectric effect?', options: ['Light bending around objects', 'Emission of electrons when light hits a metal surface', 'Light being absorbed by glass', 'Reflection of light'], answerIndex: 1, subject: 'Physics' },
    { question: 'What does the first law of thermodynamics state?', options: ['Entropy always increases', 'Energy cannot be created or destroyed', 'Heat flows from cold to hot', 'Objects resist changes in motion'], answerIndex: 1, subject: 'Physics' },
    { question: 'What is a buffer solution?', options: ['A solution that resists changes in pH', 'A solution with pH of exactly 7', 'A highly acidic solution', 'A solution that changes colour'], answerIndex: 0, subject: 'Chemistry' },
    { question: 'What is an exothermic reaction?', options: ['A reaction that absorbs heat', 'A reaction that releases heat', 'A reaction that produces light only', 'A reaction involving only gases'], answerIndex: 1, subject: 'Chemistry' },
    // Biology & Economics
    { question: 'What is the central dogma of molecular biology?', options: ['DNA → RNA → Protein', 'Protein → RNA → DNA', 'RNA → DNA → Protein', 'DNA → Protein → RNA'], answerIndex: 0, subject: 'Biology' },
    { question: 'What is gene expression?', options: ['The physical appearance of an organism', 'The process by which DNA is used to produce proteins', 'The mutation of genes', 'The inheritance of traits'], answerIndex: 1, subject: 'Biology' },
    { question: 'What is GDP a measure of?', options: ['Government debt', 'Total economic output of a country', 'Population growth', 'Inflation rate'], answerIndex: 1, subject: 'Economics' },
    { question: 'What is comparative advantage in economics?', options: ['Producing more than competitors', 'The ability to produce a good at a lower opportunity cost', 'Having the cheapest labour', 'Owning more resources than others'], answerIndex: 1, subject: 'Economics' },
    { question: 'What is inflation?', options: ['A decrease in prices over time', 'An increase in the general price level over time', 'A measure of economic output', 'Government spending'], answerIndex: 1, subject: 'Economics' },
    // Philosophy & English
    { question: 'What philosophical theory states that morality is based on outcomes?', options: ['Deontology', 'Virtue ethics', 'Consequentialism', 'Nihilism'], answerIndex: 2, subject: 'Philosophy' },
    { question: 'What is Plato\'s Allegory of the Cave about?', options: ['The nature of shadows', 'The difference between perceived reality and true knowledge', 'How to escape from prison', 'The importance of fire'], answerIndex: 1, subject: 'Philosophy' },
    { question: 'What is postmodernism in literature?', options: ['A style following traditional narrative structures', 'A style that questions absolute truths and uses self-referential techniques', 'A style focused on nature and romanticism', 'A style about modern technology'], answerIndex: 1, subject: 'English' },
    { question: 'What distinguishes tragedy from comedy in drama?', options: ['Comedies are funny, tragedies are not', 'Tragedies end in suffering or death; comedies end happily', 'They are the same genre', 'Tragedies are always longer'], answerIndex: 1, subject: 'English' },
  ],
};

// Group year levels into bands for variety
function getYearBandQuestions(year: number): Question[] {
  const questions: Question[] = [];
  // Include questions from the current year and adjacent years
  const minYear = Math.max(1, year - 1);
  const maxYear = Math.min(12, year + 1);
  for (let y = minYear; y <= maxYear; y++) {
    if (questionsByYear[y]) {
      questions.push(...questionsByYear[y]);
    }
  }
  return questions;
}

export function getRandomQuestion(year: number): Question {
  const questions = getYearBandQuestions(year);
  return questions[Math.floor(Math.random() * questions.length)];
}

export function getQuestionsForYear(year: number): Question[] {
  return getYearBandQuestions(year);
}
