// Simple AI service - can be enhanced with actual AI API later
const { Debt } = require('../models');

// Helper function to extract numbers from message
const extractNumbers = (message) => {
  const numbers = message.match(/\d+\.?\d*/g);
  return numbers ? numbers.map(n => parseFloat(n)) : [];
};

// Calculate debt payoff time
const calculatePayoffTime = (principal, interestRate, monthlyPayment) => {
  if (monthlyPayment <= (principal * (interestRate / 100 / 12))) {
    return { months: Infinity, totalInterest: Infinity };
  }
  
  let balance = principal;
  let months = 0;
  let totalInterest = 0;
  const monthlyRate = interestRate / 100 / 12;
  
  while (balance > 0 && months < 600) { // Max 50 years
    const interest = balance * monthlyRate;
    totalInterest += interest;
    const principalPayment = Math.min(monthlyPayment - interest, balance);
    balance -= principalPayment;
    months++;
  }
  
  return { months, totalInterest, years: (months / 12).toFixed(1) };
};

// Calculate minimum payment to avoid perpetual debt
const calculateMinimumRequired = (principal, interestRate) => {
  const monthlyRate = interestRate / 100 / 12;
  return principal * monthlyRate + 10; // Interest + at least RM 10 to principal
};

// Calculate interest saved
const calculateInterestSaved = (principal, interestRate, payment1, payment2) => {
  const result1 = calculatePayoffTime(principal, interestRate, payment1);
  const result2 = calculatePayoffTime(principal, interestRate, payment2);
  return {
    saved: result1.totalInterest - result2.totalInterest,
    monthsSaved: result1.months - result2.months,
    ...result2
  };
};

exports.getAIAdvice = async (userId, context = {}) => {
  try {
    const debts = await Debt.findAll({
      where: { userId, status: 'Active' }
    });

    if (debts.length === 0) {
      return 'Great job! You have no active debts. Consider building an emergency fund.';
    }

    // Find highest interest debt
    const highestInterestDebt = debts.reduce((max, debt) => 
      parseFloat(debt.interestRate) > parseFloat(max.interestRate) ? debt : max
    );

    const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount), 0);
    const avgInterestRate = debts.reduce((sum, debt) => 
      sum + parseFloat(debt.interestRate), 0) / debts.length;

    // Generate contextual advice
    let advice = '';

    if (avgInterestRate > 15) {
      advice = `Focus on ${highestInterestDebt.type} debt first using Avalanche method. Paying RM ${Math.round(parseFloat(highestInterestDebt.minimumPayment) * 1.5)} this month can save you RM ${Math.round(totalDebt * 0.05)} in interest.`;
    } else if (debts.length > 3) {
      advice = `Consider debt consolidation. With ${debts.length} active debts, consolidating could simplify payments and potentially lower your interest rate.`;
    } else {
      advice = `You're on track! Focus on the Snowball method - pay off your smallest debt (RM ${Math.min(...debts.map(d => parseFloat(d.amount)))}) first for quick wins.`;
    }

    return advice;
  } catch (error) {
    console.error('AI advice error:', error);
    return 'Unable to generate advice at this time.';
  }
};

