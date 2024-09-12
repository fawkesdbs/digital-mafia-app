import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;

  @Input() message: string | null = null;
  @Input() messageType: 'error' | 'success' | 'info' | null = null;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  isFocused: boolean = false;

  private innerValue: string = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get value(): string {
    return this.innerValue;
  }

  @Input('value')
  set value(val: string) {
    this.innerValue = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onValueChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.value = inputElement.value;
    }
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  writeValue(value: string): void {
    this.innerValue = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
