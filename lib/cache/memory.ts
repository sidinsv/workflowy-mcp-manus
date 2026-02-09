import type { WorkFlowyNode } from "../client/types";

export interface CacheEntry {
  nodes: Map<string, WorkFlowyNode>;
  lastSync: number;
  expiresAt: number;
}

export class NodeCache {
  private cache: CacheEntry | null = null;
  private ttl: number;

  constructor(ttlSeconds: number = 3600) {
    this.ttl = ttlSeconds * 1000; // Convert to milliseconds
  }

  /**
   * Update the cache with fresh data
   */
  set(nodes: WorkFlowyNode[]): void {
    const now = Date.now();
    const nodeMap = new Map<string, WorkFlowyNode>();
    
    for (const node of nodes) {
      nodeMap.set(node.id, node);
    }

    this.cache = {
      nodes: nodeMap,
      lastSync: now,
      expiresAt: now + this.ttl,
    };
  }

  /**
   * Get a node from cache by ID
   */
  get(nodeId: string): WorkFlowyNode | undefined {
    if (!this.isValid()) {
      return undefined;
    }
    return this.cache!.nodes.get(nodeId);
  }

  /**
   * Get all nodes from cache
   */
  getAll(): WorkFlowyNode[] | null {
    if (!this.isValid()) {
      return null;
    }
    return Array.from(this.cache!.nodes.values());
  }

  /**
   * Search nodes by text query
   */
  search(
    query: string,
    options: {
      caseSensitive?: boolean;
      regex?: boolean;
      parentId?: string;
    } = {}
  ): WorkFlowyNode[] {
    const nodes = this.getAll();
    if (!nodes) {
      return [];
    }

    const { caseSensitive = false, regex = false, parentId } = options;
    
    let matcher: (text: string) => boolean;
    
    if (regex) {
      try {
        const pattern = new RegExp(query, caseSensitive ? "" : "i");
        matcher = (text: string) => pattern.test(text);
      } catch (error) {
        throw new Error(`Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      const searchQuery = caseSensitive ? query : query.toLowerCase();
      matcher = (text: string) => {
        const searchText = caseSensitive ? text : text.toLowerCase();
        return searchText.includes(searchQuery);
      };
    }

    let results = nodes.filter((node) => {
      const nameMatch = matcher(node.name);
      const noteMatch = node.note ? matcher(node.note) : false;
      return nameMatch || noteMatch;
    });

    // Filter by parent if specified
    if (parentId) {
      results = results.filter((node) => node.parent_id === parentId);
    }

    return results;
  }

  /**
   * Update a node in the cache (optimistic update)
   */
  updateNode(nodeId: string, updates: Partial<WorkFlowyNode>): void {
    if (!this.isValid()) {
      return;
    }

    const node = this.cache!.nodes.get(nodeId);
    if (node) {
      const updatedNode = { ...node, ...updates };
      this.cache!.nodes.set(nodeId, updatedNode);
    }
  }

  /**
   * Add a node to the cache (optimistic update)
   */
  addNode(node: WorkFlowyNode): void {
    if (!this.isValid()) {
      return;
    }

    this.cache!.nodes.set(node.id, node);
  }

  /**
   * Remove a node from the cache (optimistic update)
   */
  deleteNode(nodeId: string): void {
    if (!this.isValid()) {
      return;
    }

    this.cache!.nodes.delete(nodeId);
  }

  /**
   * Check if cache is valid (not expired)
   */
  isValid(): boolean {
    if (!this.cache) {
      return false;
    }

    const now = Date.now();
    return now < this.cache.expiresAt;
  }

  /**
   * Get cache status
   */
  getStatus(): {
    cached: boolean;
    nodeCount: number;
    lastSync: number | null;
    expiresAt: number | null;
  } {
    if (!this.cache) {
      return {
        cached: false,
        nodeCount: 0,
        lastSync: null,
        expiresAt: null,
      };
    }

    return {
      cached: this.isValid(),
      nodeCount: this.cache.nodes.size,
      lastSync: this.cache.lastSync,
      expiresAt: this.cache.expiresAt,
    };
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache = null;
  }
}
