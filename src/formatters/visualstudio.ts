/**
 * @fileoverview Visual Studio compatible formatter
 * @author Ronald Pijnacker Original -- Reworked for compassionate output by Jacques Favreau
 */

import { ResultsType, MessageType } from './formatter-types';

import { RuleCollection } from '../guides/guide-types';
//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Returns the severity of warning or error
 * @param {Object} message message object to examine
 * @returns {string} severity level
 * @private
 */
function getMessageType(message: MessageType) {
    if (message.fatal || message.severity === 2) {
        return 'error';
    }
    return 'warning';
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

export = (results: Array<ResultsType>, guide: RuleCollection) => {
    let output = '';
    let total = 0;

    results.forEach(({ messages, filePath }) => {
        total += messages.length;

        output += messages
            .map(message => {
                const { ruleId } = message;
                const context = (!!ruleId && guide[ruleId]) || {};
                return [
                    filePath,
                    `(${message.line || 0}`,
                    message.column ? `,${message.column}` : '',
                    `): ${getMessageType(message)}`,
                    ruleId ? ` ${ruleId}` : '',
                    ` : ${context.message || message.message || ''}`,
                    context.context
                        ? `  Additional context: ${context.context.join(', ')}`
                        : '',
                    '\n'
                ].join('');
            })
            .join('');
    });

    if (total === 0) {
        output += 'no problems';
    } else {
        output += `\n${total} problem${total !== 1 ? 's' : ''}`;
    }

    return output;
};
