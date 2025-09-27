import {
  DecoratorNode,
  type EditorConfig,
  type LexicalEditor,
  type SerializedLexicalNode,
} from "lexical";
import type * as React from "react";

export class VariableNode extends DecoratorNode<React.ReactElement> {
  __variable: string;

  static getType() {
    return "variable";
  }

  static clone(node: VariableNode) {
    return new VariableNode(node.__variable, node.__key);
  }

  constructor(variable: string = "", key?: string) {
    super(key);
    this.__variable = variable;
  }

  createDOM() {
    const dom = document.createElement("span");
    dom.className =
      "inline-block px-2 py-1 rounded-full mx-1 text-xs font-bold border variable-node";
    dom.style.userSelect = "none";
    dom.setAttribute("data-variable", this.__variable);
    dom.setAttribute("contenteditable", "false");
    dom.setAttribute("draggable", "false");
    return dom;
  }

  updateDOM() {
    return false;
  }

  isIsolated(): boolean {
    return false;
  }

  canBeEmpty(): boolean {
    return false;
  }

  isKeyboardSelectable(): boolean {
    return true;
  }

  isAtomic(): boolean {
    return true;
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): React.ReactElement {
    const COLORS: Record<string, string> = {
      nome: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-100 dark:border-blue-400/30",
      cognome:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-100 dark:border-emerald-400/30",
      data: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-100 dark:border-amber-400/30",
      orario:
        "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/15 dark:text-fuchsia-100 dark:border-fuchsia-400/30",
    };

    const VariableComponent = () => {
      const label =
        this.__variable.charAt(0).toUpperCase() + this.__variable.slice(1);
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full mx-1 text-[11px] font-semibold border ${COLORS[this.__variable] || "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-500/15 dark:text-zinc-100 dark:border-zinc-400/30"} whitespace-nowrap`}
          data-variable={this.__variable}
          draggable={false}
          style={{ userSelect: "none" }}
          title={`Variabile: ${label}`}
        >
          <span>{label}</span>
        </span>
      );
    };

    return <VariableComponent />;
  }

  exportJSON() {
    return {
      type: "variable",
      variable: this.__variable,
      version: 1,
    };
  }

  static importJSON(_serializedNode: SerializedLexicalNode): VariableNode {
    // Verifica che la proprietà 'variable' esista
    if (typeof (_serializedNode as any).variable === "string") {
      return new VariableNode((_serializedNode as any).variable);
    }
    throw new Error(
      "SerializedLexicalNode non contiene la proprietà 'variable'.",
    );
  }

  isInline(): boolean {
    return true;
  }

  isSimpleText(): boolean {
    return false;
  }

  getVariable(): string {
    return this.__variable;
  }
}

export function $createVariableNode(variable: string): VariableNode {
  return new VariableNode(variable);
}
