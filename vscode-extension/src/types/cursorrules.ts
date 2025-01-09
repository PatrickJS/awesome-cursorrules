export interface CursorRules {
    version: string;
    languages: {
        [key: string]: LanguageConfig;
    };
}

export interface LanguageConfig {
    rules: Rule[];
}

export interface Rule {
    id: string;
    level: RuleLevel;
    description: string;
    pattern?: string;
    fix?: RuleFix;
    disabled?: boolean;
}

export type RuleLevel = 'error' | 'warning' | 'info' | 'hint';

export interface RuleFix {
    replace: string;
    message?: string;
}

// Utility type for rule validation
export interface RuleValidation {
    isValid: boolean;
    errors?: string[];
} 