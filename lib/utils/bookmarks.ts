import type { Bookmark } from "../client/types";

/**
 * Simple in-memory bookmark storage
 * In a production environment, this could be replaced with a database
 */
export class BookmarkStore {
  private bookmarks: Map<string, Bookmark> = new Map();

  /**
   * Save a bookmark
   */
  save(nodeId: string, name: string): Bookmark {
    const id = this.generateId();
    const bookmark: Bookmark = {
      id,
      node_id: nodeId,
      name,
      created_at: Date.now(),
    };

    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  /**
   * List all bookmarks
   */
  list(): Bookmark[] {
    return Array.from(this.bookmarks.values()).sort(
      (a, b) => b.created_at - a.created_at
    );
  }

  /**
   * Get a bookmark by ID
   */
  get(id: string): Bookmark | undefined {
    return this.bookmarks.get(id);
  }

  /**
   * Get a bookmark by name
   */
  getByName(name: string): Bookmark | undefined {
    return Array.from(this.bookmarks.values()).find(
      (b) => b.name.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Delete a bookmark
   */
  delete(id: string): boolean {
    return this.bookmarks.delete(id);
  }

  /**
   * Delete a bookmark by name
   */
  deleteByName(name: string): boolean {
    const bookmark = this.getByName(name);
    if (bookmark) {
      return this.bookmarks.delete(bookmark.id);
    }
    return false;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `bm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
