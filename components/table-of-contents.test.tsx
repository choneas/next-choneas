import { describe, it, expect } from "vitest";
import type { TableOfContentsEntry } from "notion-utils";

// Import the functions we need to test
// Note: These are internal functions, so we'll need to export them or test through the component
// For now, we'll copy the implementations here for testing

interface HeadingNode {
    id: string;
    text: string;
    indentLevel: 0 | 1 | 2;
    parent: HeadingNode | null;
    children: HeadingNode[];
}

function buildHeadingTree(toc: TableOfContentsEntry[]): HeadingNode[] {
    const roots: HeadingNode[] = [];
    const stack: HeadingNode[] = [];

    for (const entry of toc) {
        const node: HeadingNode = {
            id: entry.id,
            text: entry.text,
            indentLevel: entry.indentLevel as 0 | 1 | 2,
            parent: null,
            children: []
        };

        while (stack.length > 0 && stack[stack.length - 1].indentLevel >= node.indentLevel) {
            stack.pop();
        }

        if (stack.length > 0) {
            node.parent = stack[stack.length - 1];
            stack[stack.length - 1].children.push(node);
        } else {
            roots.push(node);
        }

        stack.push(node);
    }

    return roots;
}

function getHeadingPath(node: HeadingNode): string[] {
    const path: string[] = [];
    let current: HeadingNode | null = node;

    while (current) {
        path.unshift(current.id);
        current = current.parent;
    }

    return path;
}

function findNodeById(roots: HeadingNode[], id: string): HeadingNode | null {
    for (const root of roots) {
        if (root.id === id) {
            return root;
        }

        const found = findNodeByIdRecursive(root.children, id);
        if (found) {
            return found;
        }
    }

    return null;
}

function findNodeByIdRecursive(nodes: HeadingNode[], id: string): HeadingNode | null {
    for (const node of nodes) {
        if (node.id === id) {
            return node;
        }

        const found = findNodeByIdRecursive(node.children, id);
        if (found) {
            return found;
        }
    }

    return null;
}

function uuidToId(uuid: string): string {
    return uuid.replace(/-/g, "");
}

