'use strict';

import { APP_BASE_HREF } from "@angular/common";
import { analyzeFile } from "@angular/compiler";
import { SourceMapGenerator } from "@angular/compiler/src/output/source_map";
import { FormControl, FormGroup } from "@angular/forms";

// export const API_URL = 'http://localhost:3000';
export const API_URL = 'https://www.coderedpizza.com/backend/api/v1/';
//export const API_URL = 'https://dev8.ivantechnology.in/code_red_pizza/backend/api/v1/';

export const APP_NAME = 'Code Red Pizza';
export const TABLE_LENGTH = 10;

export function getServerErrorMessage(err: any) {
    if (err.status == 401) {
        return err?.error?.message ?? "Unauthorized Action";
    } else if (err.status == 404) {
        return err?.message ?? "Not found exception occured";
    } else {
        return "Internal server error occured. Please try again later";
    }
}

export function getValidationMessage(result: any[]) {
    for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
            const element = result[key];
            if (element.message) {
                return element.message;
            }
        }
    }

    return "Validation Error: Please check all the fields correctly";
}

export function scrollToQuery(query: any) {
    let $_errFormControl = document.querySelectorAll(query);
    if ($_errFormControl.length > 0) {
        const firstErr: Element = $_errFormControl[0];
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

export function resetPaginationOption() {
    return {
        hasNextPage: false,
        hasPrevPage: false,
        limit: TABLE_LENGTH,
        nextPage: null,
        page: 1,
        pagingCounter: 1,
        prevPage: null,
        totalDocs: 0,
        totalPages: 1,
    }
}

export function resetTableFilterOptions() {
    return {
        searchkey: "",
    }
}

export function getPageNumber({
    index = <number>1,
    pageno = <number>1,
    tablelength = <number>TABLE_LENGTH
} = {}) {
    return (tablelength * (pageno - 1)) + (index + 1)   
}

/**
 * ----------------------------------------
 * Form Control Global Functions
 * @param formGroup - Instance of FormGroup
 * ----------------------------------------
 * ----------------------------------------
 */

export function resetForm(formGroup: FormGroup) {
    formGroup.reset();
    for (const key in formGroup.controls) {
        if (Object.prototype.hasOwnProperty.call(formGroup.controls, key)) {
            const element = formGroup.controls[key];

            element.markAsUntouched();
            element.markAsPristine();
        }
    }
}

export function isFormValidationAvailable(formGroup: FormGroup, control: any, rules: any) {
    const formControl: any = formGroup.get(control);
    if (formControl) {
        const validator = formControl.validator && formControl.validator(new FormControl());
        if (validator && validator[rules]) {
            return true;
        }
    }

    return false;
}

export function isInputValid(formGroup: FormGroup, control: any) {
    let valid: boolean = true
    if (!["VALID", "DISABLED"].includes(formGroup.controls[control].status) && (formGroup.controls[control].touched || formGroup.controls[control].dirty)) {
        valid = false
    }

    return valid;
}

export function isInputRuleValid(formGroup: FormGroup, control: any, rule: any) {
    let valid: boolean = true

    if (rule instanceof Array) {
        rule.forEach(r => {
            if (formGroup.controls[control].hasError(r) && (formGroup.controls[control].touched || formGroup.controls[control].dirty)) {
                valid = false
            }
        });
    } else {
        if (formGroup.controls[control].hasError(rule) && (formGroup.controls[control].touched || formGroup.controls[control].dirty)) {
            valid = false
        }
    }

    return valid;
}

export function isInputRuleAvailable(formGroup: FormGroup, control: any, rule: any) {
    const formControl: any = formGroup.get(control);
    if (formControl) {
        const validator = formControl.validator && formControl.validator(new FormControl());
        if (validator && validator[rule]) {
            return true;
        }
    }

    return false;
}

export function onFileUploaded(formGroup: FormGroup, event: any, sourceKey: any, type: any = "single") {
    if (event.target.files.length > 0) {
        const file = event.target.files[0];
        formGroup.patchValue({
            [sourceKey]: file
        });
    } else {
        formGroup.patchValue({
            [sourceKey]: null
        });
    }
}


/**
 * ----------------------------------------
 * JS Functions for Accessing JS Functions
 * ----------------------------------------
 * ----------------------------------------
 */
export function checkIsArray(value: any) { // Array.isArray()
    if (Array.isArray(value)) {
        return true;
    } else {
        return false;
    }
}