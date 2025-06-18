export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'date' | 'select';
    required: boolean;
    options?: {
        id: string;
        label: string;
        value: string;
    }[];
    validation?: {
        type: string;
        errorMessage: string;
    };
}

export interface InsuranceSection {
    id: string;
    title: string;
    description: string;
    options: {
        id: string;
        label: string;
        value: string;
    }[];
    dependsOn?: string;
}

export interface Step {
    id: string;
    title: string;
    description: string;
    options?: {
        id: string;
        label: string;
        value: string;
    }[];
    fields?: FormField[];
    sections?: InsuranceSection[];
}

export interface FormContent {
    steps: Step[];
}

export interface PersonalInfo {
    firstName: string;
    infix: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    personalId: string;
}

export interface InsuranceOptions {
    reason: string;
    baseInsurance: string;
    paymentTerm: string;
    ownRisk: string;
    additionalInsurance: string;
    dentalInsurance: string;
}
