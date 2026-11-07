import type { AskUserQuestion, AskUserQuestionSelection } from '@/dtos/ask-user-question.dto';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AskUserQuestionUtil {
  static buildAnswer(
    question: AskUserQuestion,
    selection: AskUserQuestionSelection,
  ): string | null {
    const other = selection.otherText.trim();
    const labels = question.options
      .map((option) => option.label)
      .filter((label) => selection.selected.includes(label));
    if (selection.otherOn) {
      if (other === '') return null;
      if (question.multiSelect) labels.push(other);
      else return other;
    }
    if (labels.length === 0) return null;
    return question.multiSelect ? labels.join(', ') : (labels[0] ?? null);
  }

  static isAnswered(question: AskUserQuestion, selection: AskUserQuestionSelection): boolean {
    return AskUserQuestionUtil.buildAnswer(question, selection) !== null;
  }
}
