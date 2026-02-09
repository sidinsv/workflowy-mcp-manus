/**
 * WorkFlowy API types based on official API documentation
 */

export interface WorkFlowyNode {
  id: string;
  name: string;
  note: string | null;
  priority: number;
  data: {
    layoutMode: string;
  };
  createdAt: number;
  modifiedAt: number;
  completedAt: number | null;
  parent_id?: string; // Only in export responses
  children?: WorkFlowyNode[]; // Only in tree responses
}

export interface WorkFlowyTarget {
  key: string;
  type: "shortcut" | "system";
  name: string | null;
}

export interface CreateNodeRequest {
  parent_id: string;
  name: string;
  note?: string;
  layoutMode?: string;
  position?: "top" | "bottom";
}

export interface UpdateNodeRequest {
  name?: string;
  note?: string;
  layoutMode?: string;
}

export interface MoveNodeRequest {
  parent_id: string;
  position?: "top" | "bottom";
}

export interface WorkFlowyAPIResponse<T> {
  data?: T;
  error?: string;
  status?: string;
}

export interface ListNodesResponse {
  nodes: WorkFlowyNode[];
}

export interface GetNodeResponse {
  node: WorkFlowyNode;
}

export interface CreateNodeResponse {
  item_id: string;
}

export interface ExportNodesResponse {
  nodes: WorkFlowyNode[];
}

export interface ListTargetsResponse {
  targets: WorkFlowyTarget[];
}

export interface Bookmark {
  id: string;
  node_id: string;
  name: string;
  created_at: number;
}
