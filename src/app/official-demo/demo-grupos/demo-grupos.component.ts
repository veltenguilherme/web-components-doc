import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CepFieldComponent,
  cepMaskCompleteValidator,
  cpfCnpjMaskCompleteValidator,
  CpfCnpjFieldComponent,
  DateFieldComponent,
  DecimalFieldComponent,
  IntegerFieldComponent,
  phoneBrMaskCompleteValidator,
  PhoneFieldComponent,
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
  FormRowJustify,
} from 'structra-ui';
import { LayoutGrupo } from '../_enums/layout-grupo.enum';
import {
  LayoutClienteField,
  LayoutPessoaField,
  LayoutUsuarioField,
} from '../_enums/layout-subgrupo-fields.enum';
import { DemoEstadosBindings } from '../_models/demo-estados-bindings.model';
import { atLeastOneInArray } from '../_utils/demo-form-validators';

@Component({
  selector: 'app-demo-grupos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    TextFieldComponent,
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
    FormGroupComponent,
    FormRowComponent,
    FormColComponent,
  ],
  templateUrl: './demo-grupos.component.html',
  styleUrl: './demo-grupos.component.scss',
})
export class DemoGruposComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  @Input({ required: true }) estados!: DemoEstadosBindings;

  @Output() readonly estadosPage = new EventEmitter<SelectPageRequested>();
  @Output() readonly estadosBuscaPage = new EventEmitter<DropdownSearchPageRequested>();

  readonly LayoutGrupo = LayoutGrupo;
  readonly LayoutPessoaField = LayoutPessoaField;
  readonly LayoutClienteField = LayoutClienteField;
  readonly LayoutUsuarioField = LayoutUsuarioField;
  readonly BaseButtonType = BaseButtonType;
  readonly FormRowGap = FormRowGap;
  readonly FormRowAlign = FormRowAlign;
  readonly FormRowJustify = FormRowJustify;
  readonly LayoutStackAlign = LayoutStackAlign;

  /** `true` após tentativa de envio do formulário de layout (alinhado a erros só após submit ou `dirty`). */
  private layoutFormSubmitAttempted = false;

  /** Colapso independente por subgrupo (Pessoa, Cliente, Usuário) dentro de «Grupos». */
  layoutGrupoCollapsed: Record<LayoutGrupo, boolean> = {
    [LayoutGrupo.Pessoa]: false,
    [LayoutGrupo.Cliente]: true,
    [LayoutGrupo.Usuario]: true,
  };

  readonly layoutForm = this.fb.group({
    [LayoutGrupo.Pessoa]: this.fb.group({
      [LayoutPessoaField.NomeCompleto]: ['', Validators.required],
      [LayoutPessoaField.Documento]: [
        null as string | null,
        [Validators.required, cpfCnpjMaskCompleteValidator()],
      ],
      [LayoutPessoaField.DataNascimento]: [null as string | null, Validators.required],
      [LayoutPessoaField.Telefone]: [
        null as string | null,
        [Validators.required, phoneBrMaskCompleteValidator(false)],
      ],
    }),
    [LayoutGrupo.Cliente]: this.fb.group({
      [LayoutClienteField.Cep]: [
        null as string | null,
        [Validators.required, cepMaskCompleteValidator()],
      ],
      [LayoutClienteField.Uf]: [null as string | null, Validators.required],
      [LayoutClienteField.Observacoes]: [null as string | null, Validators.required],
      [LayoutClienteField.FaturamentoMensal]: [null as number | null, Validators.required],
      [LayoutClienteField.FiliaisAtuacao]: [[] as string[], atLeastOneInArray],
      [LayoutClienteField.EstadoSedeBusca]: [null as string | null, Validators.required],
    }),
    [LayoutGrupo.Usuario]: this.fb.group({
      [LayoutUsuarioField.Email]: ['', [Validators.required, Validators.email]],
      [LayoutUsuarioField.Identificador]: ['', Validators.required],
      [LayoutUsuarioField.NivelSuporte]: [null as number | null, Validators.required],
      [LayoutUsuarioField.AceiteComunicacoes]: [false],
      [LayoutUsuarioField.SessaoAtiva]: [false],
    }),
  });

  onLayoutDemoSubmit(event?: Event): void {
    event?.preventDefault();
    this.layoutFormSubmitAttempted = true;
    this.layoutForm.markAllAsTouched();
    this.layoutForm.updateValueAndValidity({ emitEvent: false });
    this.cdr.markForCheck();
    if (this.layoutForm.invalid) {
      return;
    }
  }

  layoutGrupoCollapsedState(id: LayoutGrupo): boolean {
    return this.layoutGrupoCollapsed[id];
  }

  onLayoutGrupoCollapsedChange(id: LayoutGrupo, next: boolean): void {
    this.layoutGrupoCollapsed = { ...this.layoutGrupoCollapsed, [id]: next };
    this.cdr.markForCheck();
  }

  layoutGrupoComErro(id: LayoutGrupo): boolean {
    const g = this.layoutForm.get(id);
    if (!g?.invalid) {
      return false;
    }
    return this.layoutSubgrupoTemControloComErroVisivel(g);
  }

  private layoutSubgrupoTemControloComErroVisivel(c: AbstractControl): boolean {
    if (c instanceof FormControl) {
      return (
        c.invalid &&
        (c.dirty || this.layoutFormSubmitAttempted)
      );
    }
    if (c instanceof FormGroup) {
      for (const key of Object.keys(c.controls)) {
        const child = c.controls[key];
        if (child && this.layoutSubgrupoTemControloComErroVisivel(child)) {
          return true;
        }
      }
    }
    if (c instanceof FormArray) {
      for (let i = 0; i < c.length; i++) {
        const child = c.at(i);
        if (child && this.layoutSubgrupoTemControloComErroVisivel(child)) {
          return true;
        }
      }
    }
    return false;
  }
}
