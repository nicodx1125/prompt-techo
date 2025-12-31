/**
 * Extracts variable names from a template string.
 * Variables are defined as {{variableName}}.
 * Returns an array of unique variable names.
 *
 * @param text The template string
 * @returns Array of unique variable names
 */
export function extractVariables(text: string): string[] {
    const regex = /{{\s*([^}]+)\s*}}/g;
    const matches = text.matchAll(regex);
    const variables = new Set<string>();

    for (const match of matches) {
        if (match[1]) {
            variables.add(match[1].trim());
        }
    }

    return Array.from(variables);
}

/**
 * Replaces variables in a template string with provided values.
 *
 * @param template The template string
 * @param values Record of variable names and their values
 * @returns The resulting string with variables replaced
 */
export function replaceVariables(template: string, values: Record<string, string>): string {
    return template.replace(/{{\s*([^}]+)\s*}}/g, (match, variableName) => {
        const key = variableName.trim();
        return values[key] || match; // Return original match if no value provided (or empty string? keeping match is better for visibility)
    });
}
