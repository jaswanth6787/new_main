interface CycleInput {
  last_period_date: string;
  today: string;
  average_cycle: number;
  name: string;
}

interface CycleResult {
  message: string;
  phase: string;
  price_total: number;
  weight: number;
  quantity: number;
  A: number;
  B: number;
  D: number;
  BB: number;
}

export function calculateCycleMessage(data: CycleInput): CycleResult {
  let lastPeriodDate = new Date(data.last_period_date);
  const today = new Date(data.today);
  const BB = data.average_cycle;

  // Day 1 = last_period_date
  let A = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (A < 1) {
    throw new Error("Last period date cannot be in the future");
  }

  const B = Math.ceil(BB / 2);

  if (A > BB) {
    const cyclesPassed = Math.floor((A - 1) / BB);
    lastPeriodDate = new Date(lastPeriodDate.getTime() + cyclesPassed * BB * 24 * 60 * 60 * 1000);
    A = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  let phase: string;
  let D: number;

  if (A <= B) {
    phase = "Phase-1";
    D = B - A;
  } else {
    phase = "Phase-2";
    D = BB - A;
  }

  if (D < 0) {
    D = 0;
  }

  const midpointDate = new Date(lastPeriodDate.getTime() + (B - 1) * 24 * 60 * 60 * 1000);
  const phase2StartDate = new Date(midpointDate.getTime() + 24 * 60 * 60 * 1000);
  const cycleEndDate = new Date(lastPeriodDate.getTime() + (BB - 1) * 24 * 60 * 60 * 1000);
  const nextCycleDate = cycleEndDate;

  const ladduWeight = 30;
  const ladduRate = 0.866;

  // For pre-orders (D <= 8), use fixed values
  const isPreOrder = D <= 8;
  const priceTotal = isPreOrder ? 390 : Math.round(ladduWeight * ladduRate * D);
  const weight = isPreOrder ? 450 : D * ladduWeight+15;
  const quantity = isPreOrder ? 15 : D;

  let message: string;

  if (phase === "Phase-1") {
    if (D <= 8) {
      message = `Hi ${data.name} ma’am! 🌸\n Today is Day ${A} of your menstrual cycle.\n You have only ${D+1} days left to complete Phase 1 (ends on ${midpointDate.toISOString().split('T')[0]}).\nPhase 2 laddus will start from ${phase2StartDate.toISOString().split('T')[0]}.\nPre-orders are now open — place your order today to reserve your Phase 2 laddus.\n 📦 Delivery Date: ${midpointDate.toISOString().split('T')[0]}\n 📦 Quantity: 15 laddus\n ⚖️ Weight: 450 g\n 💰 Total Price:\n 30 g (per laddu) × ₹0.866 (per g) × 15 laddus = ₹390\n`;
    } else {
      message = `Hi ${data.name} ma’am! 🌸\n Today is Day ${A} of your menstrual cycle.\n We will deliver ${D+1} Phase-1 laddus (Flax + Pumpkin).\n Quantity: ${quantity+1} laddus\n Weight: ${weight} g\n Total Price: 30 g (per laddu) × ₹0.866 (per g) × ${D + 1} laddus = ₹${priceTotal}`;
    }
  } else {
    if (D <= 8) {
      message = `Hi ${data.name} ma’am! 🌸\n Today is Day ${A} of your menstrual cycle.\n You have only ${D} days left to complete Phase 2 (ends on ${cycleEndDate.toISOString().split('T')[0]}).\n Phase 1 laddus will start from ${nextCycleDate.toISOString().split('T')[0]}.\n Pre-orders are now open — place your order today to reserve your Phase 1 laddus.\n 📦 Delivery Date: ${nextCycleDate.toISOString().split('T')[0]}\n 📦 Quantity: 15 laddus\n ⚖️ Weight: 450 g\n 💰 Total Price:30 g (per laddu) × ₹0.866 (per g) × 15 laddus = ₹390\n`;
    } else {
      message = `Hi ${data.name} ma’am! 🌸\n Today is Day ${A} of your menstrual cycle.\n We'll deliver ${D} Phase-2 laddus (Sunflower + Sesame).\nQuantity = ${quantity} laddus\nWeight : ${weight} g\nTotal price = 30 g(per laddu) × ₹0.866(per g) × ${D}(laddus) = ₹${priceTotal}`;
    }
  }

  return {
    message,
    phase,
    price_total: priceTotal,
    weight,
    quantity,
    A,
    B,
    D,
    BB
  };
}
