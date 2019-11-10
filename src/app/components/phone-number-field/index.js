import IMask from 'imask'
import FormField from '../form-field';
import {
    REGEX,
    PHONE_NUMBER_WHITESPACE_MASK,
    MAX_NUMBER_LENGTH
} from './constants';

export default class PhoneNumberField extends FormField {

    constructor() {
        super();

        // this._prefix = undefined;
        // this._oldValue = undefined;
        // this._oldCursorPos = undefined;

        // this._onKeydown = this._onKeydown.bind(this);
        // this._onInput = this._onInput.bind(this);
        // this._mask = this._mask.bind(this);
        // this._unmask = this._unmask.bind(this);

        // this.inputNode.addEventListener('keydown', this._onKeydown);
        // this.inputNode.addEventListener('input', this._onInput);
    }

    set prefix(prefix) {
        this._phoneMask = IMask(this.inputNode, {mask: `${prefix} 00 00 00 000`});
    }

    // _onKeydown(event) {
    //     this._oldValue = event.target.value;
    //     // this._oldCursorPos = event.target.selectionEnd;
    // }

    // _onInput(event) {
    //     let newValue = this._unmask(event.target.value);
    //     // let newCursorPos;

    //     if (newValue.match(REGEX)) {
    //         newValue = this._mask(newValue);

    //         // newCursorPos = 
    //         //     this._oldCursorPos
    //         //     - this._checkSeparator(this._oldCursorPos, 4)
    //         //     + this._checkSeparator(this._oldCursorPos + (newValue.length - this._oldValue.length), 4)
    //         //     + (this._unmask(newValue).length - this._unmask(this._oldValue).length);

    //         if (newValue !== '') {
    //             event.target.value = newValue;
    //         } else {
    //             event.target.value = '';
    //         }
    //     } else {
    //         event.target.value = this._oldValue;
    //         // newCursorPos = this._oldCursorPos;
    //     }

    //     // event.target.setSelectionRange(newCursorPos, newCursorPos);
    // }

    // _mask(value) {
    //     const output = ['+'];
    //     for(let i = 0; i < Math.min(value.length, MAX_NUMBER_LENGTH); i++) {

    //         if(i == this._prefix.length - 1) {
    //             output.push(" "); // add the separator
    //         } else if (i >= this._prefix.length && ((   i - this._prefix.length) % 2 !== 0) && i !== 11) {
    //             output.push(" "); // add the separator
    //         }

    //         output.push(value[i]);
    //     }
    //     return output.join("");
    // }

    // _unmask(value) {
    //     return value.replace(new RegExp(/[^\d]/, 'g'), ''); // Remove every non-digit character
    // }

    // _checkSeparator(position, interval) {
    //     return Math.floor(position / (interval + 1));
    // }
}