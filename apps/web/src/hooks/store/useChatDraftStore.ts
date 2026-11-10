import { create } from 'zustand';
import type { AttachmentDraft } from '@/dtos/attachment-draft.dto';
import type { QuestionProgress } from '@/dtos/question-progress.dto';

export type RoomDraft = {
  text: string;
  attachments: AttachmentDraft[];
  sending: boolean;
  questions: Record<string, QuestionProgress>;
};

export type ChatDraftState = {
  byRoom: Record<string, RoomDraft>;
  setText: (roomId: string, text: string) => void;
  addAttachments: (roomId: string, drafts: AttachmentDraft[]) => void;
  patchAttachment: (roomId: string, id: string, change: Partial<AttachmentDraft>) => void;
  removeAttachment: (roomId: string, id: string) => void;
  setSending: (roomId: string, sending: boolean) => void;
  setQuestionProgress: (roomId: string, requestId: string, progress: QuestionProgress) => void;
  removeQuestionProgress: (roomId: string, requestId: string) => void;
  clearDraft: (roomId: string) => void;
  keepRooms: (roomIds: string[]) => void;
};

export const NO_ATTACHMENTS: AttachmentDraft[] = [];
export const NO_QUESTIONS: Record<string, QuestionProgress> = {};

const EMPTY_DRAFT: RoomDraft = {
  text: '',
  attachments: NO_ATTACHMENTS,
  sending: false,
  questions: NO_QUESTIONS,
};

function changeRoom(
  byRoom: Record<string, RoomDraft>,
  roomId: string,
  change: (draft: RoomDraft) => RoomDraft,
): Record<string, RoomDraft> {
  return { ...byRoom, [roomId]: change(byRoom[roomId] ?? EMPTY_DRAFT) };
}

export const useChatDraftStore = create<ChatDraftState>((set) => ({
  byRoom: {},
  setText: (roomId, text) =>
    set((state) => ({ byRoom: changeRoom(state.byRoom, roomId, (draft) => ({ ...draft, text })) })),
  addAttachments: (roomId, drafts) =>
    set((state) => ({
      byRoom: changeRoom(state.byRoom, roomId, (draft) => ({
        ...draft,
        attachments: [...draft.attachments, ...drafts],
      })),
    })),
  patchAttachment: (roomId, id, change) =>
    set((state) =>
      state.byRoom[roomId] === undefined
        ? state
        : {
            byRoom: changeRoom(state.byRoom, roomId, (draft) => ({
              ...draft,
              attachments: draft.attachments.map((item) =>
                item.id === id ? { ...item, ...change } : item,
              ),
            })),
          },
    ),
  removeAttachment: (roomId, id) =>
    set((state) =>
      state.byRoom[roomId] === undefined
        ? state
        : {
            byRoom: changeRoom(state.byRoom, roomId, (draft) => ({
              ...draft,
              attachments: draft.attachments.filter((item) => item.id !== id),
            })),
          },
    ),
  setSending: (roomId, sending) =>
    set((state) => ({
      byRoom: changeRoom(state.byRoom, roomId, (draft) => ({ ...draft, sending })),
    })),
  setQuestionProgress: (roomId, requestId, progress) =>
    set((state) => ({
      byRoom: changeRoom(state.byRoom, roomId, (draft) => ({
        ...draft,
        questions: { ...draft.questions, [requestId]: progress },
      })),
    })),
  removeQuestionProgress: (roomId, requestId) =>
    set((state) => {
      const draft = state.byRoom[roomId];
      if (draft === undefined || !(requestId in draft.questions)) return state;
      const rest = Object.fromEntries(
        Object.entries(draft.questions).filter(([id]) => id !== requestId),
      );
      return { byRoom: { ...state.byRoom, [roomId]: { ...draft, questions: rest } } };
    }),
  clearDraft: (roomId) =>
    set((state) => ({
      byRoom: changeRoom(state.byRoom, roomId, (draft) => ({
        ...draft,
        text: '',
        attachments: NO_ATTACHMENTS,
        sending: false,
      })),
    })),
  keepRooms: (roomIds) =>
    set((state) => {
      const kept = Object.entries(state.byRoom).filter(([id]) => roomIds.includes(id));
      if (kept.length === Object.keys(state.byRoom).length) return state;
      return { byRoom: Object.fromEntries(kept) };
    }),
}));
