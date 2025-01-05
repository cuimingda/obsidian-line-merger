import {Editor, MarkdownView, Plugin, Notice} from "obsidian";

export default class LineMerger extends Plugin {

    private isMergeCommandAvailable (editor: Editor, view: MarkdownView): boolean {

        const selectedText = editor.getSelection();
        return selectedText.length > 0;

    }

    private removeNewlinesFromSelection (editor: Editor): void {

        const selectedText = editor.getSelection();
        const mergedText = selectedText.replace(
            /[\r\n]+/g,
            ""
        );
        editor.replaceSelection(mergedText);

    }

    private getFullLinesFromSelection (editor: Editor): string {

        const startLine = editor.getCursor("from").line;
        const endLine = editor.getCursor("to").line;
        let expandedSelection = "";

        for (let i = startLine; i <= endLine; i++) {

            expandedSelection += editor.getLine(i) + "\n";

        }

        return expandedSelection;

    }

    private mergeCallback = (checking: boolean, editor: Editor, view: MarkdownView): boolean => {

        const isMergeCommandAvailable = this.isMergeCommandAvailable(
            editor,
            view
        );

        if (checking) {

            return isMergeCommandAvailable;

        }

        if (isMergeCommandAvailable) {

            const expandedSelection = this.getFullLinesFromSelection(editor);

            if ((/^---|^#/m).test(expandedSelection)) {

                new Notice("Cannot merge lines in YAML front matter or headings.");
                return false;

            }

            this.removeNewlinesFromSelection(editor);
            return true;

        }

        throw new Error("Unexpected code path: merge command is not available and not in checking mode.");

    };

    private mergeCommand = {
        "id": "merge",
        "name": "Merge",
        "editorCheckCallback": this.mergeCallback
    };

    async onload () {

        this.addCommand(this.mergeCommand);

    }

    async onunload () {

    }

}

