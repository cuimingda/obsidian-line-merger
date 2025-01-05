import {Editor, MarkdownView, Plugin, Notice} from "obsidian";

export default class MyPlugin extends Plugin {

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

    private mergeCallback = (checking: boolean, editor: Editor, view: MarkdownView): boolean => {

        const isMergeCommandAvailable = this.isMergeCommandAvailable(
            editor,
            view
        );

        if (checking) {

            return isMergeCommandAvailable;

        }

        if (isMergeCommandAvailable) {

            const selectedText = editor.getSelection();
            if ((/^---|^#/m).test(selectedText)) {

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

    onunload () {

    }

}

