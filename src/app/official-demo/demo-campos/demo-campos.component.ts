import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { startWith } from 'rxjs';
import {
  CepFieldComponent,
  CpfCnpjFieldComponent,
  DateFieldComponent,
  DecimalFieldComponent,
  IntegerFieldComponent,
  PhoneFieldComponent,
  PasswordFieldComponent,
  TextareaFieldComponent,
  TextFieldComponent,
} from 'structra-ui';
import {
  CheckboxFieldComponent,
  SwitchFieldComponent,
} from 'structra-ui';
import {
  DropdownSearchFieldComponent,
  MultiselectFieldComponent,
  SelectFieldComponent,
  type DropdownSearchPageRequested,
  type SelectPageRequested,
} from 'structra-ui';
import { BaseButtonComponent, BaseButtonType } from 'structra-ui';
import {
  LayoutStackAlign,
  LayoutStackComponent,
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormRowGap,
} from 'structra-ui';
import { DemoFormField } from '../_enums/demo-form-field.enum';
import { DemoEstadosBindings } from '../_models/demo-estados-bindings.model';
import { atLeastOneInArray } from '../_utils/demo-form-validators';

/** Espelha valor para o campo somente leitura (cópia rasa de arrays). */
function mirrorToReadonlyControl<T>(value: T): T {
  if (Array.isArray(value)) {
    return [...value] as T;
  }
  return value;
}

const DEMO_EDITABLE_TO_READONLY_PAIRS = [
  [DemoFormField.Texto, DemoFormField.TextoRo],
  [DemoFormField.Senha, DemoFormField.SenhaRo],
  [DemoFormField.Observacao, DemoFormField.ObservacaoRo],
  [DemoFormField.Inteiro, DemoFormField.InteiroRo],
  [DemoFormField.DecimalBr, DemoFormField.DecimalBrRo],
  [DemoFormField.Data, DemoFormField.DataRo],
  [DemoFormField.Cep, DemoFormField.CepRo],
  [DemoFormField.Telefone, DemoFormField.TelefoneRo],
  [DemoFormField.TelefoneFixo, DemoFormField.TelefoneFixoRo],
  [DemoFormField.CpfCnpj, DemoFormField.CpfCnpjRo],
  [DemoFormField.Estado, DemoFormField.EstadoRo],
  [DemoFormField.EstadoBusca, DemoFormField.EstadoBuscaRo],
  [DemoFormField.EstadosMulti, DemoFormField.EstadosMultiRo],
  [DemoFormField.Aceite, DemoFormField.AceiteRo],
  [DemoFormField.Ativo, DemoFormField.AtivoRo],
] as const satisfies ReadonlyArray<readonly [DemoFormField, DemoFormField]>;

@Component({
  selector: 'app-demo-campos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    NgTemplateOutlet,
    TextFieldComponent,
    PasswordFieldComponent,
    TextareaFieldComponent,
    IntegerFieldComponent,
    DecimalFieldComponent,
    DateFieldComponent,
    CepFieldComponent,
    CpfCnpjFieldComponent,
    PhoneFieldComponent,
    CheckboxFieldComponent,
    SwitchFieldComponent,
    SelectFieldComponent,
    MultiselectFieldComponent,
    DropdownSearchFieldComponent,
    BaseButtonComponent,
    LayoutStackComponent,
    FormColComponent,
    FormGroupComponent,
    FormRowComponent,
  ],
  templateUrl: './demo-campos.component.html',
  styleUrl: './demo-campos.component.scss',
})
export class DemoCamposComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  @Input({ required: true }) estados!: DemoEstadosBindings;

  @Output() readonly estadosPage = new EventEmitter<SelectPageRequested>();
  @Output() readonly estadosBuscaPage = new EventEmitter<DropdownSearchPageRequested>();

  readonly DemoFormField = DemoFormField;
  readonly BaseButtonType = BaseButtonType;
  readonly LayoutStackAlign = LayoutStackAlign;
  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;

  readonly form = this.fb.group({
    [DemoFormField.Texto]: [null as string | null, Validators.required],
    [DemoFormField.TextoRo]: [null as string | null],
    [DemoFormField.Senha]: [null as string | null, Validators.required],
    [DemoFormField.SenhaRo]: [null as string | null],
    [DemoFormField.Observacao]: [null as string | null, Validators.required],
    [DemoFormField.ObservacaoRo]: [null as string | null],
    [DemoFormField.Inteiro]: [null as number | null, Validators.required],
    [DemoFormField.InteiroRo]: [null as number | null],
    [DemoFormField.DecimalBr]: [null as number | null, Validators.required],
    [DemoFormField.DecimalBrRo]: [null as number | null],
    [DemoFormField.Data]: [null as string | null, Validators.required],
    [DemoFormField.DataRo]: [null as string | null],
    [DemoFormField.Cep]: [null as string | null, Validators.required],
    [DemoFormField.CepRo]: [null as string | null],
    [DemoFormField.Telefone]: [null as string | null, Validators.required],
    [DemoFormField.TelefoneRo]: [null as string | null],
    [DemoFormField.TelefoneFixo]: [null as string | null, Validators.required],
    [DemoFormField.TelefoneFixoRo]: [null as string | null],
    [DemoFormField.CpfCnpj]: [null as string | null, Validators.required],
    [DemoFormField.CpfCnpjRo]: [null as string | null],
    [DemoFormField.Estado]: [null as string | null, Validators.required],
    [DemoFormField.EstadoRo]: [null as string | null],
    [DemoFormField.EstadoBusca]: [null as string | null, Validators.required],
    [DemoFormField.EstadoBuscaRo]: [null as string | null],
    [DemoFormField.EstadosMulti]: [[] as string[], atLeastOneInArray],
    [DemoFormField.EstadosMultiRo]: [[] as string[]],
    [DemoFormField.Aceite]: [false, Validators.requiredTrue],
    [DemoFormField.AceiteRo]: [false],
    [DemoFormField.Ativo]: [true],
    [DemoFormField.AtivoRo]: [true],
  });

  ngOnInit(): void {
    for (const [sourceKey, readonlyKey] of DEMO_EDITABLE_TO_READONLY_PAIRS) {
      const source = this.form.get(sourceKey);
      const target = this.form.get(readonlyKey);
      if (!source || !target) {
        continue;
      }
      source.valueChanges
        .pipe(
          startWith(source.value),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((value) => {
          target.patchValue(mirrorToReadonlyControl(value), {
            emitEvent: false,
          });
          this.cdr.markForCheck();
        });
    }
  }

  onDemoSubmit(): void {
    this.form.markAllAsTouched();
    this.cdr.markForCheck();
    if (this.form.invalid) {
      return;
    }
  }
}
