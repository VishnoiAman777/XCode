import { ExtensionContext, commands, ProgressLocation, workspace, window, Range, Position, Selection, TextEditorEdit } from 'vscode';
import { formatCodeForInsertion } from './utils/code';
import logger from './logger';
import axios from 'axios'; // Import Axios for making HTTP requests

let originalText = ''; // Variable to store the original text before any streaming updates
let isStreaming = false; // Flag to track if streaming is active

// Add a configuration variable for the endpoint URL
const config = workspace.getConfiguration('xcode');
const endpointURL = config.get<string>('endpointURL') || 'http://localhost:8000/api/generate_stream';

export async function activate(context: ExtensionContext) {
    const disposable = commands.registerCommand('xcode.suggest', async () => {
        window.withProgress(
            {
                location: ProgressLocation.Notification,
                title: 'xcode is loading suggestion...',
                cancellable: false,
            },
            (progress, token) => makeSuggestion()
        );
    });

    context.subscriptions.push(disposable);
}

async function makeSuggestion() {
    const editor = window.activeTextEditor;
    if (!editor) {
        window.showErrorMessage('No active editor found!');
        return;
    }

    const document = editor.document;
    let selection = editor.selection;
    const cursorPosition = selection.active;
    const textBeforeCursor = document.getText(
        new Range(new Position(0, 0), cursorPosition)
    );
    const textAfterCursor = document.getText(
        new Range(cursorPosition, new Position(document.lineCount, 0))
    );
    // logger.info(`Text before cursor: ${textBeforeCursor}`);
    // logger.info(`Text after cursor: ${textAfterCursor}`); 
    let finalText = "";
    if (textAfterCursor === ''){
        finalText = `${textBeforeCursor}${textAfterCursor}`;
    }
    else{
        finalText = `<fim_prefix>${textBeforeCursor}<fim_suffix> ${textAfterCursor}<fim_middle>`;
    }
    logger.info(`The final text we have is ${finalText}`);

    const requestData = {
        inputs: finalText,
        parameters: {
            temperature: 0.1,
            top_k: 10,
            top_p: 5,
            max_new_tokens: 250,
            min_new_tokens: 0,
            timeout: 60,
            repetition_penalty: 1
        }
    };

    try {
        const response = await axios.post(endpointURL, requestData, {
            responseType: 'stream' // Set response type to stream
        });

        logger.info(`request: ${requestData.inputs}`);

        isStreaming = true; // Set streaming flag to true
        originalText = document.getText(); // Store the original text

        // Handle streaming response
        response.data.on('data', (chunk:Buffer) => {
            const responseData = chunk.toString(); // Convert chunk to string
            logger.info(`response: ${responseData}`);
            editor.edit(async (editBuilder) => {
                const currentPosition = editor.selection.active;
                const newPosition = new Position(currentPosition.line, currentPosition.character + responseData.length);
                selection = new Selection(newPosition, newPosition);
                editBuilder.replace(selection, formatCodeForInsertion(responseData, textBeforeCursor));
            });
        });

        response.data.on('end', () => {
            logger.info('Streaming ended');
        });

        response.data.on('error', (error: Error) => {
            logger.error(`Error occurred while streaming response: ${error}`);
        });
    } catch (error) {
        window.showErrorMessage('Error occurred while fetching suggestion.');
        logger.error(`Error occurred while fetching suggestion: ${error}`);
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
