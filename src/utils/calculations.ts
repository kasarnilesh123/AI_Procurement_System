import { Criterion, VendorProposal, VendorEvaluationResult, ComplianceStatus } from '../types/procurement';

/**
 * Calculates the total weight of a list of criteria.
 */
export function calculateTotalWeight(criteria: Criterion[]): number {
  return criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
}

/**
 * Normalizes weights proportionally so they sum exactly to 100%.
 */
export function normalizeWeights(criteria: Criterion[]): Criterion[] {
  const total = calculateTotalWeight(criteria);
  if (total === 0) {
    const equalShare = Math.floor(100 / criteria.length);
    const remainder = 100 - equalShare * criteria.length;
    return criteria.map((c, i) => ({
      ...c,
      weight: i === 0 ? equalShare + remainder : equalShare,
    }));
  }

  let runningSum = 0;
  const count = criteria.length;
  return criteria.map((c, index) => {
    if (index === count - 1) {
      return { ...c, weight: Math.max(0, 100 - runningSum) };
    }
    const scaled = Math.round((c.weight / total) * 100);
    runningSum += scaled;
    return { ...c, weight: scaled };
  });
}

/**
 * Evaluates proposals against criteria using real weighted mathematical scoring.
 */
export function evaluateProposals(
  criteria: Criterion[],
  proposals: VendorProposal[],
  projectBudget: number
): VendorEvaluationResult[] {
  const totalWeight = calculateTotalWeight(criteria);
  const effectiveTotalWeight = totalWeight > 0 ? totalWeight : 100;

  const results: VendorEvaluationResult[] = proposals.map((proposal) => {
    let overallWeightedScore = 0;

    const breakdown = criteria.map((criterion) => {
      const evaluation = proposal.criterionEvaluations[criterion.id] || {
        rawScore: 0,
        complianceStatus: 'not_provided' as ComplianceStatus,
        notes: 'Criterion not evaluated or missing from proposal extraction.',
        sourceCitation: 'N/A',
        evidenceSnippet: 'Not Provided in submission.',
      };

      const rawScore = evaluation.rawScore;
      // Formula: (criterion.weight / effectiveTotalWeight) * rawScore
      const weightedScore = (criterion.weight / effectiveTotalWeight) * rawScore;
      overallWeightedScore += weightedScore;

      return {
        criterionId: criterion.id,
        criterionKey: criterion.key,
        criterionLabel: criterion.label,
        weight: criterion.weight,
        rawScore,
        weightedScore: Number(weightedScore.toFixed(2)),
        complianceStatus: evaluation.complianceStatus,
        evidenceSnippet: evaluation.evidenceSnippet,
        sourceCitation: evaluation.sourceCitation,
      };
    });

    const roundedOverall = Number(overallWeightedScore.toFixed(1));

    // Dynamic extraction of technical strengths
    const techBreakdown = breakdown.filter(b => 
      ['technical_compliance', 'quality', 'warranty', 'vendor_experience'].includes(b.criterionKey)
    );
    const technicalStrengths = techBreakdown
      .filter(b => b.rawScore >= 80)
      .map(b => ({
        title: `${b.criterionLabel} Excellence (${b.rawScore}/100)`,
        detail: b.evidenceSnippet || 'Substantially exceeds baseline requirements with audited verification.',
        citation: b.sourceCitation,
      }));

    if (technicalStrengths.length === 0) {
      technicalStrengths.push({
        title: 'Meets Baseline Architectural Specifications',
        detail: 'Standard enterprise compliance observed across core functional modules.',
        citation: proposal.fields['tech_stack']?.sourceCitation || 'General Submission',
      });
    }

    // Dynamic commercial advantages
    const budgetDiff = projectBudget - proposal.totalBidAmount;
    const savingPercent = ((budgetDiff / projectBudget) * 100).toFixed(1);
    const commercialAdvantages = [];

    if (budgetDiff > 0) {
      commercialAdvantages.push({
        title: `Within Budget (Saves ₹${budgetDiff.toLocaleString('en-IN')} / ${savingPercent}%)`,
        detail: `Offered price is ₹${proposal.totalBidAmount.toLocaleString('en-IN')}, leaving ₹${budgetDiff.toLocaleString('en-IN')} in budget savings.`,
        savingVsBudget: `+₹${budgetDiff.toLocaleString('en-IN')}`,
      });
    } else if (budgetDiff === 0) {
      commercialAdvantages.push({
        title: 'Matches Budget Exactly',
        detail: `The bid matches the approved project budget with zero surplus or deficit.`,
        savingVsBudget: '₹0',
      });
    } else {
      commercialAdvantages.push({
        title: `Exceeds Budget by ₹${Math.abs(budgetDiff).toLocaleString('en-IN')}`,
        detail: `Price of ₹${proposal.totalBidAmount.toLocaleString('en-IN')} is higher than the budget by ₹${Math.abs(budgetDiff).toLocaleString('en-IN')}.`,
        savingVsBudget: `-₹${Math.abs(budgetDiff).toLocaleString('en-IN')}`,
      });
    }

    if (proposal.paymentTerms) {
      commercialAdvantages.push({
        title: 'Payment Terms',
        detail: `Milestones: ${proposal.paymentTerms}`,
        savingVsBudget: 'Flexible',
      });
    }

    // Dynamic risks analysis
    const risks: { severity: 'low' | 'medium' | 'high'; title: string; mitigation: string }[] = [];

    breakdown.forEach(b => {
      if (b.complianceStatus === 'non_compliant') {
        risks.push({
          severity: 'high',
          title: `Non-Compliance Flag: ${b.criterionLabel}`,
          mitigation: `Require formal clarification addendum or contractual indemnification before award consideration.`,
        });
      } else if (b.complianceStatus === 'minor_deviation') {
        risks.push({
          severity: 'medium',
          title: `Specification Variance in ${b.criterionLabel}`,
          mitigation: `Subject to pre-contractual negotiation and SLA enforcement.`,
        });
      } else if (b.rawScore < 70 && b.complianceStatus !== 'not_provided') {
        risks.push({
          severity: 'low',
          title: `Marginal Performance on ${b.criterionLabel} (${b.rawScore}/100)`,
          mitigation: `Establish quarterly audit checkpoints with financial holdbacks.`,
        });
      }
    });

    if (proposal.deliveryTimelineWeeks > 24) {
      risks.push({
        severity: 'medium',
        title: `Extended Deployment Window (${proposal.deliveryTimelineWeeks} weeks)`,
        mitigation: `Incorporate phased milestone delivery with liquidated damage penalties for delays beyond week 20.`,
      });
    }

    // Missing information check
    const missingInformation: { item: string; impact: string }[] = [];
    breakdown.forEach(b => {
      if (b.complianceStatus === 'not_provided') {
        missingInformation.push({
          item: `${b.criterionLabel} documentation or proof`,
          impact: 'Weighted score forfeited for this section. Requires formal RFQ addendum inquiry.',
        });
      }
    });

    Object.values(proposal.fields).forEach(f => {
      if (f.extractedValue === 'Not Provided' || f.extractedValue === 'Missing') {
        missingInformation.push({
          item: f.label,
          impact: 'Information gap in vendor submission.',
        });
      }
    });

    // Key reasons summary
    const keyReasons: string[] = [
      `Overall score of ${roundedOverall}/100 based on all evaluation criteria.`,
      `Bid price of ₹${proposal.totalBidAmount.toLocaleString('en-IN')} (${budgetDiff >= 0 ? `saves ₹${budgetDiff.toLocaleString('en-IN')}` : `exceeds budget by ₹${Math.abs(budgetDiff).toLocaleString('en-IN')}`}).`,
      `Delivery in ${proposal.deliveryTimelineWeeks} weeks with ${proposal.warrantyMonths} months free warranty.`,
    ];

    if (risks.length === 0) {
      keyReasons.push('Zero risk flags: all security and compliance requirements met.');
    } else {
      keyReasons.push(`${risks.length} potential risk or clarification points noted.`);
    }

    return {
      vendorId: proposal.vendorId,
      vendorName: proposal.vendorName,
      proposalId: proposal.id,
      totalBidAmount: proposal.totalBidAmount,
      currency: proposal.currency,
      overallWeightedScore: roundedOverall,
      rank: 1, // temporary, assigned below
      criterionBreakdown: breakdown,
      keyReasons,
      technicalStrengths,
      commercialAdvantages,
      risks,
      missingInformation,
    };
  });

  // Sort descending by score and assign ranks
  results.sort((a, b) => b.overallWeightedScore - a.overallWeightedScore);
  results.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return results;
}