// Generate chat response
exports.generateChatResponse = async (message, debts, userId) => {
  try {
    const lowerMessage = message.toLowerCase();
    const numbers = extractNumbers(message);

    // CALCULATION REQUESTS - Check for calculation keywords with numbers
    if ((lowerMessage.includes('calculate') || lowerMessage.includes('how long') || lowerMessage.includes('payoff') || lowerMessage.includes('pay off')) && numbers.length >= 2) {
      // Extract debt amount, interest rate, and payment amount
      const [amount, rate, payment] = numbers.length >= 3 ? numbers : [...numbers, numbers[1] * 0.03]; // Assume 3% min if not provided
      
      if (amount && rate && payment) {
        const result = calculatePayoffTime(amount, rate, payment);
        
        if (result.months === Infinity) {
          const minRequired = calculateMinimumRequired(amount, rate);
          return `⚠️ **Warning: Your payment is too low!**\n\nWith:\n• Debt: RM ${amount.toLocaleString()}\n• Interest Rate: ${rate}%\n• Monthly Payment: RM ${payment.toLocaleString()}\n\n❌ Your payment doesn't cover the monthly interest! You'll NEVER pay off this debt.\n\n**Minimum Required Payment:** RM ${minRequired.toFixed(2)}\n\nThis covers the interest (RM ${(amount * rate / 100 / 12).toFixed(2)}) plus a bit of principal.\n\n💡 **Recommendation:** Pay at least RM ${Math.ceil(minRequired / 10) * 10} per month to make real progress!`;
        }
        
        // Calculate comparison with higher payment
        const higherPayment = payment * 1.5;
        const comparison = calculateInterestSaved(amount, rate, payment, higherPayment);
        
        return `📊 **Debt Payoff Calculator Results**\n\n**Your Scenario:**\n• Debt Amount: RM ${amount.toLocaleString()}\n• Interest Rate: ${rate}% per year\n• Monthly Payment: RM ${payment.toLocaleString()}\n\n✅ **Payoff Time:** ${result.months} months (${result.years} years)\n💰 **Total Interest Paid:** RM ${result.totalInterest.toLocaleString('en-MY', {maximumFractionDigits: 2})}\n💵 **Total Amount Paid:** RM ${(amount + result.totalInterest).toLocaleString('en-MY', {maximumFractionDigits: 2})}\n\n---\n\n💡 **What if you paid RM ${higherPayment.toLocaleString()} instead?**\n⏱️ **New Payoff Time:** ${comparison.months} months (${comparison.years} years)\n✨ **Time Saved:** ${comparison.monthsSaved} months!\n💰 **Interest Saved:** RM ${comparison.saved.toLocaleString('en-MY', {maximumFractionDigits: 2})}\n\n🚀 **Pro Tip:** Every extra RM 100/month makes a HUGE difference. Even RM 50 extra helps!`;
      }
    }

    // Calculate consolidation savings
    if ((lowerMessage.includes('consolidat') || lowerMessage.includes('combine')) && lowerMessage.includes('calculate') && debts.length > 0) {
      const totalDebt = debts.reduce((sum, d) => sum + parseFloat(d.amount), 0);
      const avgRate = debts.reduce((sum, d) => sum + parseFloat(d.interestRate), 0) / debts.length;
      const totalMinPayment = debts.reduce((sum, d) => sum + parseFloat(d.minimumPayment || d.amount * 0.03), 0);
      
      // Assume consolidation rate is 2-3% lower
      const consolidatedRate = Math.max(avgRate - 2.5, 6);
      const consolidatedPayment = totalMinPayment;
      
      const currentPayoff = calculatePayoffTime(totalDebt, avgRate, totalMinPayment);
      const consolidatedPayoff = calculatePayoffTime(totalDebt, consolidatedRate, consolidatedPayment);
      
      return `📊 **Debt Consolidation Calculator**\n\n**Current Situation:**\n• Total Debt: RM ${totalDebt.toLocaleString()}\n• Number of Debts: ${debts.length}\n• Average Interest: ${avgRate.toFixed(2)}%\n• Total Min Payment: RM ${totalMinPayment.toLocaleString('en-MY', {maximumFractionDigits: 2})}\n• Payoff Time: ${currentPayoff.months} months (${currentPayoff.years} years)\n• Total Interest: RM ${currentPayoff.totalInterest.toLocaleString('en-MY', {maximumFractionDigits: 2})}\n\n**With Consolidation (estimated ${consolidatedRate}% rate):**\n• Single Monthly Payment: RM ${consolidatedPayment.toLocaleString('en-MY', {maximumFractionDigits: 2})}\n• New Payoff Time: ${consolidatedPayoff.months} months (${consolidatedPayoff.years} years)\n• Total Interest: RM ${consolidatedPayoff.totalInterest.toLocaleString('en-MY', {maximumFractionDigits: 2})}\n\n✨ **Savings:**\n💰 Interest Saved: RM ${(currentPayoff.totalInterest - consolidatedPayoff.totalInterest).toLocaleString('en-MY', {maximumFractionDigits: 2})}\n⏱️ Time Saved: ${currentPayoff.months - consolidatedPayoff.months} months\n\n${(currentPayoff.totalInterest - consolidatedPayoff.totalInterest) > 0 ? '✅ **Consolidation makes sense for you!**' : '⚠️ Current rates are already good. Focus on paying more instead.'}\n\nWant help finding consolidation options?`;
    }

    // Calculate emergency fund
    if ((lowerMessage.includes('emergency') || lowerMessage.includes('save')) && lowerMessage.includes('calculate') && numbers.length > 0) {
      const monthlyExpense = numbers[0];
      const monthlyIncome = numbers[1] || monthlyExpense * 1.5;
      const currentSavings = numbers[2] || 0;
      
      const targetEmergency = monthlyExpense * 6;
      const remaining = targetEmergency - currentSavings;
      const savingsRate = monthlyIncome * 0.2; // 20% savings rate
      const monthsToGoal = remaining / savingsRate;
      
      return `📊 **Emergency Fund Calculator**\n\n**Your Inputs:**\n• Monthly Expenses: RM ${monthlyExpense.toLocaleString()}\n• Monthly Income: RM ${monthlyIncome.toLocaleString()}\n• Current Savings: RM ${currentSavings.toLocaleString()}\n\n**Emergency Fund Goal:**\n🎯 **Target Amount:** RM ${targetEmergency.toLocaleString()} (6 months expenses)\n✅ **Current Progress:** ${((currentSavings / targetEmergency) * 100).toFixed(1)}%\n💰 **Still Need:** RM ${remaining.toLocaleString()}\n\n**Savings Plan (20% of income):**\n📈 **Monthly Savings:** RM ${savingsRate.toLocaleString()}\n⏱️ **Time to Goal:** ${Math.ceil(monthsToGoal)} months (${(monthsToGoal / 12).toFixed(1)} years)\n\n**Milestones:**\n✓ First RM 1,000: ${currentSavings >= 1000 ? 'DONE! ✅' : `${Math.ceil((1000 - currentSavings) / savingsRate)} months`}\n✓ 3 months expenses: ${currentSavings >= monthlyExpense * 3 ? 'DONE! ✅' : `${Math.ceil((monthlyExpense * 3 - currentSavings) / savingsRate)} months`}\n✓ Full 6 months: ${Math.ceil(monthsToGoal)} months\n\n💡 **Tips:**\n• Automate savings transfers\n• Put windfalls directly in\n• Keep in separate account\n\nYou've got this! 🚀`;
    }

    // Calculate how much to pay extra
    if (lowerMessage.includes('how much') && (lowerMessage.includes('extra') || lowerMessage.includes('more')) && numbers.length >= 2) {
      const amount = numbers[0];
      const rate = numbers[1];
      const currentPayment = numbers[2] || amount * 0.03;
      
      const scenario1 = calculatePayoffTime(amount, rate, currentPayment);
      const scenario2 = calculatePayoffTime(amount, rate, currentPayment + 100);
      const scenario3 = calculatePayoffTime(amount, rate, currentPayment + 250);
      const scenario4 = calculatePayoffTime(amount, rate, currentPayment + 500);
      
      return `📊 **Extra Payment Impact Calculator**\n\n**Your Debt:**\n• Amount: RM ${amount.toLocaleString()}\n• Interest Rate: ${rate}%\n• Current Payment: RM ${currentPayment.toLocaleString()}\n\n**What happens if you pay MORE?**\n\n💵 **Current (RM ${currentPayment}):**\n⏱️ ${scenario1.months} months | 💰 RM ${scenario1.totalInterest.toLocaleString('en-MY', {maximumFractionDigits: 0})} interest\n\n💵 **+RM 100 (RM ${currentPayment + 100}):**\n⏱️ ${scenario2.months} months | 💰 RM ${scenario2.totalInterest.toLocaleString('en-MY', {maximumFractionDigits: 0})} interest\n✨ Save ${scenario1.months - scenario2.months} months & RM ${(scenario1.totalInterest - scenario2.totalInterest).toLocaleString('en-MY', {maximumFractionDigits: 0})}!\n\n💵 **+RM 250 (RM ${currentPayment + 250}):**\n⏱️ ${scenario3.months} months | 💰 RM ${scenario3.totalInterest.toLocaleString('en-MY', {maximumFractionDigits: 0})} interest\n✨ Save ${scenario1.months - scenario3.months} months & RM ${(scenario1.totalInterest - scenario3.totalInterest).toLocaleString('en-MY', {maximumFractionDigits: 0})}!\n\n💵 **+RM 500 (RM ${currentPayment + 500}):**\n⏱️ ${scenario4.months} months | 💰 RM ${scenario4.totalInterest.toLocaleString('en-MY', {maximumFractionDigits: 0})} interest\n✨ Save ${scenario1.months - scenario4.months} months & RM ${(scenario1.totalInterest - scenario4.totalInterest).toLocaleString('en-MY', {maximumFractionDigits: 0})}!\n\n🎯 **Recommendation:** Even RM 100 extra makes a huge difference! Every ringgit counts! 💪`;
    }

    // Debt-related queries
    if (lowerMessage.includes('debt') || lowerMessage.includes('owe')) {
      if (debts.length === 0) {
        return "Great news! You currently don't have any active debts in the system. Would you like to add a debt to track, or do you have questions about debt management in general?";
      }

      const totalDebt = debts.reduce((sum, d) => sum + parseFloat(d.amount), 0);
      const highestInterest = debts.reduce((max, d) => parseFloat(d.interestRate) > parseFloat(max.interestRate) ? d : debts[0]);
      return `You currently have ${debts.length} active debt(s) totaling RM ${totalDebt.toLocaleString()}. Your highest interest debt is ${highestInterest.name} at ${highestInterest.interestRate}%. I recommend focusing on high-interest debts first to save money long-term.`;
    }

    // Strategy queries
    if (lowerMessage.includes('strategy') || lowerMessage.includes('method') || lowerMessage.includes('pay off') || lowerMessage.includes('avalanche') || lowerMessage.includes('snowball')) {
      return "I recommend two proven debt repayment strategies:\n\n**1. Avalanche Method** 🏔️\nPay off debts with the highest interest rates first. This saves the most money on interest over time.\n\n**2. Snowball Method** ⛄\nPay off the smallest debts first for quick psychological wins and momentum.\n\n**3. Hybrid Approach** 🎯\nCombine both - tackle one small debt for motivation, then focus on high-interest debts.\n\nWhich sounds better for your situation?";
    }

    // Budget queries
    if (lowerMessage.includes('budget') || lowerMessage.includes('save') || lowerMessage.includes('spending')) {
      return "Here are proven budgeting strategies:\n\n**50/30/20 Rule** 📊\n• 50% - Needs (rent, food, utilities)\n• 30% - Wants (entertainment, dining out)\n• 20% - Savings & debt repayment\n\n**Money-Saving Tips** 💰\n• Track ALL expenses for 30 days\n• Cancel unused subscriptions\n• Cook at home (saves RM 500+/month)\n• Use cashback apps and rewards\n• Set up automatic savings\n\nWould you like help creating a personalized budget?";
    }

    // Interest queries
    if (lowerMessage.includes('interest') || lowerMessage.includes('rate') || lowerMessage.includes('apr')) {
      if (debts.length > 0) {
        const avgRate = debts.reduce((sum, d) => sum + parseFloat(d.interestRate), 0) / debts.length;
        const highRate = debts.reduce((max, d) => parseFloat(d.interestRate) > parseFloat(max.interestRate) ? d : debts[0]);
        return `Your average interest rate is ${avgRate.toFixed(2)}%. Your highest rate is ${highRate.interestRate}% on ${highRate.name}.\n\n**Interest Rate Guide:**\n• Under 10% - Good! Focus on building savings\n• 10-15% - Moderate. Pay extra when possible\n• Above 15% - High priority! Attack these first\n\n💡 Tip: Consider debt consolidation or balance transfer to lower rates!`;
      }
      return "**Typical Interest Rates in Malaysia:**\n\n• Credit Cards: 15-18% p.a.\n• Personal Loans: 6-15% p.a.\n• Car Loans: 2-4% p.a.\n• Home Loans: 3-5% p.a.\n• PTPTN: 1% p.a.\n\nLower rates = less money wasted on interest! Always prioritize high-interest debts.";
    }

    // Consolidation queries
    if (lowerMessage.includes('consolidat') || lowerMessage.includes('combine') || lowerMessage.includes('merge debt')) {
      const hasDebts = debts && debts.length > 0;
      return `**Debt Consolidation** combines multiple debts into one payment at a lower rate.\n\n✅ **Benefits:**\n• Single monthly payment (easier to manage)\n• Potentially lower interest rate\n• Fixed payoff timeline\n• Reduced mental stress\n\n📋 **Requirements:**\n• Credit score 600+ (higher is better)\n• Steady income proof\n• Debt-to-income ratio under 50%\n\n💡 **Options:**\n1. Personal loan from bank\n2. Balance transfer credit card\n3. Home equity loan (if you own property)\n\n${hasDebts ? '📊 **Want me to calculate YOUR consolidation savings?**\nJust say: "Calculate consolidation" and I\'ll show you exactly how much you could save!' : 'Want help calculating if consolidation makes sense for you?'}`;
    }

    // Credit score queries
    if (lowerMessage.includes('credit score') || lowerMessage.includes('credit rating') || lowerMessage.includes('ccris') || lowerMessage.includes('ctos')) {
      return "**Credit Score in Malaysia** 🎯\n\nYour credit score (CCRIS/CTOS) affects loan approvals and interest rates.\n\n**Score Ranges:**\n• 800-850: Excellent ⭐⭐⭐⭐⭐\n• 740-799: Very Good ⭐⭐⭐⭐\n• 670-739: Good ⭐⭐⭐\n• 580-669: Fair ⭐⭐\n• Below 580: Poor ⭐\n\n**Improve Your Score:**\n✓ Pay bills on time (most important!)\n✓ Keep credit utilization under 30%\n✓ Don't apply for multiple cards/loans\n✓ Check CCRIS report annually (free!)\n✓ Settle collections/defaults\n\nGood credit = lower rates = save thousands!";
    }

    // Emergency fund queries
    if (lowerMessage.includes('emergency') || lowerMessage.includes('savings') || lowerMessage.includes('rainy day')) {
      return "**Emergency Fund** is your financial safety net! 🛡️\n\n**Target Amount:**\n• Start: RM 1,000 (for small emergencies)\n• Goal: 3-6 months of expenses\n• Example: If monthly expenses = RM 2,000, save RM 6,000-12,000\n\n**Building Strategy:**\n1. Save RM 50-100/month automatically\n2. Put windfalls (bonus, tax refund) directly in\n3. Keep in separate high-yield savings account\n4. Only use for TRUE emergencies\n\n**Priority Order:**\n1. RM 1,000 emergency fund\n2. Pay high-interest debt (>15%)\n3. Build full 3-6 month fund\n4. Pay remaining debt\n5. Invest for future\n\n📊 **Want me to calculate YOUR emergency fund plan?**\nJust tell me: \"Calculate emergency fund [monthly expenses] [monthly income] [current savings]\"\nExample: \"Calculate emergency fund 2000 4000 500\"";
    }

    // Minimum payment queries
    if (lowerMessage.includes('minimum payment') || lowerMessage.includes('minimum pay') || lowerMessage.includes('pay minimum')) {
      return "⚠️ **WARNING: Minimum Payments Are a Trap!**\n\nPaying only minimums costs you MASSIVE interest.\n\n**Example:**\nRM 10,000 credit card debt @ 18% APR\n• Minimum only: 26 YEARS to pay off, RM 14,000+ in interest\n• RM 300/month: 4 years, RM 3,500 interest\n• RM 500/month: 2 years, RM 2,000 interest\n\n💡 **Always pay MORE than minimum!** Even RM 50 extra makes a huge difference.\n\n**Quick Wins:**\n• Round up payments (RM 180 → RM 200)\n• Pay bi-weekly instead of monthly\n• Put ANY extra money toward debt\n\nEvery ringgit over minimum = freedom faster!\n\n📊 **Want me to calculate YOUR payoff time?**\nJust tell me: \"Calculate payoff for [amount] at [rate]% paying [monthly payment]\"\nExample: \"Calculate payoff for 5000 at 18% paying 300\"";
    }

    // Income/side hustle queries
    if (lowerMessage.includes('income') || lowerMessage.includes('side hustle') || lowerMessage.includes('extra money') || lowerMessage.includes('earn more')) {
      return "**Increase Income to Crush Debt Faster!** 💪\n\n**Side Hustle Ideas (Malaysia):**\n🚗 Grab/Lalamove driver\n💻 Freelancing (Fiverr, Upwork)\n📸 Sell items online (Carousell, Shopee)\n📚 Tutoring (online/in-person)\n🍜 Food delivery (FoodPanda, GrabFood)\n🎨 Graphic design / content creation\n📝 Content writing / translation\n\n**Quick Cash:**\n• Sell unused items\n• Rent out parking space\n• Do surveys (limited income)\n• Overtime at work\n\n💡 **Strategy:** Direct ALL extra income to debt! Even RM 500/month extra can cut years off repayment.\n\nWhat skills do you have that could earn extra?";
    }

    // Balance transfer queries
    if (lowerMessage.includes('balance transfer') || lowerMessage.includes('transfer balance')) {
      return "**Balance Transfer** can slash your interest rate! 💳\n\n**How It Works:**\nMove high-interest debt to new card with 0% intro rate (usually 6-12 months).\n\n✅ **Benefits:**\n• 0% interest period = all payments go to principal\n• Can save thousands in interest\n• Breathing room to pay down debt\n\n⚠️ **Watch Out:**\n• Transfer fee (usually 3-5%)\n• Must pay off before promo ends\n• Don't use new card for purchases!\n• Interest skyrockets after promo\n\n**Good Candidates:**\n✓ Credit score 650+\n✓ Can pay off in promo period\n✓ High-interest debt (>15%)\n✓ Disciplined with spending\n\n💡 Calculate: Does fee < interest saved? Then do it!\n\nWant help with the math?";
    }

    // Negotiation queries
    if (lowerMessage.includes('negotiat') || lowerMessage.includes('lower interest') || lowerMessage.includes('talk to bank')) {
      return "**Negotiate with Creditors** - Yes, it works! 📞\n\n**What to Negotiate:**\n• Lower interest rate (even 2-3% helps!)\n• Waive late fees\n• Extended payment terms\n• Settlement for less than owed\n\n**How to Negotiate:**\n1. Call customer service, ask for retention dept\n2. Be polite but firm\n3. Mention good payment history\n4. Say you're considering balance transfer\n5. Ask: \"What can you do to help me?\"\n\n**Script:**\n\"I've been a customer for X years and always paid on time. I'm struggling with this rate. Can you lower it to help me pay this off faster?\"\n\n**Pro Tips:**\n✓ Call multiple times if first no\n✓ Be willing to close account (leverage)\n✓ Get everything in writing\n✓ Stay calm and professional\n\n🎯 Success rate is surprisingly high! Worth 30 minutes to save thousands.";
    }

    // Bankruptcy queries
    if (lowerMessage.includes('bankrupt') || lowerMessage.includes('bankruptcy') || lowerMessage.includes('cant pay') || lowerMessage.includes("can't pay")) {
      return "I hear you're in a tough spot. Let's explore ALL options before considering bankruptcy.\n\n**Before Bankruptcy, Try:**\n1. ⚡ Contact AKPK (Agensi Kaunseling dan Pengurusan Kredit)\n   - Free government debt counseling\n   - Debt Management Programme (DMP)\n   - Website: akpk.org.my\n\n2. 💬 Negotiate with creditors directly\n3. 🏦 Debt consolidation loan\n4. 👨‍👩‍👧 Seek family help (temporary)\n5. 💼 Increase income (side job)\n\n**Bankruptcy Consequences:**\n❌ Can't travel abroad without permission\n❌ Can't be company director\n❌ Can't get credit for years\n❌ Social stigma\n❌ May lose assets\n\n**You Have Options!** The fact you're here shows you want to fix this. Let me help you find a better path.\n\nShall we start with AKPK or debt negotiation?";
    }

    // Motivation/encouragement
    if (lowerMessage.includes('help') || lowerMessage.includes('stress') || lowerMessage.includes('overwhelm') || lowerMessage.includes('depress') || lowerMessage.includes('give up') || lowerMessage.includes('hopeless')) {
      return "I hear you, and I want you to know: **You are NOT alone, and this IS solvable!** 💙\n\n**Deep breath.** Debt is overwhelming, but you're already winning by:\n✓ Facing the problem (many avoid this!)\n✓ Seeking help (you're here!)\n✓ Taking action (huge step!)\n\n**Remember:**\n🌱 Small progress IS progress\n🎯 Focus on just TODAY'S actions\n📈 Every RM paid = one step closer to freedom\n💪 Thousands have done this - so can you!\n🌈 This is temporary - your future self will thank you\n\n**One Thing Today:**\nPick ONE small action (list debts, make one call, cut one expense). Just one.\n\n**You've got this!** �\n\nWhat's one small thing I can help you with RIGHT NOW?";
    }

    // Malaysian-specific queries (PTPTN, EPF, etc.)
    if (lowerMessage.includes('ptptn') || lowerMessage.includes('education loan')) {
      return "**PTPTN Loans** (Malaysian Education Loans) 🎓\n\n**Interest Rate:** 1% p.a. (VERY low!)\n**Strategy:** Pay other high-interest debts first\n\n**PTPTN Benefits:**\n✓ Discount for early settlement\n✓ Automatic salary deduction available\n✓ Can check balance online (MyPTPTN)\n✓ Flexible repayment schedule\n\n**Repayment Tips:**\n• Don't rush - it's low interest\n• Pay minimums while attacking credit cards\n• Use bonuses for lump sum (get discount!)\n• Set up auto-deduction to avoid default\n\n⚠️ **Default Consequences:**\n❌ Travel ban\n❌ Salary garnishment\n❌ Legal action\n\nKeep it current, but prioritize higher-interest debts!";
    }

    if (lowerMessage.includes('epf') || lowerMessage.includes('kwsp') || lowerMessage.includes('withdraw epf')) {
      return "**EPF/KWSP Withdrawal for Debt?** 🤔\n\nThink CAREFULLY before withdrawing retirement funds!\n\n**Pros:**\n✓ Pay off high-interest debt quickly\n✓ Save on interest charges\n✓ Reduce stress\n\n**Cons:**\n❌ Lose compound growth (huge long-term cost!)\n❌ Less for retirement\n❌ RM 10K now = RM 50K+ at retirement\n❌ Limited withdrawal eligibility\n\n**When It Makes Sense:**\n• Very high interest debt (>18%)\n• Can't make minimum payments\n• Facing bankruptcy/legal action\n\n**Better Options:**\n1. Debt consolidation loan\n2. Negotiate with creditors\n3. AKPK Debt Management Program\n4. Increase income temporarily\n\n💡 Use EPF as LAST RESORT only. Your future self needs that money!\n\nLet's explore other options first?";
    }

    // Greeting queries
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage.includes('hey') || lowerMessage === 'hi' || lowerMessage === 'hey') {
      return "Hello! 👋 I'm your AI Debt Coach, here to help you become debt-free!\n\nI can help with:\n💰 Debt repayment strategies\n📊 Budget planning & money saving\n🎯 Credit score improvement\n💳 Balance transfers & consolidation\n📞 Negotiating with creditors\n💪 Motivation & support\n\nWhat's on your mind today?";
    }

    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! 😊 Remember, every step forward matters. Keep going - you've got this! 💪\n\nNeed anything else? I'm here to help!";
    }

    // Check if question is too far outside expertise
    const debtRelatedKeywords = ['debt', 'loan', 'money', 'pay', 'budget', 'save', 'interest', 'credit', 'bank', 'finance', 'financial', 'income', 'expense', 'owe', 'payment', 'consolidat', 'strategy', 'card', 'mortgage', 'car loan', 'personal loan'];
    const hasDebtKeyword = debtRelatedKeywords.some(keyword => lowerMessage.includes(keyword));

    if (!hasDebtKeyword) {
      return "I apologize, but I'm specialized in **debt management and personal finance** topics. 💼\n\nMy expertise includes:\n• Debt repayment strategies\n• Budget planning\n• Interest rate management\n• Credit score improvement\n• Financial motivation & support\n\nYour question seems to be outside my area of expertise. Could you rephrase it as a debt or finance-related question? Or feel free to ask me anything about managing debt! 😊";
    }

    // Default comprehensive response
    return "I'm your AI Debt Coach! I specialize in helping you become debt-free. 🎯\n\n**I can help with:**\n\n💰 **Debt Strategies**\n• Avalanche & Snowball methods\n• Consolidation options\n• Balance transfers\n\n📊 **Money Management**\n• Budget creation (50/30/20 rule)\n• Expense tracking\n• Saving techniques\n\n🎯 **Credit & Loans**\n• Credit score improvement\n• Interest rate negotiation\n• Loan refinancing\n\n💪 **Support & Planning**\n• Personalized advice\n• Motivation when it's tough\n• Step-by-step action plans\n\n🧮 **NEW! I can CALCULATE for you:**\n• Debt payoff time & interest\n• Consolidation savings\n• Emergency fund plans\n• Extra payment impact\n\n**Examples:**\n\"Calculate payoff for 10000 at 18% paying 500\"\n\"Calculate consolidation\"\n\"Calculate emergency fund 3000 5000 1000\"\n\n**What would you like help with today?** Ask me anything about debt, budgeting, or financial freedom! 🚀";
  } catch (error) {
    console.error('Generate chat response error:', error);
    return "I apologize, but I encountered a technical difficulty due to constrained resources. 😔\n\nThis could be due to:\n• Temporary server overload\n• Database connection issue\n• Processing limitations\n\nPlease try:\n1. Rephrasing your question\n2. Asking something simpler\n3. Trying again in a moment\n\nI'm here to help with debt management, budgeting, and financial planning. Let's try again! 💪";
  }
};