describe("Table of Contents - Heading Tree", () => {
    describe("uuidToId", () => {
        it("should convert UUID format to DOM ID format", () => {
            const uuid = "29d9bcd3-09be-80c4-9425-e66fc12e424f";
            const domId = uuidToId(uuid);

            expect(domId).toBe("29d9bcd309be80c49425e66fc12e424f");
            expect(domId).not.toContain("-");
        });

        it("should handle UUID without hyphens", () => {
            const uuid = "29d9bcd309be80c49425e66fc12e424f";
            const domId = uuidToId(uuid);

            expect(domId).toBe("29d9bcd309be80c49425e66fc12e424f");
        });

        it("should handle empty string", () => {
            const uuid = "";
            const domId = uuidToId(uuid);

            expect(domId).toBe("");
        });
    });

    describe("buildHeadingTree", () => {
        it("should build a simple tree with one root", () => {
            const toc: TableOfContentsEntry[] = [
                { id: "h1", text: "Heading 1", indentLevel: 0, type: "header" },
                { id: "h2", text: "Heading 2", indentLevel: 1, type: "sub_header" },
                { id: "h3", text: "Heading 3", indentLevel: 2, type: "sub_sub_header" }
            ];

            const tree = buildHeadingTree(toc);

            expect(tree).toHaveLength(1);
            expect(tree[0].id).toBe("h1");
            expect(tree[0].children).toHaveLength(1);
            expect(tree[0].children[0].id).toBe("h2");
            expect(tree[0].children[0].children).toHaveLength(1);
            expect(tree[0].children[0].children[0].id).toBe("h3");
        });

        it("should build a tree with multiple roots", () => {
            const toc: TableOfContentsEntry[] = [
                { id: "h1", text: "Heading 1", indentLevel: 0, type: "header" },
                { id: "h2", text: "Heading 2", indentLevel: 0, type: "header" }
            ];

            const tree = buildHeadingTree(toc);

            expect(tree).toHaveLength(2);
            expect(tree[0].id).toBe("h1");
            expect(tree[1].id).toBe("h2");
        });

        it("should handle complex nested structure", () => {
            const toc: TableOfContentsEntry[] = [
                { id: "h1", text: "Heading 1", indentLevel: 0, type: "header" },
                { id: "h1-1", text: "Heading 1.1", indentLevel: 1, type: "sub_header" },
                { id: "h1-1-1", text: "Heading 1.1.1", indentLevel: 2, type: "sub_sub_header" },
                { id: "h1-2", text: "Heading 1.2", indentLevel: 1, type: "sub_header" },
                { id: "h2", text: "Heading 2", indentLevel: 0, type: "header" }
            ];

            const tree = buildHeadingTree(toc);

            expect(tree).toHaveLength(2);
            expect(tree[0].id).toBe("h1");
            expect(tree[0].children).toHaveLength(2);
            expect(tree[0].children[0].id).toBe("h1-1");
            expect(tree[0].children[0].children).toHaveLength(1);
            expect(tree[0].children[1].id).toBe("h1-2");
            expect(tree[1].id).toBe("h2");
        });

        it("should set parent references correctly", () => {
            const toc: TableOfContentsEntry[] = [
                { id: "h1", text: "Heading 1", indentLevel: 0, type: "header" },
                { id: "h2", text: "Heading 2", indentLevel: 1, type: "sub_header" }
            ];

            const tree = buildHeadingTree(toc);

            expect(tree[0].parent).toBeNull();
            expect(tree[0].children[0].parent).toBe(tree[0]);
        });
    });

    describe("getHeadingPath", () => {
        it("should return path for root node", () => {
            const toc: TableOfContentsEntry[] = [
                { id: "h1", text: "Heading 1", indentLevel: 0, type: "header" }
            ];

            const tree = buildHeadingTree(toc);
            const path = getHeadingPath(tree[0]);

            expect(path).toEqual(["h1"]);
        });

        it("should return path for nested node", () => {
            const toc: TableOfContentsEntry[] = [
                { id: "h1", text: "Heading 1", indentLevel: 0, type: "header" },
                { id: "h2", text: "Heading 2", indentLevel: 1, type: "sub_header" },
                { id: "h3", text: "Heading 3", indentLevel: 2, type: "sub_sub_header" }
            ];

            const tree = buildHeadingTree(toc);
            const deepestNode = tree[0].children[0].children[0];
            const path = getHeadingPath(deepestNode);

            expect(path).toEqual(["h1", "h2", "h3"]);
        });
    });

    describe("findNodeById", () => {
        it("should find root node", () => {
            const toc: TableOfContentsEntry[] = [
                { id: "h1", text: "Heading 1", indentLevel: 0, type: "header" },
                { id: "h2", text: "Heading 2", indentLevel: 1, type: "sub_header" }
            ];

            const tree = buildHeadingTree(toc);
            const node = findNodeById(tree, "h1");

            expect(node).not.toBeNull();
            expect(node?.id).toBe("h1");
        });

        it("should find nested node", () => {
            const toc: TableOfContentsEntry[] = [
                { id: "h1", text: "Heading 1", indentLevel: 0, type: "header" },
                { id: "h2", text: "Heading 2", indentLevel: 1, type: "sub_header" },
                { id: "h3", text: "Heading 3", indentLevel: 2, type: "sub_sub_header" }
            ];

            const tree = buildHeadingTree(toc);
            const node = findNodeById(tree, "h3");

            expect(node).not.toBeNull();
            expect(node?.id).toBe("h3");
        });

        it("should return null for non-existent node", () => {
            const toc: TableOfContentsEntry[] = [
                { id: "h1", text: "Heading 1", indentLevel: 0, type: "header" }
            ];

            const tree = buildHeadingTree(toc);
            const node = findNodeById(tree, "non-existent");

            expect(node).toBeNull();
        });
    });
});
