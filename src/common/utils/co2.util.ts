export interface CO2Factors {
  [key: string]: {
    kgCO2PerKg: number;
    averageWeight: number; // in kg
  };
}

export class CO2Calculator {
  // CO2 emission factors for different food categories
  private static readonly CO2_FACTORS: CO2Factors = {
    meat: { kgCO2PerKg: 27, averageWeight: 0.3 },
    dairy: { kgCO2PerKg: 13.5, averageWeight: 0.5 },
    vegetables: { kgCO2PerKg: 2.0, averageWeight: 0.4 },
    fruits: { kgCO2PerKg: 1.1, averageWeight: 0.4 },
    bakery: { kgCO2PerKg: 1.3, averageWeight: 0.3 },
    'prepared-meals': { kgCO2PerKg: 5.0, averageWeight: 0.4 },
    default: { kgCO2PerKg: 3.0, averageWeight: 0.4 },
  };

  /**
   * Calculate CO2 savings based on food category and price
   */
  static calculateSavedCO2(category: string, originalPrice: number): number {
    const factor = this.CO2_FACTORS[category] || this.CO2_FACTORS.default;

    // Estimate food weight based on price
    const estimatedWeight = this.estimateWeight(
      originalPrice,
      factor.averageWeight,
    );

    // Calculate CO2 savings
    const savedCO2 = estimatedWeight * factor.kgCO2PerKg;

    return Math.round(savedCO2 * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Estimate food weight based on price and average weight
   */
  private static estimateWeight(price: number, averageWeight: number): number {
    // Simple estimation: assume price correlates with weight
    // This could be improved with more sophisticated price/weight data
    const estimatedWeight = (price / 20) * averageWeight; // Assuming €20 is a reference price
    return Math.min(estimatedWeight, 5); // Cap at 5kg to avoid unrealistic values
  }

  /**
   * Calculate total CO2 savings for multiple items
   */
  static calculateTotalSavedCO2(
    items: Array<{
      category: string;
      originalPrice: number;
    }>,
  ): number {
    return items.reduce(
      (total, item) =>
        total + this.calculateSavedCO2(item.category, item.originalPrice),
      0,
    );
  }

  /**
   * Convert CO2 savings to equivalent metrics
   */
  static getEquivalentMetrics(kgCO2: number): {
    carKm: number;
    treeDays: number;
    showerMinutes: number;
  } {
    return {
      carKm: Math.round(kgCO2 * 4), // 1kg CO2 ≈ 4km by car
      treeDays: Math.round(kgCO2 * 10), // 1kg CO2 ≈ 10 days of tree absorption
      showerMinutes: Math.round(kgCO2 * 6), // 1kg CO2 ≈ 6 minutes of hot shower
    };
  }
}
