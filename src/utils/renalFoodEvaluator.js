// Renal Nutrition Evaluator for Kidney Stone (Lithiasis) Recovery
// Analyzes food ingredients and meal descriptions to provide clinical feedback

/**
 * Type FoodEvaluation: {
 *   status: 'safe' | 'moderate' | 'avoid',
 *   headline: string,
 *   analysis: string[],
 *   recommendation: string,
 *   hydrationAdvice: string
 * }
 */

const DANGEROUS_KEYWORDS = [
  { words: ['gaseosa', 'coca cola', 'pepsi', 'refresco oscuro', 'cola', 'soda negra'], reason: 'Contiene ácido fosfórico y azúcares simples que acidifican la orina y aceleran la formación de cálculos de oxalato y fosfato.' },
  { words: ['salchicha', 'jamon', 'embutido', 'chorizo', 'tocino', 'tocineta', 'mortadela', 'salami'], reason: 'Carga masiva de sodio/sal que induce hipercalciuria (hace que los riñones eliminen calcio en la orina, formando piedras).' },
  { words: ['sopa instantanea', 'caldo maggi', 'cubito', 'ramen instantaneo', 'maruchan'], reason: 'Exceso extremo de sodio y glutamato que produce deshidratación celular inmediata.' },
  { words: ['espinaca cruda', 'espinacas', 'acelga', 'remolacha cruda'], reason: 'Altísimo contenido de oxalato puro; se une al calcio en la orina formando los cálculos más comunes.' },
  { words: ['te negro concentrado', 'te negro'], reason: 'Muy rico en oxalatos solubles que pasan rápidamente al tracto urinario.' },
  { words: ['fritura', 'frito', 'papas fritas de paquete', 'chitos', 'doritos'], reason: 'Sodio y grasas saturadas inflamatorias para el endotelio vascular y renal.' }
];

const MODERATE_KEYWORDS = [
  { words: ['cafe', 'tinto'], reason: 'Tiene un efecto diurético que puede deshidratar si no se compensa. Máximo 1 taza al día acompañada de 1 vaso de agua.' },
  { words: ['carne roja', 'res', 'cerdo', 'higado'], reason: 'Las purinas aumentan el ácido úrico y reducen el pH urinario. Consumir porciones moderadas (máximo 120-150g) y preferir carnes magras o pescado.' },
  { words: ['chocolate', 'cacao'], reason: 'Contiene oxalato moderado. Consumir porciones pequeñas y tomar agua después.' },
  { words: ['mani', 'almendras', 'nueces', 'frutos secos'], reason: 'Son saludables pero contienen oxalatos. Limitar a un puñadito pequeño y nunca con sal.' },
  { words: ['queso salado', 'queso madurado', 'parmesano'], reason: 'Tienen sodio concentrado. Preferir quesos frescos bajos en sal (ej. queso campesino bajo en sal o ricota).' },
  { words: ['te verde'], reason: 'Aceptable si es suave y no concentrado. Contiene antioxidantes.' }
];

const BENEFICIAL_KEYWORDS = [
  { words: ['limon', 'limonada', 'lima'], reason: 'Excelente: rico en citrato natural, el inhibidor biológico más potente contra la formación de nuevos cálculos.' },
  { words: ['agua', 'agua con limon', 'agua de coco natural'], reason: 'El elemento más protector: diluye los cristales e incrementa el volumen de diuresis.' },
  { words: ['sandia', 'melon', 'pepino'], reason: 'Rico en agua (más del 90%), bajo en sodio y con acción diurética natural y suave.' },
  { words: ['manzana', 'pera', 'pina', 'piña'], reason: 'Frutas hidratantes, alcalinizantes suaves y seguras para los riñones.' },
  { words: ['pollo a la plancha', 'pescado', 'pavo'], reason: 'Proteínas magras de fácil digestión que generan menor carga de ácido úrico que las carnes rojas.' },
  { words: ['huevo', 'huevos'], reason: 'Excelente fuente de proteína sin oxalato ni purinas excesivas si se prepara sin sal añadida.' },
  { words: ['arroz', 'arepa sin sal', 'avena', 'quinua'], reason: 'Carbohidratos limpios, bajos en sodio y sin oxalato dañino.' }
];

