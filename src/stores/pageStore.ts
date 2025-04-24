
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Page {
  id: string;
  title: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
}

interface PageStore {
  pages: Page[];
  addPage: () => Page;
  updatePage: (id: string, page: Partial<Page>) => void;
  deletePage: (id: string) => void;
  getPage: (id: string) => Page | undefined;
}

export const usePageStore = create<PageStore>()(
  persist(
    (set, get) => ({
      pages: [],
      addPage: () => {
        const newPage: Page = {
          id: crypto.randomUUID(),
          title: "Untitled",
          content: {
            "time": Date.now(),
            "blocks": [
              {
                "type": "paragraph",
                "data": {
                  "text": "Start writing here..."
                }
              }
            ],
            "version": "2.28.2"
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          pages: [...state.pages, newPage],
        }));

        return newPage;
      },
      getPage: (id: string) => {
        const state = get();
        return state.pages.find(page => page.id === id);
      },
      updatePage: (id, updatedPage) => {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === id
              ? { ...page, ...updatedPage, updatedAt: new Date() }
              : page
          ),
        }));
      },
      deletePage: (id) => {
        set((state) => ({
          pages: state.pages.filter((page) => page.id !== id),
        }));
      },
    }),
    {
      name: 'blockflow-storage',
    }
  )
);
