// Guarda para evitar redeclaração
if (typeof AISelectorFinder === 'undefined') {
  // Módulo de Inteligência Artificial para Seletores
  class AISelectorFinder {
    constructor() {
      this.model = null;
      this.featureLength = 10;
      this.selectorStrategies = [
        'id', 'data-cy', 'name', 'class', 'tag_and_text', 'full_path'
      ];
      this.createModel();
    }

    createModel() {
      this.model = tf.sequential();
      this.model.add(tf.layers.dense({ inputShape: [this.featureLength], units: 32, activation: 'relu' }));
      this.model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
      this.model.add(tf.layers.dense({ units: this.selectorStrategies.length, activation: 'softmax' }));
      console.log('🤖 Modelo de IA (placeholder) criado com sucesso.');
    }

    /**
     * Converte o objeto de características em um vetor numérico para o modelo.
     * @param {object} elementFeatures - O objeto de características extraído do elemento.
     * @returns {tf.Tensor}
     */
    featuresToVector(elementFeatures) {
      const features = [];
      features.push(elementFeatures.id ? 1 : 0);
      features.push(elementFeatures.dataCy ? 1 : 0);
      features.push(elementFeatures.name ? 1 : 0);
      features.push((elementFeatures.className.split(' ').filter(c => c).length) / 5);
      features.push(elementFeatures.text.length / 50);
      features.push(elementFeatures.tagName === 'input' ? 1 : 0);
      features.push(elementFeatures.tagName === 'button' ? 1 : 0);
      features.push(elementFeatures.depth / 20);
      features.push(elementFeatures.childrenCount / 10);
      features.push(elementFeatures.hasParentId ? 1 : 0);
      return tf.tensor2d([features.slice(0, this.featureLength)]);
    }

    /**
     * Usa o modelo para prever a melhor estratégia de seletor.
     * @param {object} elementFeatures - As características do elemento.
     * @returns {Promise<string>} O nome da melhor estratégia (ex: 'id').
     */
    async predictBestStrategy(elementFeatures) {
      if (!this.model) {
        console.error('O modelo de IA não foi inicializado.');
        return 'full_path'; // Fallback
      }

      const featuresTensor = this.featuresToVector(elementFeatures);
      const prediction = await this.model.predict(featuresTensor).data();
      featuresTensor.dispose();
      
      const bestStrategyIndex = prediction.indexOf(Math.max(...prediction));
      return this.selectorStrategies[bestStrategyIndex];
    }
  }

  window.AISelectorFinder = AISelectorFinder;
} 