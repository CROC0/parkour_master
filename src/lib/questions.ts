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
    // English
    { question: 'Which letter makes the "ssss" sound?', options: ['b', 's', 't', 'p'], answerIndex: 1, subject: 'English' },
    { question: 'What comes at the end of a sentence?', options: ['comma', 'question mark or full stop', 'apostrophe', 'dash'], answerIndex: 1, subject: 'English' },
    { question: 'Which word rhymes with "cat"?', options: ['dog', 'bat', 'cup', 'hen'], answerIndex: 1, subject: 'English' },
    { question: 'How many vowels are in the alphabet?', options: ['4', '5', '6', '7'], answerIndex: 1, subject: 'English' },
    // Science
    { question: 'What do plants need to grow?', options: ['Only water', 'Only sun', 'Sun, water and soil', 'Just soil'], answerIndex: 2, subject: 'Science' },
    { question: 'Which animal lays eggs?', options: ['Cat', 'Dog', 'Chicken', 'Cow'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the sun?', options: ['A planet', 'A star', 'A moon', 'A cloud'], answerIndex: 1, subject: 'Science' },
  ],
  2: [
    // Maths
    { question: 'What is 7 + 8?', options: ['13', '14', '15', '16'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 12 - 5?', options: ['5', '6', '7', '8'], answerIndex: 2, subject: 'Maths' },
    { question: 'How many centimetres are in a metre?', options: ['10', '50', '100', '1000'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is double 6?', options: ['10', '11', '12', '13'], answerIndex: 2, subject: 'Maths' },
    { question: 'Which shape has 4 equal sides?', options: ['Rectangle', 'Triangle', 'Square', 'Circle'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 5 + 9?', options: ['12', '13', '14', '15'], answerIndex: 2, subject: 'Maths' },
    // English
    { question: 'What is a noun?', options: ['An action word', 'A describing word', 'A naming word', 'A joining word'], answerIndex: 2, subject: 'English' },
    { question: 'Which word is spelled correctly?', options: ['becaus', 'because', 'becauze', 'becawse'], answerIndex: 1, subject: 'English' },
    { question: 'How many syllables are in "elephant"?', options: ['2', '3', '4', '5'], answerIndex: 1, subject: 'English' },
    // Science
    { question: 'What state of matter is ice?', options: ['Gas', 'Liquid', 'Solid', 'Plasma'], answerIndex: 2, subject: 'Science' },
    { question: 'What do we call baby frogs?', options: ['Tadpoles', 'Calves', 'Kittens', 'Piglets'], answerIndex: 0, subject: 'Science' },
    { question: 'Which season comes after summer in Australia?', options: ['Spring', 'Winter', 'Autumn', 'Summer'], answerIndex: 2, subject: 'Science' },
  ],
  3: [
    { question: 'What is 6 × 7?', options: ['36', '40', '42', '48'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 48 ÷ 6?', options: ['6', '7', '8', '9'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is half of 50?', options: ['20', '25', '30', '35'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is ¼ of 20?', options: ['4', '5', '8', '10'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is 3 × 8?', options: ['21', '22', '23', '24'], answerIndex: 3, subject: 'Maths' },
    { question: 'How many minutes in an hour?', options: ['30', '45', '60', '100'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is a verb?', options: ['A naming word', 'An action word', 'A describing word', 'A joining word'], answerIndex: 1, subject: 'English' },
    { question: 'What is the plural of "child"?', options: ['childs', 'childes', 'children', 'childrens'], answerIndex: 2, subject: 'English' },
    { question: 'What does a plant use to make food from sunlight?', options: ['Roots', 'Flowers', 'Leaves', 'Seeds'], answerIndex: 2, subject: 'Science' },
    { question: 'Which planet is closest to the Sun?', options: ['Earth', 'Venus', 'Mars', 'Mercury'], answerIndex: 3, subject: 'Science' },
    { question: 'What is the capital city of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], answerIndex: 2, subject: 'HASS' },
    { question: 'Which ocean is on the east coast of Australia?', options: ['Indian Ocean', 'Pacific Ocean', 'Southern Ocean', 'Arctic Ocean'], answerIndex: 1, subject: 'HASS' },
  ],
  4: [
    { question: 'What is 9 × 9?', options: ['72', '79', '81', '84'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 72 ÷ 8?', options: ['7', '8', '9', '10'], answerIndex: 2, subject: 'Maths' },
    { question: 'What fraction is the same as 0.5?', options: ['¼', '⅓', '½', '¾'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the perimeter of a square with sides of 5cm?', options: ['10 cm', '15 cm', '20 cm', '25 cm'], answerIndex: 2, subject: 'Maths' },
    { question: 'Round 347 to the nearest hundred.', options: ['300', '340', '350', '400'], answerIndex: 0, subject: 'Maths' },
    { question: 'What is an adjective?', options: ['An action word', 'A naming word', 'A describing word', 'A joining word'], answerIndex: 2, subject: 'English' },
    { question: 'What is a synonym for "happy"?', options: ['Sad', 'Angry', 'Joyful', 'Tired'], answerIndex: 2, subject: 'English' },
    { question: 'How does sound travel?', options: ['Through light waves', 'Through vibrations', 'Through magnets', 'Through heat'], answerIndex: 1, subject: 'Science' },
    { question: 'What is the largest state in Australia?', options: ['NSW', 'Victoria', 'Queensland', 'Western Australia'], answerIndex: 3, subject: 'HASS' },
    { question: 'How many states are in Australia?', options: ['5', '6', '7', '8'], answerIndex: 1, subject: 'HASS' },
    { question: 'Who were the first people to live in Australia?', options: ['British settlers', 'Aboriginal and Torres Strait Islander peoples', 'Dutch explorers', 'Chinese settlers'], answerIndex: 1, subject: 'HASS' },
  ],
  5: [
    { question: 'What is 25% of 200?', options: ['25', '40', '50', '75'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 3.5 × 4?', options: ['12', '13', '14', '15'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the area of a rectangle 6m × 4m?', options: ['10 m²', '20 m²', '24 m²', '28 m²'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the lowest common multiple of 4 and 6?', options: ['8', '10', '12', '24'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 15% of 60?', options: ['6', '7', '9', '10'], answerIndex: 2, subject: 'Maths' },
    { question: '0.75 as a fraction is:', options: ['¼', '½', '⅔', '¾'], answerIndex: 3, subject: 'Maths' },
    { question: 'What is a metaphor?', options: ['A direct comparison using "like" or "as"', 'A comparison saying something IS something else', 'A repeated sound at the start of words', 'An exaggeration'], answerIndex: 1, subject: 'English' },
    { question: 'What gas do plants absorb to make food?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the Earth\'s largest layer?', options: ['Crust', 'Mantle', 'Outer core', 'Inner core'], answerIndex: 1, subject: 'Science' },
    { question: 'Which explorer first circumnavigated Australia by sea?', options: ['James Cook', 'Matthew Flinders', 'Arthur Phillip', 'Abel Tasman'], answerIndex: 1, subject: 'HASS' },
    { question: 'What year did Australia become a federation?', options: ['1788', '1851', '1901', '1942'], answerIndex: 2, subject: 'HASS' },
  ],
  6: [
    { question: 'What is 12²?', options: ['122', '132', '144', '156'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the volume of a cube with sides of 3cm?', options: ['9 cm³', '18 cm³', '27 cm³', '36 cm³'], answerIndex: 2, subject: 'Maths' },
    { question: 'Convert 3/4 to a percentage.', options: ['50%', '65%', '75%', '80%'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the mean of 4, 8, 6, 10, 2?', options: ['5', '6', '7', '8'], answerIndex: 1, subject: 'Maths' },
    { question: 'If a ratio is 2:3 and the first part is 10, what is the second part?', options: ['12', '13', '14', '15'], answerIndex: 3, subject: 'Maths' },
    { question: 'What is alliteration?', options: ['Repetition of vowel sounds', 'Repetition of consonant sounds at the start of words', 'Comparing two unlike things', 'A word that sounds like its meaning'], answerIndex: 1, subject: 'English' },
    { question: 'What is the smallest planet in our solar system?', options: ['Mars', 'Venus', 'Mercury', 'Pluto'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the process where water vapour cools and becomes liquid?', options: ['Evaporation', 'Condensation', 'Precipitation', 'Transpiration'], answerIndex: 1, subject: 'Science' },
    { question: 'What is the term for plants that make their own food using sunlight?', options: ['Consumers', 'Decomposers', 'Producers', 'Omnivores'], answerIndex: 2, subject: 'Science' },
    { question: 'Which Australian state has the most people?', options: ['Victoria', 'New South Wales', 'Queensland', 'Western Australia'], answerIndex: 1, subject: 'HASS' },
  ],
  7: [
    { question: 'Solve for x: 3x + 5 = 20', options: ['4', '5', '6', '7'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the probability of rolling a 6 on a standard die?', options: ['1/4', '1/5', '1/6', '1/8'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the value of π to 2 decimal places?', options: ['3.12', '3.14', '3.16', '3.18'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is -5 + 8?', options: ['-3', '2', '3', '13'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the HCF of 12 and 18?', options: ['3', '4', '6', '9'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Cell membrane', 'Mitochondria', 'Ribosome'], answerIndex: 2, subject: 'Science' },
    { question: 'What type of rock is formed from cooled magma?', options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Composite'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the chemical symbol for water?', options: ['HO', 'H₂O', 'H₂O₂', 'HO₂'], answerIndex: 1, subject: 'Science' },
    { question: 'Which ancient civilisation built the pyramids?', options: ['Greeks', 'Romans', 'Egyptians', 'Mesopotamians'], answerIndex: 2, subject: 'History' },
    { question: 'In what year did Captain Cook arrive in Australia?', options: ['1750', '1770', '1788', '1800'], answerIndex: 1, subject: 'History' },
    { question: 'What is a simile?', options: ['A comparison using "is"', 'A comparison using "like" or "as"', 'An exaggeration', 'A word that imitates a sound'], answerIndex: 1, subject: 'English' },
  ],
  8: [
    { question: 'Solve: 2x - 3 = 11', options: ['5', '6', '7', '8'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is 4³?', options: ['12', '24', '48', '64'], answerIndex: 3, subject: 'Maths' },
    { question: 'What is the area of a triangle with base 10cm and height 6cm?', options: ['16 cm²', '25 cm²', '30 cm²', '60 cm²'], answerIndex: 2, subject: 'Maths' },
    { question: 'Expand: 3(x + 4)', options: ['3x + 4', '3x + 7', '3x + 12', 'x + 12'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the formula for speed?', options: ['distance × time', 'distance + time', 'distance ÷ time', 'time ÷ distance'], answerIndex: 2, subject: 'Science' },
    { question: 'What is the atomic number of oxygen?', options: ['6', '7', '8', '9'], answerIndex: 2, subject: 'Science' },
    { question: 'What type of bond holds atoms together by sharing electrons?', options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'], answerIndex: 1, subject: 'Science' },
    { question: 'What was the Industrial Revolution primarily associated with?', options: ['Agriculture', 'Steam power and factories', 'Art and culture', 'Exploration at sea'], answerIndex: 1, subject: 'History' },
    { question: 'What is the theme of a text?', options: ['The main character', 'The plot summary', 'The central message or idea', 'The setting'], answerIndex: 2, subject: 'English' },
    { question: 'What type of government does Australia have?', options: ['Monarchy', 'Republic', 'Constitutional monarchy and parliamentary democracy', 'Dictatorship'], answerIndex: 2, subject: 'Civics' },
  ],
  9: [
    { question: 'What is the gradient of a line through (0,3) and (2,7)?', options: ['1', '2', '3', '4'], answerIndex: 1, subject: 'Maths' },
    { question: 'Solve: x² = 49', options: ['x = 7', 'x = ±7', 'x = -7', 'x = 14'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is sin(30°)?', options: ['0.25', '0.5', '0.75', '1'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the Pythagorean theorem?', options: ['a + b = c', 'a² + b² = c²', 'a × b = c²', 'a² × b² = c'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is Newton\'s First Law of Motion?', options: ['F = ma', 'An object in motion stays in motion unless acted on by a force', 'Every action has an equal and opposite reaction', 'Energy cannot be created or destroyed'], answerIndex: 1, subject: 'Science' },
    { question: 'What is the chemical formula for carbon dioxide?', options: ['CO', 'CO₂', 'C₂O', 'C₂O₂'], answerIndex: 1, subject: 'Science' },
    { question: 'What carries genetic information in a cell?', options: ['RNA', 'ATP', 'DNA', 'Protein'], answerIndex: 2, subject: 'Science' },
    { question: 'What was the cause of World War I?', options: ['Assassination of Archduke Franz Ferdinand and rising tensions', 'The bombing of Pearl Harbour', 'The rise of Hitler', 'The Russian Revolution'], answerIndex: 0, subject: 'History' },
    { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], answerIndex: 2, subject: 'History' },
    { question: 'What literary device involves giving human qualities to non-human things?', options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], answerIndex: 2, subject: 'English' },
  ],
  10: [
    { question: 'Factorise: x² + 5x + 6', options: ['(x+1)(x+6)', '(x+2)(x+3)', '(x-2)(x-3)', '(x+2)(x-3)'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is cos(60°)?', options: ['0.25', '0.5', '√2/2', '1'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the standard deviation a measure of?', options: ['The average value', 'The spread of data', 'The median', 'The mode'], answerIndex: 1, subject: 'Maths' },
    { question: 'Solve: 2x² - 8 = 0', options: ['x = ±2', 'x = 2', 'x = 4', 'x = ±4'], answerIndex: 0, subject: 'Maths' },
    { question: 'What is Ohm\'s Law?', options: ['V = P/I', 'V = IR', 'V = I/R', 'V = I²R'], answerIndex: 1, subject: 'Science' },
    { question: 'What is pH 7?', options: ['Acidic', 'Neutral', 'Alkaline', 'Highly acidic'], answerIndex: 1, subject: 'Science' },
    { question: 'What is natural selection?', options: ['Humans selecting which animals to breed', 'Organisms with favourable traits surviving and reproducing more', 'Random genetic mutations only', 'The extinction of species'], answerIndex: 1, subject: 'Science' },
    { question: 'What was apartheid?', options: ['A South African policy of racial segregation', 'A form of government in China', 'A war in the Middle East', 'An economic policy in the USA'], answerIndex: 0, subject: 'History' },
    { question: 'What is the role of the Australian Senate?', options: ['To make laws alone', 'To review legislation and represent state interests', 'To appoint the Prime Minister', 'To lead the military'], answerIndex: 1, subject: 'Civics' },
  ],
  11: [
    { question: 'What is the derivative of x³?', options: ['x²', '2x²', '3x²', '3x³'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is the integral of 2x?', options: ['2', 'x²', 'x² + C', '2x² + C'], answerIndex: 2, subject: 'Maths' },
    { question: 'What is log₁₀(1000)?', options: ['2', '3', '4', '10'], answerIndex: 1, subject: 'Maths' },
    { question: 'Simplify: (x² × x³)', options: ['x⁵', 'x⁶', 'x', '2x⁵'], answerIndex: 0, subject: 'Maths' },
    { question: 'What is the kinetic energy formula?', options: ['KE = mv', 'KE = ½mv²', 'KE = mgh', 'KE = ma'], answerIndex: 1, subject: 'Physics' },
    { question: 'What is enthalpy change?', options: ['Change in temperature only', 'Heat energy exchanged at constant pressure', 'Change in volume', 'Work done by a system'], answerIndex: 1, subject: 'Chemistry' },
    { question: 'What is the Hardy-Weinberg principle used for?', options: ['Predicting weather patterns', 'Modelling population genetics in equilibrium', 'Measuring biodiversity', 'Classifying organisms'], answerIndex: 1, subject: 'Biology' },
    { question: 'What economic system is characterised by private ownership and free markets?', options: ['Communism', 'Socialism', 'Capitalism', 'Feudalism'], answerIndex: 2, subject: 'Economics' },
    { question: 'What is the narrative perspective of a story told by "I"?', options: ['Third person omniscient', 'Third person limited', 'First person', 'Second person'], answerIndex: 2, subject: 'English' },
  ],
  12: [
    { question: 'What is the derivative of sin(x)?', options: ['-cos(x)', 'cos(x)', '-sin(x)', 'tan(x)'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is ∫cos(x)dx?', options: ['-sin(x) + C', 'sin(x) + C', '-cos(x) + C', 'cos(x) + C'], answerIndex: 1, subject: 'Maths' },
    { question: 'If P(A) = 0.4 and P(B) = 0.5 and they are independent, what is P(A and B)?', options: ['0.1', '0.2', '0.45', '0.9'], answerIndex: 1, subject: 'Maths' },
    { question: 'What is the limit of (sin x / x) as x → 0?', options: ['0', '1', '∞', 'undefined'], answerIndex: 1, subject: 'Maths' },
    { question: 'What does E = mc² represent?', options: ['Kinetic energy', 'Mass-energy equivalence', 'Gravitational potential energy', 'Electric field energy'], answerIndex: 1, subject: 'Physics' },
    { question: 'What is a buffer solution?', options: ['A solution that resists changes in pH', 'A solution with pH of exactly 7', 'A highly acidic solution', 'A solution that changes colour'], answerIndex: 0, subject: 'Chemistry' },
    { question: 'What is the central dogma of molecular biology?', options: ['DNA → RNA → Protein', 'Protein → RNA → DNA', 'RNA → DNA → Protein', 'DNA → Protein → RNA'], answerIndex: 0, subject: 'Biology' },
    { question: 'What is GDP a measure of?', options: ['Government debt', 'Total economic output of a country', 'Population growth', 'Inflation rate'], answerIndex: 1, subject: 'Economics' },
    { question: 'What philosophical theory states that morality is based on outcomes?', options: ['Deontology', 'Virtue ethics', 'Consequentialism', 'Nihilism'], answerIndex: 2, subject: 'Philosophy' },
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
