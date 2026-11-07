import { createInterface } from 'node:readline/promises';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PromptUtil {
  /** Asks a yes/no question. The answer is "no" unless the user types y or yes. */
  static confirm = async (question: string): Promise<boolean> => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    try {
      const answer = await rl.question(`${question} (y/N) `);
      return ['y', 'yes'].includes(answer.trim().toLowerCase());
    } finally {
      rl.close();
    }
  };
}
