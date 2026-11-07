import { useEffect, useRef, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { PERMISSION_STATUS_BG, PERMISSION_STATUS_LABELS } from '@/configs/ui.config';
import type { AskUserQuestion, AskUserQuestionSelection } from '@/dtos/ask-user-question.dto';
import type { PermissionItem } from '@/dtos/permission-item.dto';
import { AskUserQuestionUtil } from '@/utils/ask-user-question.util';

const MAX_OTHER_ANSWER_LENGTH = 5000;

const EMPTY_SELECTION: AskUserQuestionSelection = { selected: [], otherOn: false, otherText: '' };

type AskUserQuestionCardProps = {
  item: PermissionItem;
  questions: AskUserQuestion[];
  onSubmit: (answers: Record<string, string>) => void;
  onSkip: () => void;
};

export function AskUserQuestionCard({
  item,
  questions,
  onSubmit,
  onSkip,
}: AskUserQuestionCardProps) {
  const [selections, setSelections] = useState<AskUserQuestionSelection[]>([]);
  const [step, setStep] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const otherInputRef = useRef<HTMLInputElement>(null);
  const isSending = item.status === 'sending';
  const isLast = step === questions.length - 1;
  const hasSteps = questions.length > 1;
  const question = questions[step];
  const currentOtherOn = selections[step]?.otherOn ?? false;

  useEffect(() => {
    if (currentOtherOn) otherInputRef.current?.focus();
  }, [currentOtherOn, step]);

  function selectionAt(index: number): AskUserQuestionSelection {
    return selections[index] ?? EMPTY_SELECTION;
  }

  function update(index: number, next: AskUserQuestionSelection): void {
    setSelections((previous) => {
      const copy = [...previous];
      for (let i = 0; i < questions.length; i++) copy[i] ??= EMPTY_SELECTION;
      copy[index] = next;
      return copy;
    });
  }

  function goTo(index: number): void {
    setStep(index);
    setMaxVisited((previous) => Math.max(previous, index));
  }

  const answers: Record<string, string> = {};
  let complete = true;
  questions.forEach((entry, index) => {
    const answer = AskUserQuestionUtil.buildAnswer(entry, selectionAt(index));
    if (answer === null) complete = false;
    else answers[entry.question] = answer;
  });

  function renderStepper(current: AskUserQuestion) {
    const baseId = `ask-${item.id}-${step}`;
    const selection = selectionAt(step);
    const type = current.multiSelect ? 'checkbox' : 'radio';
    const answered = AskUserQuestionUtil.isAnswered(current, selection);
    return (
      <>
        {hasSteps && (
          <div className="d-flex flex-wrap gap-1 mb-2" role="group" aria-label="Question steps">
            {questions.map((entry, index) => {
              const isCurrent = index === step;
              const done = AskUserQuestionUtil.isAnswered(entry, selectionAt(index));
              return (
                <Button
                  key={`${item.id}-chip-${index}`}
                  size="sm"
                  variant={isCurrent ? 'primary' : done ? 'outline-success' : 'outline-secondary'}
                  aria-current={isCurrent ? 'step' : undefined}
                  disabled={isSending || index > maxVisited}
                  onClick={() => goTo(index)}
                >
                  {index + 1}. {entry.header}
                  {done ? ' ✓' : ''}
                </Button>
              );
            })}
          </div>
        )}
        <div className="mb-3" role="group" aria-labelledby={`${baseId}-label`}>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            {!hasSteps && <Badge bg="secondary">{current.header}</Badge>}
            <span id={`${baseId}-label`} className="fw-semibold">
              {current.question}
            </span>
          </div>
          {current.options.map((option, oIndex) => {
            const id = `${baseId}-opt-${oIndex}`;
            const checked = selection.selected.includes(option.label);
            return (
              <div key={id} className="mb-1">
                <Form.Check
                  type={type}
                  id={id}
                  name={baseId}
                  label={option.label}
                  checked={checked}
                  disabled={isSending}
                  onChange={() => {
                    if (current.multiSelect) {
                      update(step, {
                        ...selection,
                        selected: checked
                          ? selection.selected.filter((label) => label !== option.label)
                          : [...selection.selected, option.label],
                      });
                    } else {
                      update(step, {
                        selected: [option.label],
                        otherOn: false,
                        otherText: selection.otherText,
                      });
                    }
                  }}
                />
                {option.description && (
                  <div className="small text-body-secondary ms-4">{option.description}</div>
                )}
                {option.preview && <pre className="small ms-4 mb-1">{option.preview}</pre>}
              </div>
            );
          })}
          <Form.Check
            type={type}
            id={`${baseId}-other`}
            name={baseId}
            label="Other"
            checked={selection.otherOn}
            disabled={isSending}
            onChange={() => {
              if (current.multiSelect) {
                update(step, { ...selection, otherOn: !selection.otherOn });
              } else {
                update(step, { ...selection, selected: [], otherOn: true });
              }
            }}
          />
          {selection.otherOn && (
            <Form.Control
              ref={otherInputRef}
              className="mt-1"
              size="sm"
              type="text"
              maxLength={MAX_OTHER_ANSWER_LENGTH}
              aria-label={`Other answer for: ${current.question}`}
              value={selection.otherText}
              disabled={isSending}
              onChange={(event) => update(step, { ...selection, otherText: event.target.value })}
            />
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button variant="outline-secondary" size="sm" disabled={isSending} onClick={onSkip}>
            Skip
          </Button>
          <div className="ms-auto d-flex gap-2">
            {hasSteps && step > 0 && (
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={isSending}
                onClick={() => goTo(step - 1)}
              >
                Back
              </Button>
            )}
            {isLast ? (
              <Button
                variant="success"
                size="sm"
                disabled={!complete || isSending}
                onClick={() => onSubmit(answers)}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                disabled={!answered || isSending}
                onClick={() => goTo(step + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </>
    );
  }

  function renderReadOnly(status: 'allow' | 'deny' | 'cancelled') {
    return (
      <>
        {status === 'allow' &&
          questions.map((entry, index) => {
            const answer = item.answers?.[entry.question];
            return (
              <div key={`${item.id}-ro-${index}`} className="mb-3">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <Badge bg="secondary">{entry.header}</Badge>
                  <span className="fw-semibold">{entry.question}</span>
                </div>
                {answer !== undefined && <div className="small">{answer}</div>}
              </div>
            );
          })}
        <Badge bg={PERMISSION_STATUS_BG[status]}>
          {status === 'deny' ? 'Skipped' : PERMISSION_STATUS_LABELS[status]}
        </Badge>
      </>
    );
  }

  return (
    <Card
      className={`permission-card permission-card--${item.status} mb-2`}
      role="group"
      aria-label="Claude has questions for you"
    >
      <Card.Header className="d-flex flex-wrap align-items-center gap-2">
        <strong>Claude has questions for you</strong>
        {item.fromSubagent && <Badge bg="info">from sub-agent</Badge>}
      </Card.Header>
      <Card.Body className="p-2">
        {item.status === 'pending' || item.status === 'sending'
          ? question && renderStepper(question)
          : renderReadOnly(item.status)}
      </Card.Body>
    </Card>
  );
}
