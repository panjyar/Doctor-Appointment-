import { generateVisitSummary } from '../services/ai.service.js';

export async function createSummary(req, res, next) {
  try {
    const reasonForVisit = String(req.body.reason_for_visit ?? '').trim();

    if (reasonForVisit.length < 5 || reasonForVisit.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Reason for visit must be between 5 and 500 characters.',
      });
    }

    const summary = await generateVisitSummary(reasonForVisit);
    return res.json({
      success: true,
      message: 'AI summary generated.',
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
}
