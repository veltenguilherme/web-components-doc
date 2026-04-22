import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  ButtonComponent,
  BaseButtonType,
  BaseButtonVariant,
} from 'structra-ui';
import {
  PopoverBodyTemplateDirective,
  PopoverFooterTemplateDirective,
  PopoverTriggerDirective,
  TooltipComponent,
  TooltipPanelTemplateDirective,
  PopoverComponent,
  OverlayPlacement,
} from 'structra-ui';
import {
  FormColComponent,
  FormGroupComponent,
  FormRowAlign,
  FormRowComponent,
  FormLayoutGap,
} from 'structra-ui';

@Component({
  selector: 'app-demo-overlay',
  standalone: true,
  imports: [
    FormGroupComponent,
    FormRowComponent,
    FormColComponent,
    ButtonComponent,
    TooltipComponent,
    TooltipPanelTemplateDirective,
    PopoverComponent,
    PopoverTriggerDirective,
    PopoverBodyTemplateDirective,
    PopoverFooterTemplateDirective,
  ],
  templateUrl: './demo-overlay.component.html',
  styleUrl: './demo-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoOverlayComponent {
  @Input({ required: true }) collapsed!: boolean;
  @Output() readonly collapsedChange = new EventEmitter<boolean>();

  readonly BaseButtonType = BaseButtonType;
  readonly BaseButtonVariant = BaseButtonVariant;
  readonly FormLayoutGap = FormLayoutGap;
  readonly FormRowAlign = FormRowAlign;
  readonly OverlayPlacement = OverlayPlacement;

  popoverSimpleOpen = false;
  popoverTitleOpen = false;
  popoverFooterOpen = false;
}