export const evaluateMeal = (mealText = '') => {
  const text = mealText.toLowerCase().trim();
  if (!text) {
    return {
      status: 'safe',
      score: 100,
      scoreColor: 'text-emerald-600',
      badge: 'Listo para evaluar',
      headline: 'Escribe lo que vas a comer',
      analysis: ['Ingresa tu plato o ingredientes para analizar su impacto en tu salud renal.'],
      recommendation: 'Te diremos si contiene exceso de sodio, oxalatos o si es un alimento protector.',
      hydrationAdvice: 'Acompaña siempre tus comidas con un vaso de agua fresca.'
    };
  }

  const detectedAvoids = [];
  const detectedModerates = [];
  const detectedBeneficials = [];

  // Check dangerous
  DANGEROUS_KEYWORDS.forEach(item => {
    if (item.words.some(w => text.includes(w))) {
      detectedAvoids.push(item.reason);
    }
  });

  // Check moderate
  MODERATE_KEYWORDS.forEach(item => {
    if (item.words.some(w => text.includes(w))) {
      detectedModerates.push(item.reason);
    }
  });

  // Check beneficial
  BENEFICIAL_KEYWORDS.forEach(item => {
    if (item.words.some(w => text.includes(w))) {
      detectedBeneficials.push(item.reason);
    }
  });

  // Determine overall status and score
  if (detectedAvoids.length > 0) {
    const calculatedScore = Math.max(15, 45 - (detectedAvoids.length - 1) * 10);
    return {
      status: 'avoid',
      score: calculatedScore,
      scoreColor: 'text-rose-600 dark:text-rose-400',
      badge: 'Riesgo para Cálculos',
      headline: 'Cuidado: Alimento no aconsejado tras cálculo renal',
      analysis: detectedAvoids,
      recommendation: 'Este plato tiene componentes con alto riesgo de formar nuevos cristales de calcio o sodio. Te recomendamos evitarlo o sustituir los ingredientes perjudiciales.',
      hydrationAdvice: 'Si ya lo consumiste, bebe urgentemente de 2 a 3 vasos de agua (500-750 ml) con limón para acelerar su dilución renal.'
    };
  }

  if (detectedModerates.length > 0) {
    const calculatedScore = Math.max(55, 75 - (detectedModerates.length - 1) * 8);
    return {
      status: 'moderate',
      score: calculatedScore,
      scoreColor: 'text-amber-600 dark:text-amber-400',
      badge: 'Consumo con Moderación',
      headline: 'Consumo con moderación y cuidado',
      analysis: detectedModerates,
      recommendation: 'Puedes consumirlo en porciones controladas y sin añadir sal extra de mesa.',
      hydrationAdvice: 'Acompaña este plato con 1 vaso completo de agua (250 ml) para mantener la orina clara.'
    };
  }

  if (detectedBeneficials.length > 0) {
    const calculatedScore = Math.min(100, 90 + detectedBeneficials.length * 3);
    return {
      status: 'safe',
      score: calculatedScore,
      scoreColor: 'text-emerald-600 dark:text-emerald-400',
      badge: 'Excelente y Protector Renal',
      headline: '¡Excelente opción para tus riñones!',
      analysis: detectedBeneficials,
      recommendation: 'Es un plato seguro, hidratante y digestivo que cuida tu aparato urinario.',
      hydrationAdvice: 'Continúa con tu meta de agua del día para mantener tus riñones al 100%.'
    };
  }

  // Neutral / General healthy guidance
  return {
    status: 'safe',
    score: 85,
    scoreColor: 'text-emerald-600 dark:text-emerald-400',
    badge: 'Aceptable y Seguro',
    headline: 'Plato Aceptable (Controla la Sal)',
    analysis: ['No detectamos ingredientes de alto riesgo de litiasis (como refrescos oscuros o embutidos).'],
    recommendation: 'Asegúrate de prepararlo con hierbas aromáticas naturales (orégano, ajo, laurel) en lugar de sal de mesa o caldos artificiales.',
    hydrationAdvice: 'No olvides tomar un vaso de agua 15-20 minutos después de comer.'
  };
};
